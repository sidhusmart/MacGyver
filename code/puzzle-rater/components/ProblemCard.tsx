import { ProblemCardProps } from '../lib/types';

export default function ProblemCard({ problem, onResponse }: ProblemCardProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Problem #{problem.id}</h2>
      <div className="min-h-[200px] p-4 bg-gray-50 rounded-md mb-6">
        <p className="text-gray-700 whitespace-pre-wrap">{problem.problem}</p>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onResponse(true)}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Interesting
        </button>
        <button
          onClick={() => onResponse(false)}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Not Interesting
        </button>
      </div>
    </div>
  );
}
