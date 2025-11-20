'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: number;
  name: string;
  party: string;
  voteCount: number;
}

interface Block {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  hash: string;
}

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState('');
  const [electionOpen, setElectionOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'ADMIN') {
      router.push('/login');
    }

    fetchCandidates();
    fetchElectionStatus();
    // In a real app, we'd have a route to fetch blocks. For now, we can't easily visualize the chain without an API.
    // Let's add a simple API for blocks if needed, or just skip for now.
  }, []);

  const fetchCandidates = async () => {
    const res = await fetch('/api/candidates');
    const data = await res.json();
    setCandidates(data);
  };

  const fetchElectionStatus = async () => {
    const res = await fetch('/api/election');
    const data = await res.json();
    setElectionOpen(data.isOpen);
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCandidateName, party: newCandidateParty }),
    });
    setNewCandidateName('');
    setNewCandidateParty('');
    fetchCandidates();
    fetchCandidates();
  };

  const handleRemoveCandidate = async (id: number) => {
    if (!confirm('Are you sure you want to remove this candidate?')) return;
    
    await fetch('/api/candidates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchCandidates();
  };

  const toggleElection = async () => {
    const newState = !electionOpen;
    await fetch('/api/election', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen: newState }),
    });
    setElectionOpen(newState);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Election Control */}
          <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Election Control</h2>
            <div className="flex items-center justify-between">
              <span>Status: {electionOpen ? 'Open' : 'Closed'}</span>
              <button
                onClick={toggleElection}
                className={`px-4 py-2 rounded text-white ${
                  electionOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {electionOpen ? 'End Election' : 'Start Election'}
              </button>
            </div>
          </div>

          {/* Add Candidate */}
          <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Party"
                  value={newCandidateParty}
                  onChange={(e) => setNewCandidateParty(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Add Candidate
              </button>
            </form>
          </div>
        </div>

        {/* Candidates List */}
        <div className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Candidates & Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-zinc-700">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Party</th>
                  <th className="p-2">Votes</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b dark:border-zinc-700">
                    <td className="p-2">{candidate.id}</td>
                    <td className="p-2">{candidate.name}</td>
                    <td className="p-2">{candidate.party}</td>
                    <td className="p-2 font-bold">{candidate.voteCount}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleRemoveCandidate(candidate.id)}
                        className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
