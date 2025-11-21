# Decentralized Voting System (Blockchain-Based)

A secure, transparent, and tamper-proof voting application built on the **Ethereum Blockchain (Sepolia Testnet)**. This project leverages the power of decentralized ledgers to ensure that every vote is immutable, verifiable, and permanent.

## 🚀 Project Overview

Traditional voting systems often suffer from lack of transparency, potential for manipulation, and single points of failure. This **Decentralized Application (DApp)** solves these issues by recording every vote as a transaction on the Ethereum blockchain.

### Key Features

#### 🔐 Security & Integrity
-   **Immutable Ledger:** Once a vote is cast, it is written to the blockchain and cannot be altered or deleted.
-   **Decentralized Consensus:** No single central authority controls the database; the network validates transactions.
-   **Voter Anonymity:** Votes are linked to wallet addresses, not personal names, preserving privacy while ensuring validity.
-   **One-Person-One-Vote:** Smart contracts strictly enforce that each wallet address can only vote once per election.

#### 👮 Admin Dashboard
-   **Election Control:** Start and Stop elections with a single click.
-   **Candidate Management:** Add and remove candidates dynamically.
-   **Voter Management:** Assign specific Voter IDs (e.g., `#BCV1`) to physical wallet addresses.
-   **Reset Functionality:** The `startElection` function automatically resets vote counts and voter statuses for a fresh election cycle.

#### 🗳️ Voter Dashboard
-   **Secure Login:** Voters authenticate using a unique **Voter ID** and **Password** (off-chain verification) + **MetaMask Wallet** (on-chain signing).
-   **User-Friendly Interface:** Simple, intuitive design for casting votes.
-   **Real-Time Validation:** Immediate feedback if a user tries to vote twice.

#### 📊 Live Results
-   **Real-Time Updates:** Vote counts update automatically as blocks are mined.
-   **Winner Declaration:** The system automatically calculates and displays the winner when the election stops.
-   **Edge Case Handling:** Correctly handles "Draw" scenarios and "No Votes Cast" situations.

---

## 🛠️ Technology Stack

-   **Frontend Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Blockchain Interaction:** [Ethers.js v6](https://docs.ethers.org/v6/)
-   **Smart Contract Language:** [Solidity](https://soliditylang.org/) (v0.8.19)
-   **Network:** Sepolia Testnet
-   **Wallet:** [MetaMask](https://metamask.io/)

---

## 📜 Smart Contracts

This project evolved through three versions of the smart contract to achieve robust functionality. All source files are included in the repository.

### 1. `voting.sol` (V1 - Prototype)
-   Basic voting functionality.
-   Simple candidate addition.
-   No advanced voter verification.

### 2. `VotingV2Final.sol` (V2 - Advanced Auth)
-   Introduced **Pre-Seeded Voters** (#BCV1 - #BCV20).
-   Added **Password Hashing** for secure voter assignment.
-   Implemented `adminAssignVoterAddress` for manual overrides.

### 3. `VotingV3Reset.sol` (V3 - **Production Version**)
-   **Current Active Contract.**
-   **Address:** `0x6b038e4F513B8AA6677420e349bF80A02FEd5344`
-   **Key Upgrade:** Added `startElection()` logic that:
    1.  Resets all candidate vote counts to `0`.
    2.  Resets the `voted` status of all seeded voters to `false`.
    3.  Enables a new election cycle without redeploying the contract.

---

## 🛡️ Cybersecurity & Architecture

This project implements core cybersecurity principles:

### Confidentiality
-   **Pseudo-anonymity:** Voter real-world identities are decoupled from their on-chain votes.
-   **Password Protection:** Voter IDs are protected by hashed passwords (Keccak-256) to prevent unauthorized wallet binding.

### Integrity
-   **Cryptographic Hashing:** Every block is cryptographically linked to the previous one. Changing a past vote would require rewriting the entire chain.
-   **Smart Contract Logic:** The contract code is immutable once deployed. No admin can "inject" fake votes.

### Availability
-   **Distributed Network:** The Ethereum network runs on thousands of nodes. The application backend (the blockchain) has 100% uptime and is resistant to DDoS attacks.

---

## 🚀 Getting Started

### Prerequisites
1.  **Node.js** (v18 or higher).
2.  **MetaMask** browser extension.
3.  **Sepolia ETH** (Testnet currency) for gas fees. [Get it from a Faucet](https://sepoliafaucet.com/).

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Harsha430/Voting-System-Using-Blockchain.git
    cd "Voting Using Blockchain"
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open the App**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Usage Guide

### For Admins
1.  Go to **/Admin Login**.
2.  Enter Admin Username (`admin`) and Password (`123456`).
3.  **Claim Admin:** If it's the first time, click "Claim Admin" to bind your wallet.
4.  **Dashboard:**
    -   **Add Candidates:** Enter Name, Party, and Symbol.
    -   **Assign Voters:** Link a Voter ID (e.g., `#BCV1`) to a user's Wallet Address.
    -   **Start Election:** Click "Start Election" to begin (this resets previous scores).
    -   **Stop Election:** Click "Stop Election" to end voting and declare a winner.

### For Voters
1.  Go to **/Voter Login**.
2.  Enter your **Voter ID** (e.g., `#BCV1`) and **Password** (`123456`).
3.  **Bind Wallet:** The system will link your ID to your connected MetaMask wallet.
4.  **Vote:** Select your preferred candidate and click "Vote". Confirm the transaction in MetaMask.

### Viewing Results
-   Go to **/Results** or click "Live Results" on the home page.
-   Watch vote counts update in real-time.
-   See the winner declaration when the election ends.

---

## 📂 Project Structure

-   `/app`: Next.js App Router pages (Admin, Voter, Results, About).
-   `/components`: Reusable UI components (ConnectWallet, etc.).
-   `/lib`: Blockchain configuration and helper functions.
-   `VotingV3Reset.sol`: The Solidity smart contract source code.

---

**Developed by Harsha**
