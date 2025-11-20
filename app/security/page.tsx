'use client';

import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cyber Security in Blockchain Voting
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            How we ensure integrity, confidentiality, and availability.
          </p>
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {/* Section 1: Blockchain Immutability */}
        <section className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
          <div className="flex items-start gap-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">1. Immutable Ledger (Blockchain)</h2>
              <p className="leading-relaxed">
                Every vote cast in this system is recorded as a <strong>Block</strong>. Each block contains a cryptographic hash of the previous block, creating an unbreakable chain.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                <li>
                  <strong>Tamper Proof:</strong> If anyone tries to modify a past vote, the hash of that block changes.
                </li>
                <li>
                  <strong>Chain Reaction:</strong> Changing one block invalidates all subsequent blocks, making tampering immediately detectable.
                </li>
              </ul>
              <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                Block N Hash = SHA256(Data + Timestamp + PreviousHash + Nonce)
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Cryptographic Hashing */}
        <section className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
          <div className="flex items-start gap-6">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">2. SHA-256 Hashing</h2>
              <p className="leading-relaxed">
                We use the <strong>SHA-256</strong> algorithm, a standard in modern cryptography, for multiple purposes:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-zinc-600 rounded-lg">
                  <h3 className="font-semibold mb-2">Password Security</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    User passwords are hashed before storage. Even database administrators cannot see the actual passwords.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-zinc-600 rounded-lg">
                  <h3 className="font-semibold mb-2">Vote Integrity</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vote data is hashed to ensure that the content of the vote (who you voted for) cannot be altered in transit or storage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Access Control */}
        <section className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700">
          <div className="flex items-start gap-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">3. Role-Based Access Control (RBAC)</h2>
              <p className="leading-relaxed">
                The system enforces strict separation of duties:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded">ADMIN</span>
                  <span className="text-gray-600 dark:text-gray-300">Can manage candidates and elections but <strong>cannot cast votes</strong>.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded">VOTER</span>
                  <span className="text-gray-600 dark:text-gray-300">Can cast exactly one vote. Cannot modify election parameters.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
