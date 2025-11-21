"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getContract } from '@/lib/blockchain';
import ConnectWallet from '@/components/ConnectWallet';

export default function VoterLogin() {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Verifying credentials...');

    try {
      const contract = await getContract();
      
      // 1. Verify credentials
      const isValid = await contract.verifyVoterCredentials(voterId, password);
      
      if (!isValid) {
        setMessage('Invalid Voter ID or Password');
        setLoading(false);
        return;
      }

      // 2. Bind wallet address
      setMessage('Credentials valid. Please confirm wallet binding transaction...');
      const tx = await contract.assignVoterAddress(voterId, password);
      setMessage('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      // 3. Redirect
      localStorage.setItem('voterId', voterId);
      router.push('/voter/dashboard');
    } catch (err: any) {
      console.error(err);
      setMessage('Login failed: ' + (err.reason || err.message));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4 relative">
      <Link href="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-2">
        ← Back to Home
      </Link>
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8">
        <div className="flex justify-end mb-4">
          <ConnectWallet />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Voter Login</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Voter ID</label>
            <input
              type="text"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              placeholder="#BCV..."
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Login & Bind Wallet'}
          </button>
        </form>
      </div>
    </div>
  );
}
