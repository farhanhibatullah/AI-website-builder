
import React, { useState, useEffect } from 'react';
import { WebsiteBlueprint, WebsitePage } from '../types';
import { Layout, Palette, Send, ChevronLeft, RefreshCw, Eye, Code, ExternalLink } from 'lucide-react';
import { generatePageCode } from '../geminiService';
import PreviewFrame from './PreviewFrame';
import DeployModal from './DeployModal';

interface Props {
  blueprint: WebsiteBlueprint;
  setBlueprint: React.Dispatch<React.SetStateAction<WebsiteBlueprint | null>>;
  onDeploy: () => void;
}

const Editor: React.FC<Props> = ({ blueprint, setBlueprint, onDeploy }) => {
  const [currentPageSlug, setCurrentPageSlug] = useState(blueprint.pages[0].slug);
  const [activeTab, setActiveTab] = useState<'pages' | 'styles'>('pages');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const currentPage = blueprint.pages.find(p => p.slug === currentPageSlug) || blueprint.pages[0];

  const handlePageChange = async (slug: string) => {
    setCurrentPageSlug(slug);
    const page = blueprint.pages.find(p => p.slug === slug);
    if (page && !page.code) {
      setIsRegenerating(true);
      try {
        const code = await generatePageCode(blueprint, slug);
        setBlueprint(prev => {
          if (!prev) return null;
          return {
            ...prev,
            pages: prev.pages.map(p => p.slug === slug ? { ...p, code } : p)
          };
        });
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const regenerateCurrentPage = async () => {
    setIsRegenerating(true);
    try {
      const code = await generatePageCode(blueprint, currentPageSlug);
      setBlueprint(prev => {
        if (!prev) return null;
        return {
          ...prev,
          pages: prev.pages.map(p => p.slug === currentPageSlug ? { ...p, code } : p)
        };
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <Layout size={20} /> InstaSite Editor
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-sm font-medium text-slate-500">
            Previewing: <span className="text-slate-900">{currentPage.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={regenerateCurrentPage}
            disabled={isRegenerating}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={18} className={isRegenerating ? 'animate-spin' : ''} />
            <span className="text-sm font-medium hidden sm:inline">Regenerate Page</span>
          </button>
          <button 
            onClick={() => setIsDeployModalOpen(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-sm"
          >
            Deploy Site <Send size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('pages')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'pages' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
              <Layout size={18} /> Pages
            </button>
            <button 
              onClick={() => setActiveTab('styles')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'styles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
            >
              <Palette size={18} /> Styles
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {activeTab === 'pages' ? (
              <div className="space-y-2">
                {blueprint.pages.map(page => (
                  <button
                    key={page.slug}
                    onClick={() => handlePageChange(page.slug)}
                    className={`w-full text-left p-4 rounded-xl transition group ${
                      currentPageSlug === page.slug 
                        ? 'bg-indigo-50 border-indigo-200 border text-indigo-700' 
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      {page.title}
                      {!page.code && <div className="w-2 h-2 rounded-full bg-amber-400" title="Needs Generation" />}
                    </div>
                    <div className="text-xs opacity-60 mt-1">/{page.slug}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Color Palette</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <div className="h-10 rounded-lg" style={{ backgroundColor: blueprint.global_style.primary_color }} />
                      <div className="text-[10px] text-center font-mono">{blueprint.global_style.primary_color}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-10 rounded-lg" style={{ backgroundColor: blueprint.global_style.secondary_color }} />
                      <div className="text-[10px] text-center font-mono">{blueprint.global_style.secondary_color}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-10 rounded-lg" style={{ backgroundColor: blueprint.global_style.accent_color }} />
                      <div className="text-[10px] text-center font-mono">{blueprint.global_style.accent_color}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Typography</label>
                  <div className="p-3 bg-slate-50 rounded-lg font-medium text-slate-700 border border-slate-200">
                    {blueprint.global_style.font_family}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Brand Tone</label>
                  <div className="p-3 bg-slate-50 rounded-lg font-medium text-slate-700 border border-slate-200 capitalize">
                    {blueprint.global_style.tone}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 bg-slate-100 p-8 flex flex-col relative overflow-hidden">
          {isRegenerating && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                <LoaderIcon />
                <div className="text-lg font-bold text-slate-900">Rebuilding Page...</div>
              </div>
            </div>
          )}

          <div className="flex-1 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 flex items-center gap-2 min-w-[300px] justify-center">
                https://your-amazing-site.insta-site.ai/{currentPageSlug}
              </div>
              <div className="w-16" />
            </div>
            <div className="flex-1 relative">
              {currentPage.code ? (
                <PreviewFrame code={currentPage.code} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                   <Code size={48} className="opacity-20" />
                   <p className="font-medium">Page code not generated yet.</p>
                   <button 
                     onClick={regenerateCurrentPage}
                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                   >
                     Generate Now
                   </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isDeployModalOpen && <DeployModal onClose={() => setIsDeployModalOpen(false)} />}
    </div>
  );
};

const LoaderIcon = () => (
  <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
);

export default Editor;
