"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getContract, getEthereum } from '@/lib/blockchain';
import ConnectWallet from '@/components/ConnectWallet';

interface Candidate {
  id: number;
  name: string;
  party: string;
  symbol: string;
  active: boolean;
}

export default function VoterDashboard() {
  const [voterId, setVoterId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedId = localStorage.getItem('voterId');
    if (!storedId) {
      router.push('/voter/login');
      return;
    }
    setVoterId(storedId);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const contract = await getContract();
      const eth = getEthereum();
      
      // Check if voted
      const info = await contract.getMyVoterInfo();
      setHasVoted(info.voted);

      // Get active candidates
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

  const handleVote = async (id: number) => {
    try {
      setMessage('Confirm vote in MetaMask...');
      const contract = await getContract();
      const tx = await contract.vote(id);
      setMessage('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      setMessage('Vote cast successfully!');
      setHasVoted(true);
    } catch (err: any) {
      console.error(err);
      setMessage('Vote failed: ' + (err.reason || err.message));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Voter Dashboard</h1>
            <p className="text-gray-500">ID: {voterId}</p>
          </div>
          <div className="flex items-center gap-4">
            <ConnectWallet />
            <button
              onClick={() => {
                localStorage.removeItem('voterId');
                router.push('/voter/login');
              }}
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

        {hasVoted && (
          <div className="p-4 bg-green-100 text-green-800 rounded text-center font-bold">
            You have already voted in this election.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{candidate.name}</h3>
                  <p className="text-gray-500">{candidate.party}</p>
                </div>
                <div className="text-2xl">{candidate.symbol}</div>
              </div>
              
              <button
                onClick={() => handleVote(candidate.id)}
                disabled={hasVoted}
                className={`w-full py-2 rounded font-semibold ${
                  hasVoted
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
