"use client";

import { useState, useEffect } from 'react';
import { getContract } from '@/lib/blockchain';
import ConnectWallet from '@/components/ConnectWallet';

interface Candidate {
  id: number;
  name: string;
  party: string;
  symbol: string;
  voteCount: number;
}

export default function ResultsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const contract = await getContract();
      
      // Check status
      const status = await contract.votingActive();
      setIsActive(status);

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
          voteCount: Number(c.votes)
        });
      }
      
      // Sort by votes
      loadedCandidates.sort((a, b) => b.voteCount - a.voteCount);
      
      setCandidates(loadedCandidates);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Results...</div>;

  const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);
  const winner = candidates.length > 0 ? candidates[0] : null;

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isActive ? "Election in Progress" : "Election Results"}
          </h1>
          <ConnectWallet />
        </div>

        {!isActive && (
          <>
            {/* Case 1: No votes cast */}
            {totalVotes === 0 && (
              <div className="p-8 bg-gray-200 dark:bg-zinc-800 border-2 border-gray-400 rounded-xl text-center shadow-lg">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Election Ended</h2>
                <div className="text-xl text-gray-600 dark:text-gray-400 my-4">
                  No votes were cast. No winner elected.
                </div>
              </div>
            )}

            {/* Case 2: Draw */}
            {totalVotes > 0 && candidates.filter(c => c.voteCount === candidates[0].voteCount).length > 1 && (
              <div className="p-8 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400 rounded-xl text-center shadow-lg">
                <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-2">🤝 It's a Draw! 🤝</h2>
                <div className="text-lg text-orange-700 dark:text-orange-300 my-4">
                  The following candidates are tied with {candidates[0].voteCount} votes each:
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {candidates.filter(c => c.voteCount === candidates[0].voteCount).map(c => (
                    <div key={c.id} className="bg-white dark:bg-zinc-800 px-4 py-2 rounded shadow font-bold">
                      {c.name} ({c.party})
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case 3: Single Winner */}
            {totalVotes > 0 && candidates.filter(c => c.voteCount === candidates[0].voteCount).length === 1 && (
              <div className="p-8 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 rounded-xl text-center shadow-lg transform scale-105 transition-transform">
                <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">🎉 Winner Declared! 🎉</h2>
                <div className="text-4xl font-extrabold text-yellow-900 dark:text-yellow-100 my-4">
                  {candidates[0].name}
                </div>
                <div className="text-xl text-yellow-700 dark:text-yellow-300">
                  {candidates[0].party} ({candidates[0].symbol})
                </div>
                <div className="mt-4 font-mono text-lg">
                  Won with {candidates[0].voteCount} votes
                </div>
              </div>
            )}
          </>
        )}

        {isActive && (
          <div className="p-4 bg-blue-100 text-blue-800 rounded-lg text-center animate-pulse">
            Voting is currently active. Results update in real-time.
          </div>
        )}

        <div className="grid gap-6">
          {candidates.map((c, i) => {
            const percentage = totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;
            const isWinner = !isActive && totalVotes > 0 && c.voteCount === candidates[0].voteCount;
            
            return (
              <div key={c.id} className={`p-6 bg-white dark:bg-zinc-800 rounded-lg shadow ${isWinner ? 'border-2 border-yellow-400' : ''}`}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className={`text-2xl font-bold mr-2 ${isWinner ? 'text-yellow-600' : ''}`}>#{i + 1}</span>
                    <span className="text-xl font-semibold">{c.name}</span>
                    <span className="text-gray-500 ml-2">({c.party})</span>
                    {isWinner && <span className="ml-2 text-yellow-600">👑</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{c.voteCount}</div>
                    <div className="text-sm text-gray-500">votes</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-zinc-700 overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${isWinner ? 'bg-yellow-500' : 'bg-blue-600'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
        
        {candidates.length === 0 && (
          <div className="text-center text-gray-500">No active candidates.</div>
        )}
      </div>
    </div>
  );
}
