// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Decentralized Voting (V2 Final)
/// @notice Supports: candidate add/remove (soft), admin registration, voter pre-seed (#BCV1..#BCV20),
/// voter password-based assignment to a wallet, one-vote-per-voter, candidate party & symbol (text).
contract VotingV2Final {

    // ---------- Owner / Admins ----------
    address public owner;

    // Admin credential storage (usernameHash -> passwordHash) and assigned address
    mapping(bytes32 => bytes32) private adminPasswordHash;      // usernameHash => passwordHash
    mapping(bytes32 => address) private adminAssignedAddress;   // usernameHash => assigned address
    mapping(address => bool) public isAdminAddress;             // address => is admin (for modifiers)

    // ---------- Candidates ----------
    struct Candidate {
        string name;
        string party;
        string symbol; // text symbol
        uint256 voteCount;
        bool active;
    }
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    // ---------- Voters ----------
    struct VoterInfo {
        string id;            // readable ID like "#BCV1"
        bytes32 passwordHash; // keccak256 hash of password
        address assigned;     // the wallet address that claimed this voter ID; zero if not yet claimed
        bool voted;           // true if they already voted
        bool registered;      // true if this entry exists and is allowed to vote (pre-seeded)
    }
    mapping(bytes32 => VoterInfo) private seededVoters; // idHash => VoterInfo

    // Map assigned address => idHash for quick lookup
    mapping(address => bytes32) public addressToIdHash;

    // ---------- Election state ----------
    bool public votingActive;

    // ---------- Events ----------
    event CandidateAdded(uint256 indexed id, string name, string party, string symbol);
    event CandidateRemoved(uint256 indexed id);
    event VoterAssigned(address indexed voterAddress, string id);
    event VoteCasted(address indexed voterAddress, uint256 indexed candidateId);
    event AdminRegistered(string username, address assignedAddress);
    event AdminClaimed(string username, address claimer);
    event VotingStatusChanged(bool active);

    // ---------- Modifiers ----------
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAdmin() {
        require(isAdminAddress[msg.sender] == true, "Only admin");
        _;
    }

    modifier votingOpen() {
        require(votingActive == true, "Voting not active");
        _;
    }

    // ---------- Constructor ----------
    /// @dev Deploy with initial owner and pre-seed 20 voters (#BCV1..#BCV20) with password "123456"
    constructor() {
        owner = msg.sender;

        // owner is admin by default
        isAdminAddress[owner] = true;

        // Create default admin credential (username "admin", password "123456") assigned to owner
        bytes32 adminNameHash = keccak256(abi.encodePacked("admin"));
        bytes32 adminPassHash = keccak256(abi.encodePacked("123456"));
        adminPasswordHash[adminNameHash] = adminPassHash;
        adminAssignedAddress[adminNameHash] = owner;
        emit AdminRegistered("admin", owner);

        // Pre-seed 20 voters: #BCV1 .. #BCV20 with password "123456"
        bytes32 pwdHash = keccak256(abi.encodePacked("123456"));
        for (uint256 i = 1; i <= 20; i++) {
            string memory id = _buildId(i); // "#BCV1" ...
            bytes32 idHash = keccak256(abi.encodePacked(id));
            seededVoters[idHash] = VoterInfo({
                id: id,
                passwordHash: pwdHash,
                assigned: address(0),
                voted: false,
                registered: true
            });
        }
    }

    // ---------- Helper to build ID string (#BCV1 .. #BCV20) ----------
    function _buildId(uint256 index) internal pure returns (string memory) {
        // naive concatenation
        // index is small (1..20)
        // returns "#BCV" + index as decimal
        bytes memory a = bytes("#BCV");
        bytes memory b = _uintToBytes(index);
        return string(abi.encodePacked(a, b));
    }

    function _uintToBytes(uint256 _i) internal pure returns (bytes memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = uint8(48 + uint256(_i % 10));
            bstr[k] = bytes1(temp);
            _i /= 10;
        }
        return bstr;
    }

    // ---------- Admin management ----------

    /// @notice Owner registers an admin account with username and password and optionally assigns an address immediately
    function ownerRegisterAdmin(string memory username, string memory password, address assignTo) external onlyOwner {
        bytes32 unameHash = keccak256(abi.encodePacked(username));
        bytes32 pwdHash = keccak256(abi.encodePacked(password));
        adminPasswordHash[unameHash] = pwdHash;
        if (assignTo != address(0)) {
            adminAssignedAddress[unameHash] = assignTo;
            isAdminAddress[assignTo] = true;
            emit AdminRegistered(username, assignTo);
        } else {
            // registered but unassigned; can be claimed by claimAdmin
            adminAssignedAddress[unameHash] = address(0);
            emit AdminRegistered(username, address(0));
        }
    }

    /// @notice Admin account can be claimed by an address providing the username and password (if not assigned yet)
    function claimAdmin(string memory username, string memory password) external {
        bytes32 unameHash = keccak256(abi.encodePacked(username));
        bytes32 pwdHash = keccak256(abi.encodePacked(password));
        require(adminPasswordHash[unameHash] != 0x0, "Admin not registered");
        require(adminPasswordHash[unameHash] == pwdHash, "Invalid credentials");
        require(adminAssignedAddress[unameHash] == address(0), "Already assigned");
        adminAssignedAddress[unameHash] = msg.sender;
        isAdminAddress[msg.sender] = true;
        emit AdminClaimed(username, msg.sender);
    }

    /// @notice Owner can assign an already-registered admin username to an address
    function ownerAssignAdminAddress(string memory username, address assignTo) external onlyOwner {
        bytes32 unameHash = keccak256(abi.encodePacked(username));
        require(adminPasswordHash[unameHash] != 0x0, "Not registered");
        adminAssignedAddress[unameHash] = assignTo;
        isAdminAddress[assignTo] = true;
        emit AdminRegistered(username, assignTo);
    }

    // ---------- Candidate management (admin) ----------

    /// @notice Add a candidate (admin only)
    function addCandidate(string memory name, string memory party, string memory symbol) external onlyAdmin {
        candidates[candidatesCount] = Candidate({
            name: name,
            party: party,
            symbol: symbol,
            voteCount: 0,
            active: true
        });
        emit CandidateAdded(candidatesCount, name, party, symbol);
        candidatesCount++;
    }

    /// @notice Soft remove a candidate (admin only)
    function removeCandidate(uint256 candidateId) external onlyAdmin {
        require(candidateId < candidatesCount, "Invalid candidate");
        require(candidates[candidateId].active == true, "Already inactive");
        candidates[candidateId].active = false;
        emit CandidateRemoved(candidateId);
    }

    // ---------- Voter assignment & auth ----------

    /// @notice A voter uses this to bind their wallet address to their pre-seeded voter ID.
    /// @dev Must supply correct ID and password. If that ID is pre-seeded and unassigned, assigns it to msg.sender.
    function assignVoterAddress(string memory id, string memory password) external {
        bytes32 idHash = keccak256(abi.encodePacked(id));
        VoterInfo storage info = seededVoters[idHash];
        require(info.registered == true, "Voter ID not registered");
        require(info.assigned == address(0) || info.assigned == msg.sender, "ID already assigned to another address");
        bytes32 suppliedHash = keccak256(abi.encodePacked(password));
        require(suppliedHash == info.passwordHash, "Invalid password");
        // assign if unassigned
        info.assigned = msg.sender;
        addressToIdHash[msg.sender] = idHash;
        emit VoterAssigned(msg.sender, id);
    }

    /// @notice Owner or admin can assign an ID to a specific address (override) — use carefully
    function adminAssignVoterAddress(string memory id, address voterAddress) external onlyAdmin {
        bytes32 idHash = keccak256(abi.encodePacked(id));
        VoterInfo storage info = seededVoters[idHash];
        require(info.registered == true, "Voter ID not registered");
        require(voterAddress != address(0), "Zero address");
        info.assigned = voterAddress;
        addressToIdHash[voterAddress] = idHash;
        emit VoterAssigned(voterAddress, id);
    }

    /// @notice Verify credentials off-chain (view function). Returns true if id+password match pre-seeded record.
    function verifyVoterCredentials(string memory id, string memory password) external view returns (bool) {
        bytes32 idHash = keccak256(abi.encodePacked(id));
        VoterInfo storage info = seededVoters[idHash];
        if (!info.registered) return false;
        bytes32 supplied = keccak256(abi.encodePacked(password));
        return (supplied == info.passwordHash);
    }

    // ---------- Voting ----------

    /// @notice Cast a vote for a candidate. Caller must be the assigned wallet for a pre-seeded voter and must not have voted yet.
    function vote(uint256 candidateId) external votingOpen {
        require(candidateId < candidatesCount, "Invalid candidate");
        require(candidates[candidateId].active == true, "Candidate inactive");
        bytes32 idHash = addressToIdHash[msg.sender];
        require(idHash != 0x0, "Address not assigned to a voter ID");
        VoterInfo storage info = seededVoters[idHash];
        require(info.registered == true, "Voter not registered");
        require(info.assigned == msg.sender, "Address not assigned to this ID");
        require(info.voted == false, "Already voted");

        // mark voted
        info.voted = true;
        // increment vote count
        candidates[candidateId].voteCount += 1;

        emit VoteCasted(msg.sender, candidateId);
    }

    // ---------- Read helpers ----------

    /// @notice Get candidate details
    function getCandidate(uint256 id) external view returns (string memory name, string memory party, string memory symbol, uint256 votes, bool active) {
        require(id < candidatesCount, "Invalid id");
        Candidate storage c = candidates[id];
        return (c.name, c.party, c.symbol, c.voteCount, c.active);
    }

    /// @notice Get seeded voter info for the caller (if assigned)
    function getMyVoterInfo() external view returns (string memory id, bool voted, address assigned) {
        bytes32 idHash = addressToIdHash[msg.sender];
        if (idHash == 0x0) {
            return ("", false, address(0));
        }
        VoterInfo storage info = seededVoters[idHash];
        return (info.id, info.voted, info.assigned);
    }

    /// @notice Get voter info by ID (admin only)
    function adminGetVoterById(string memory id) external view onlyAdmin returns (string memory, address, bool) {
        bytes32 idHash = keccak256(abi.encodePacked(id));
        VoterInfo storage info = seededVoters[idHash];
        require(info.registered == true, "Not registered");
        return (info.id, info.assigned, info.voted);
    }

    /// @notice Total candidate count
    function getCandidatesCount() external view returns (uint256) {
        return candidatesCount;
    }

    /// @notice Get IDs of active candidates (ids only). Clients can then call getCandidate for details.
    function getActiveCandidateIds() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < candidatesCount; i++) {
            if (candidates[i].active) activeCount++;
        }
        uint256[] memory ids = new uint256[](activeCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < candidatesCount; i++) {
            if (candidates[i].active) {
                ids[idx] = i;
                idx++;
            }
        }
        return ids;
    }

    // ---------- Admin actions ----------

    /// @notice Start or stop voting (admin only)
    function setVotingStatus(bool _active) external onlyAdmin {
        votingActive = _active;
        emit VotingStatusChanged(_active);
    }

    /// @notice Admin may register a new seeded voter entry (optional utility)
    function adminRegisterVoter(string memory id, string memory password) external onlyAdmin {
        bytes32 idHash = keccak256(abi.encodePacked(id));
        require(!seededVoters[idHash].registered, "Already registered");
        seededVoters[idHash] = VoterInfo({
            id: id,
            passwordHash: keccak256(abi.encodePacked(password)),
            assigned: address(0),
            voted: false,
            registered: true
        });
    }

    /// @notice Admin can reset a voter's voted flag (use with care)
    function adminResetVoterVote(string memory id) external onlyAdmin {
        bytes32 idHash = keccak256(abi.encodePacked(id));
        require(seededVoters[idHash].registered, "Not registered");
        seededVoters[idHash].voted = false;
    }

    // ---------- Utility ----------

    /// @notice Returns whether an address is currently an admin
    function checkIsAdmin(address who) external view returns (bool) {
        return isAdminAddress[who];
    }

    /// @notice Owner can transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
        isAdminAddress[newOwner] = true;
    }

}
