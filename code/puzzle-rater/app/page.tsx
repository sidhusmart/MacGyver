'use client';

import { useState, useEffect } from 'react';
import ProblemCard from '../components/ProblemCard';
import { Problem } from '../lib/types';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/problems');
        const data = await response.json();
        
        if (data.problems && data.problems.length > 0) {
          setProblems(data.problems);
          const randomIndex = Math.floor(Math.random() * data.problems.length);
          setCurrentProblem(data.problems[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
      setLoading(false);
    };

    fetchProblems();
  }, []);

  const handleResponse = async (isInteresting: boolean) => {
    if (!currentProblem || saving) return;

    setSaving(true);
    try {
      const response = await fetch('/api/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: currentProblem.id,
          isInteresting,
        }),
      });

      if (response.ok) {
        // Get next random problem
        const remainingProblems = problems.filter(p => p.id !== currentProblem.id);
        if (remainingProblems.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingProblems.length);
          setCurrentProblem(remainingProblems[randomIndex]);
          setProblems(remainingProblems);
        } else {
          setCurrentProblem(null);
        }
      }
    } catch (error) {
      console.error('Failed to save response:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading problems...</p>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">No more problems to rate!</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Problem Rater
        </h1>
        <ProblemCard 
          problem={currentProblem} 
          onResponse={handleResponse}
        />
        {saving && (
          <p className="text-center mt-4 text-gray-600">Saving response...</p>
        )}
      </div>
    </main>
  );
}
