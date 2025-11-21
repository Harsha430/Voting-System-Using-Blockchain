"use client";

import { useState, useEffect } from 'react';
import { getContract } from '@/lib/blockchainConfig';
import ConnectWallet from '@/components/ConnectWallet';

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [electionOpen, setElectionOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const contract = await getContract();
      
      // Check election status
      const status = await contract.votingActive();
      setElectionOpen(status);

      // Fetch candidates
      const count = await contract.candidatesCount();
      const loadedCandidates = [];
      for (let i = 0; i < Number(count); i++) {
        const candidate = await contract.getCandidate(i);
        loadedCandidates.push({
          id: i,
          name: candidate.name,
          voteCount: Number(candidate.count),
        });
      }
      setCandidates(loadedCandidates);
      setLoading(false);
    } catch (error) {
      console.error("Error loading blockchain data:", error);
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMessage('Confirm adding candidate in MetaMask...');
      const contract = await getContract();
      const tx = await contract.addCandidate(newCandidateName);
      setMessage('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setMessage('Candidate added successfully!');
      setNewCandidateName('');
      loadBlockchainData();
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to add candidate: ' + (err.reason || err.message));
    }
  };

  const toggleElection = async () => {
    try {
      const newState = !electionOpen;
      setMessage(`Confirm ${newState ? 'starting' : 'stopping'} election in MetaMask...`);
      const contract = await getContract();
      const tx = await contract.setVotingStatus(newState);
      setMessage('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setMessage(`Election ${newState ? 'started' : 'stopped'} successfully!`);
      setElectionOpen(newState);
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to update election status: ' + (err.reason || err.message));
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading blockchain data...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <ConnectWallet />
        </div>

        {message && (
          <div className="p-4 bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200">
            {message}
          </div>
        )}

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
                  <th className="p-2">Votes</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b dark:border-zinc-700">
                    <td className="p-2">{candidate.id}</td>
                    <td className="p-2">{candidate.name}</td>
                    <td className="p-2 font-bold">{candidate.voteCount}</td>
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
