"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getContract, getEthereum } from '@/lib/blockchainConfig';
import ConnectWallet from '@/components/ConnectWallet';

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

export default function VoterDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionOpen, setElectionOpen] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const eth = getEthereum();
      if (!eth) return;

      const contract = await getContract();
      
      // Check election status
      const status = await contract.votingActive();
      setElectionOpen(status);

      // Check if user has voted
      const accounts = await eth.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const voted = await contract.hasVoted(accounts[0]);
        setHasVoted(voted);
      }

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

  const handleVote = async (candidateId: number) => {
    try {
      setMessage('Please confirm the transaction in MetaMask...');
      const contract = await getContract();
      const tx = await contract.vote(candidateId);
      setMessage('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setMessage('Vote cast successfully!');
      setHasVoted(true);
      loadBlockchainData(); // Refresh data
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to cast vote: ' + (err.reason || err.message));
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading blockchain data...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Voter Dashboard</h1>
          <ConnectWallet />
        </div>

        {message && (
          <div className="p-4 bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200">
            {message}
          </div>
        )}

        {!electionOpen && (
          <div className="p-4 bg-yellow-100 text-yellow-800 rounded dark:bg-yellow-900 dark:text-yellow-200">
            The election is currently closed.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="p-6 bg-white rounded-lg shadow dark:bg-zinc-800 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold">{candidate.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Candidate ID: {candidate.id}
              </p>
              <button
                onClick={() => handleVote(candidate.id)}
                disabled={hasVoted || !electionOpen}
                className={`w-full py-2 rounded font-semibold ${
                  hasVoted
                    ? 'bg-green-600 cursor-not-allowed text-white'
                    : !electionOpen
                    ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {hasVoted ? 'Voted' : 'Vote'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
