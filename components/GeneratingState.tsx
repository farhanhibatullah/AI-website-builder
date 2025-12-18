
import React from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  step: number;
}

const GeneratingState: React.FC<Props> = ({ step }) => {
  const steps = [
    "Analyzing your requirements...",
    "Building your Website Blueprint...",
    "Generating multi-page architecture...",
    "Writing custom React & Tailwind code...",
    "Polishing layout and styles..."
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-12 relative">
          <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-xl">{Math.min(100, step * 20)}%</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">Crafting Your Masterpiece</h2>
        <p className="text-slate-500 mb-10">Our AI is orchestrating your entire website. This usually takes less than a minute.</p>

        <div className="space-y-4 text-left border border-slate-100 p-6 rounded-2xl bg-slate-50">
          {steps.map((text, i) => {
            const isDone = step > i;
            const isCurrent = step === i;
            return (
              <div key={i} className={`flex items-center gap-3 transition-opacity ${!isDone && !isCurrent ? 'opacity-40' : 'opacity-100'}`}>
                {isDone ? (
                  <CheckCircle2 className="text-emerald-500" size={20} />
                ) : isCurrent ? (
                  <Loader2 className="text-indigo-600 animate-spin" size={20} />
                ) : (
                  <Circle className="text-slate-300" size={20} />
                )}
                <span className={`text-sm font-medium ${isCurrent ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}>{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GeneratingState;
