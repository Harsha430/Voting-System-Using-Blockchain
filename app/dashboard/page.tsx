'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: number;
  name: string;
  party: string;
}

export default function VoterDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [user, setUser] = useState<any>(null);
  const [electionOpen, setElectionOpen] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.uniqueID) {
      router.push('/login');
      return;
    }
    setUser(userData);

    fetchCandidates();
    fetchElectionStatus();
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

  const handleVote = async (candidateId: number) => {
    if (!user) return;

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterId: user.id,
          uniqueID: user.uniqueID,
          candidateId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Vote cast successfully! Block hash: ' + data.block.hash);
        const updatedUser = { ...user, hasVoted: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Failed to cast vote');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Voter Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-70">ID: {user?.uniqueID}</span>
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
                {candidate.party}
              </p>
              <button
                onClick={() => handleVote(candidate.id)}
                disabled={user?.hasVoted || !electionOpen}
                className={`w-full py-2 rounded font-semibold ${
                  user?.hasVoted
                    ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                    : !electionOpen
                    ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {user?.hasVoted ? 'Voted' : 'Vote'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
