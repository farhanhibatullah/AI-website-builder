
import React from 'react';
import { Rocket, Monitor, Zap, CheckCircle } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="bg-white">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Zap className="fill-indigo-600" /> InstaSite AI
        </div>
        <button 
          onClick={onStart}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
        >
          Get Started
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          AI-Powered Website Generation
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl">
          From Idea to Live Website <br/> <span className="text-indigo-600">in Minutes</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-10 max-w-2xl">
          Stop struggling with complex builders. Describe your business, and our AI builds a high-converting, multi-page website tailored just for you.
        </p>

        <div className="flex gap-4 mb-20">
          <button 
            onClick={onStart}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-xl"
          >
            Create Your Website <Rocket size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            { icon: <Monitor className="text-indigo-600" />, title: "Full Multi-Page Structure", desc: "Not just landing pages. We build interconnected pages for features, pricing, and more." },
            { icon: <Zap className="text-amber-500" />, title: "Instant Generation", desc: "Powered by Gemini 3, get your site structure and code in under 60 seconds." },
            { icon: <CheckCircle className="text-emerald-500" />, title: "One-Click Deploy", desc: "Satisfied with the result? Go live instantly with our optimized deployment engine." },
          ].map((item, i) => (
            <div key={i} className="p-8 border border-slate-100 rounded-3xl bg-slate-50/50 text-left">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
