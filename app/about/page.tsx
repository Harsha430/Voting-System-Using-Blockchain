"use client";

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Project Security & Architecture
          </h1>
          <Link href="/" className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 transition">
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-12">
          {/* Introduction */}
          <section className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Overview</h2>
            <p className="leading-relaxed text-lg">
              This Decentralized Voting Application (DApp) leverages the <strong>Ethereum Blockchain (Sepolia Testnet)</strong> to guarantee a tamper-proof, transparent, and secure election process. By replacing traditional centralized databases with a distributed ledger, we eliminate single points of failure and trust issues.
            </p>
          </section>

          {/* CIA Triad Application */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">Cybersecurity Principles Applied</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                <h3 className="text-xl font-bold mb-3">Confidentiality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  While votes are public, voter identities are protected via <strong>Pseudo-anonymity</strong>. Wallet addresses are used instead of real names on the public ledger.
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md border-t-4 border-green-500">
                <h3 className="text-xl font-bold mb-3">Integrity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Immutability:</strong> Once a vote is mined into a block, it cannot be altered or deleted. The cryptographic links between blocks ensure history remains untouched.
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md border-t-4 border-purple-500">
                <h3 className="text-xl font-bold mb-3">Availability</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The <strong>Decentralized Network</strong> ensures 100% uptime. Even if one node goes down, the network continues to process transactions and serve data.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Security Features */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Technical Security Implementation</h2>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">🔐 Smart Contract Security</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Role-Based Access Control (RBAC):</strong> Only the Admin wallet can start/stop elections or add candidates (`onlyAdmin` modifier).</li>
                  <li><strong>State Locking:</strong> Voting functions are cryptographically locked when the election is paused.</li>
                  <li><strong>Double-Voting Prevention:</strong> The contract maintains a `hasVoted` mapping that permanently flags an address after one vote.</li>
                </ul>
              </div>

              <div className="flex-1 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">🛡️ Frontend & Auth Security</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Wallet Binding:</strong> A Voter ID is permanently bound to a specific MetaMask wallet address upon first login.</li>
                  <li><strong>2-Factor Authentication (Implicit):</strong> Requires both "Something you know" (Voter ID/Password) and "Something you have" (Private Key/Wallet).</li>
                  <li><strong>Client-Side Validation:</strong> Prevents invalid transactions before they reach the network, saving gas fees.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Blockchain Specifics */}
          <section className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Why Blockchain?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-lg mb-2">🚫 Traditional Database</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>❌ Centralized Admin can manipulate votes.</li>
                  <li>❌ Single point of failure (server crash).</li>
                  <li>❌ Opaque process (users can't verify).</li>
                  <li>❌ Vulnerable to SQL Injection.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">✅ Blockchain Solution</h4>
                <ul className="space-y-2 text-green-400 text-sm">
                  <li>✔️ Consensus mechanism prevents manipulation.</li>
                  <li>✔️ Distributed ledger ensures redundancy.</li>
                  <li>✔️ Publicly verifiable transactions.</li>
                  <li>✔️ Cryptographic security (SHA-256/Keccak-256).</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
