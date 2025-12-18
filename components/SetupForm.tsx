
import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (data: any) => void;
}

const SetupForm: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    goal: '',
    type: 'Business',
    audience: '',
    pages: ['home', 'features', 'pricing', 'contact'],
    tone: 'Professional',
    colors: ['#4F46E5', '#0F172A', '#22C55E']
  });

  const handlePageToggle = (page: string) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.includes(page) 
        ? prev.pages.filter(p => p !== page) 
        : [...prev.pages, page]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Tell us about your project</h2>
          <p className="text-indigo-100">The more details you provide, the better the AI can build your vision.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What's the main goal of this website?</label>
            <textarea 
              required
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
              placeholder="e.g. Generate leads for my marketing agency, sell handmade pottery, or showcase my portfolio."
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Website Type</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option>Business</option>
                <option>Portfolio</option>
                <option>E-commerce</option>
                <option>SaaS</option>
                <option>Personal Brand</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Tone</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                value={formData.tone}
                onChange={e => setFormData({...formData, tone: e.target.value})}
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Minimalist</option>
                <option>Bold & Playful</option>
                <option>Elegant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
            <input 
              required
              type="text"
              className="w-full p-3 border border-slate-200 rounded-xl outline-none"
              placeholder="e.g. Tech-savvy millennials, small business owners..."
              value={formData.audience}
              onChange={e => setFormData({...formData, audience: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pages to include</label>
            <div className="flex flex-wrap gap-2">
              {['home', 'features', 'pricing', 'contact', 'about', 'blog', 'faq'].map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageToggle(page)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.pages.includes(page) 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
          >
            Generate My Website <Sparkles size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupForm;
