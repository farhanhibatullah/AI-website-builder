
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ExternalLink, Copy, Check, Loader2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DeployModal: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState<'IDLE' | 'DEPLOYING' | 'SUCCESS'>('IDLE');
  const [copied, setCopied] = useState(false);

  const startDeploy = () => {
    setStep('DEPLOYING');
    setTimeout(() => {
      setStep('SUCCESS');
    }, 4500);
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://swift-site-3921.insta-site.ai");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {step === 'IDLE' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ExternalLink size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Go Live?</h2>
              <p className="text-slate-500 mb-8">Deploy your website to our global edge network in seconds. Your unique subdomain is already prepared.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-left">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Target Subdomain</div>
                <div className="text-slate-900 font-mono text-sm">swift-site-3921.insta-site.ai</div>
              </div>

              <button 
                onClick={startDeploy}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
              >
                Deploy Now
              </button>
            </div>
          )}

          {step === 'DEPLOYING' && (
            <div className="text-center py-8">
              <div className="mb-8">
                <Loader2 size={48} className="text-indigo-600 animate-spin mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Deploying...</h2>
              <p className="text-slate-500">Connecting to Vercel, building static assets, and assigning SSL certificates.</p>
              
              <div className="mt-8 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 animate-[progress_4s_ease-in-out_forwards]" style={{ width: '0%' }} />
              </div>
              <style>{`
                @keyframes progress {
                  0% { width: 0%; }
                  50% { width: 70%; }
                  100% { width: 100%; }
                }
              `}</style>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Successfully Deployed!</h2>
              <p className="text-slate-500 mb-8">Your website is now live and accessible to the world.</p>
              
              <div className="flex flex-col gap-3">
                <a 
                  href="#" 
                  target="_blank"
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
                >
                  Visit Your Website <ExternalLink size={20} />
                </a>
                <button 
                  onClick={copyLink}
                  className="w-full bg-slate-100 text-slate-700 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition"
                >
                  {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} />}
                  {copied ? 'Link Copied!' : 'Copy Website URL'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
