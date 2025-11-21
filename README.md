# Voting DApp (Blockchain Based)

A secure, transparent, and decentralized voting application built with **Next.js 14**, **TypeScript**, and **Ethereum Smart Contracts (Sepolia Testnet)**.

## 🌟 Features

-   **Decentralized Voting:** Votes are stored immutably on the Ethereum blockchain.
-   **Admin Dashboard:**
    -   Start/Stop Elections.
    -   Add/Remove Candidates.
    -   Assign Voter IDs to Wallet Addresses.
    -   Real-time status updates.
-   **Voter Dashboard:**
    -   Secure Login with Voter ID & Password.
    -   One-vote-per-person enforcement.
    -   Real-time candidate list.
-   **Live Results:**
    -   Real-time vote counting.
    -   Automatic winner declaration.
    -   Handling of "Draw" and "No Votes" scenarios.
-   **Security:**
    -   Metamask Wallet integration.
    -   Role-based access control (Admin vs Voter).

## 🛠️ Tech Stack

-   **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
-   **Blockchain:** Solidity, Ethers.js v6.
-   **Network:** Sepolia Testnet.
-   **Wallet:** MetaMask.

## 📜 Smart Contract

-   **Network:** Sepolia
-   **Contract Address:** `0x6b038e4F513B8AA6677420e349bF80A02FEd5344`

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18+) installed.
2.  **MetaMask** extension installed in your browser.
3.  Some **Sepolia ETH** (for gas fees).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Harsha430/Voting-System-Using-Blockchain.git
    cd "Voting Using Blockchain"
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the application**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## � Usage Guide

### 1. Admin Setup
-   Navigate to `/admin/login`.
-   Login with your Admin credentials.
-   Claim Admin rights (if first time) or login.
-   Add Candidates and Assign Voters.
-   Click **"Start Election"**.

### 2. Voting
-   Voters navigate to `/voter/login`.
-   Enter Voter ID and Password.
-   Cast your vote on the dashboard.

### 3. Results
-   Visit `/results` to see live updates.
-   When Admin stops the election, the winner is declared automatically.

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
