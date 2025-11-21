"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getContract } from '@/lib/blockchain';
import ConnectWallet from '@/components/ConnectWallet';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Checking admin status...');

    try {
      const contract = await getContract();
      const eth = await import('@/lib/blockchain').then(m => m.getEthereum());
      if (!eth) {
         setMessage('MetaMask not found');
         setLoading(false);
         return;
      }
      const accounts = await eth.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        setMessage('Please connect your wallet first');
        setLoading(false);
        return;
      }

      // 1. Check if already admin
      const isAdmin = await contract.checkIsAdmin(accounts[0]);
      if (isAdmin) {
        setMessage('Already an admin. Redirecting...');
        router.push('/admin/dashboard');
        return;
      }

      // 2. If not, try to claim
      setMessage('Claiming admin rights...');
      const tx = await contract.claimAdmin(username, password);
      setMessage('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setMessage('Admin rights claimed! Redirecting...');
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      // If error says "Already assigned", it might mean someone else has it, OR we are it but check failed?
      // Usually "Already assigned" means the username is taken.
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
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {loading ? 'Processing...' : 'Claim Admin & Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
