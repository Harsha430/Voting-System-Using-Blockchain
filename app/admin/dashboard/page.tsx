"use client";

import { useState, useEffect } from 'react';
import { getContract, getEthereum } from '@/lib/blockchain';
import ConnectWallet from '@/components/ConnectWallet';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: number;
  name: string;
  party: string;
  symbol: string;
  active: boolean;
}

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionOpen, setElectionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newParty, setNewParty] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  
  const [assignId, setAssignId] = useState('');
  const [assignAddr, setAssignAddr] = useState('');

  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const contract = await getContract();
      const eth = await getEthereum();
      if (!eth) return;
      const accounts = await eth.request({ method: 'eth_accounts' });
      
      if (accounts.length === 0) {
        router.push('/admin/login');
        return;
      }

      const isAdmin = await contract.checkIsAdmin(accounts[0]);
      if (!isAdmin) {
        router.push('/admin/login');
        return;
      }

      loadData();
    } catch (err) {
      console.error(err);
      router.push('/admin/login');
    }
  };

  const loadData = async () => {
    try {
      const contract = await getContract();
      
      // Status
      const status = await contract.votingActive();
      setElectionOpen(status);

      // Candidates
      const activeIds = await contract.getActiveCandidateIds();
      const loadedCandidates = [];
      
      for (const id of activeIds) {
        const c = await contract.getCandidate(id);
        loadedCandidates.push({
          id: Number(id),
          name: c.name,
          party: c.party,
          symbol: c.symbol,
          active: c.active
        });
      }
      setCandidates(loadedCandidates);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage('Confirm transaction...');
      const contract = await getContract();
      const tx = await contract.addCandidate(newName, newParty, newSymbol);
      setMessage('Waiting for confirmation...');
      await tx.wait();
      setMessage('Candidate added!');
      setNewName(''); setNewParty(''); setNewSymbol('');
      loadData();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  const handleRemoveCandidate = async (id: number) => {
    if (!confirm('Remove this candidate?')) return;
    try {
      setMessage('Confirm transaction...');
      const contract = await getContract();
      const tx = await contract.removeCandidate(id);
      setMessage('Waiting for confirmation...');
      await tx.wait();
      setMessage('Candidate removed!');
      loadData();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  const handleStartElection = async () => {
    try {
      setMessage('Starting Election...');
      const contract = await getContract();
      const tx = await contract.startElection();
      setMessage('Waiting for confirmation...');
      await tx.wait();
      setMessage('Election Started!');
      setElectionOpen(true);
      loadData();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  const handleStopElection = async () => {
    try {
      setMessage('Stopping Election...');
      const contract = await getContract();
      const tx = await contract.stopElection();
      setMessage('Waiting for confirmation...');
      await tx.wait();
      setMessage('Election Stopped!');
      setElectionOpen(false);
      loadData();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  const handleAssignVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage('Confirm transaction...');
      const contract = await getContract();
      const tx = await contract.adminAssignVoterAddress(assignId, assignAddr);
      setMessage('Waiting for confirmation...');
      await tx.wait();
      setMessage('Voter assigned!');
      setAssignId(''); setAssignAddr('');
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <ConnectWallet />
            <button
              onClick={() => router.push('/admin/login')}
              className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 bg-blue-100 text-blue-800 rounded">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Election Control */}
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Election Status</h2>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-semibold ${electionOpen ? 'text-green-600' : 'text-red-600'}`}>
                {electionOpen ? 'Active' : 'Paused'}
              </span>
              
              {electionOpen ? (
                <button
                  onClick={handleStopElection}
                  className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600"
                >
                  Stop Election
                </button>
              ) : (
                <button
                  onClick={handleStartElection}
                  className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600"
                >
                  Start Election
                </button>
              )}
            </div>
          </div>

          {/* Assign Voter */}
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Assign Voter Address</h2>
            <form onSubmit={handleAssignVoter} className="space-y-2">
              <input
                placeholder="Voter ID (#BCV...)"
                value={assignId}
                onChange={e => setAssignId(e.target.value)}
                className="w-full p-2 border rounded dark:bg-zinc-700"
                required
              />
              <input
                placeholder="Wallet Address (0x...)"
                value={assignAddr}
                onChange={e => setAssignAddr(e.target.value)}
                className="w-full p-2 border rounded dark:bg-zinc-700"
                required
              />
              <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Assign Voter
              </button>
            </form>
          </div>

          {/* Add Candidate */}
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Add Candidate</h2>
            <form onSubmit={handleAddCandidate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="p-2 border rounded dark:bg-zinc-700"
                required
              />
              <input
                placeholder="Party"
                value={newParty}
                onChange={e => setNewParty(e.target.value)}
                className="p-2 border rounded dark:bg-zinc-700"
                required
              />
              <input
                placeholder="Symbol"
                value={newSymbol}
                onChange={e => setNewSymbol(e.target.value)}
                className="p-2 border rounded dark:bg-zinc-700"
                required
              />
              <button type="submit" className="md:col-span-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Candidate
              </button>
            </form>
          </div>
        </div>

        {/* Candidate List */}
        <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Manage Candidates</h2>
          <div className="grid gap-4">
            {candidates.map(c => (
              <div key={c.id} className="flex justify-between items-center p-4 border rounded dark:border-zinc-700">
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.party} ({c.symbol})</p>
                </div>
                <button
                  onClick={() => handleRemoveCandidate(c.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
