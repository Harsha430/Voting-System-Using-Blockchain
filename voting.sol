// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlockchainVoting {

    address public admin;

    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public hasVoted;
    mapping(uint => Candidate) public candidates;

    uint public candidatesCount;
    bool public votingActive;

    event VoteCasted(address voter, uint candidateId, uint timestamp);
    event CandidateAdded(string name);
    event VotingStatusChanged(bool active);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier votingEnabled() {
        require(votingActive == true, "Voting is not active");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidates[candidatesCount] = Candidate(_name, 0);
        candidatesCount++;
        emit CandidateAdded(_name);
    }

    function setVotingStatus(bool _status) public onlyAdmin {
        votingActive = _status;
        emit VotingStatusChanged(_status);
    }

    function vote(uint _candidateId) public votingEnabled {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateId < candidatesCount, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VoteCasted(msg.sender, _candidateId, block.timestamp);
    }

    function getCandidate(uint _id) public view returns (string memory name, uint count) {
        require(_id < candidatesCount, "Invalid ID");
        return (candidates[_id].name, candidates[_id].voteCount);
    }
}
