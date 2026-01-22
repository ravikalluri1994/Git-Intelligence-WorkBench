
import React, { useState } from 'react';
import { parseIssueDetails } from './services/geminiService';
import { Modifier, ParseResponse } from './types';
import { CopyButton } from './components/CopyButton';

const SAMPLE_CONTEXT = "RDSTDTL-2744\nType: Defect\nPriority: Medium\nResolution: Unresolved";
const SAMPLE_DETAILS = `RG-Cloud: Once clicked on reset button for voltage -current graph, minutes graph is going blank for some time

Steps to reproduce:
1.Open cloud web app
2.Login and navigate to individual breaker page
3.Go to voltage current graph,click on reset button when minutes tab is selected
4.Observe the graph goes blank without any time frame`;

const App: React.FC = () => {
  const [context, setContext] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParseResponse | null>(null);

  const handleGenerate = async () => {
    if (!context.trim() && !details.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const parsed = await parseIssueDetails(context, details);
      setResult(parsed);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContext('');
    setDetails('');
    setResult(null);
    setError(null);
  };

  const loadSample = () => {
    setContext(SAMPLE_CONTEXT);
    setDetails(SAMPLE_DETAILS);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 font-sans text-slate-900 min-h-screen flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M9 11h6"/><path d="M9 19h6"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Issue Intelligence Workbench</h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Dev Workflow Automation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={loadSample} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">Load Example</button>
          <button onClick={handleClear} className="text-xs font-bold text-slate-400 hover:text-red-500 px-4 py-2 rounded-xl transition-all">Clear All</button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-grow">
        {/* INPUTS SIDEBAR */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">JIRA Ticket Context</label>
              <textarea
                className="w-full p-4 text-xs font-mono border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all h-32 resize-none bg-slate-50/50"
                placeholder="ID, Type, Resolution, etc..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Issue & Technical Details</label>
              <textarea
                className="w-full p-4 text-xs font-mono border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all h-64 resize-none bg-slate-50/50"
                placeholder="Paste bug summary, steps to reproduce, or requirements..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || (!context.trim() && !details.trim())}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                loading || (!context.trim() && !details.trim())
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : "Analyze & Generate"}
            </button>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 text-center animate-pulse">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* OUTPUTS MAIN */}
        <div className="xl:col-span-8">
          <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-8 min-h-full">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <div className="mb-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4"/><path d="m16.2 3.8 2.8 2.8"/><path d="M18 12h4"/><path d="m16.2 20.2 2.8-2.8"/><path d="M12 18v4"/><path d="m4.9 19.1 2.8-2.8"/><path d="M2 12h4"/><path d="m4.9 4.9 2.8 2.8"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Awaiting Intelligence</h2>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Fill the workspace on the left with JIRA data and technical notes to generate your workflow.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-indigo-600 font-black text-sm uppercase tracking-[0.3em]">Processing Metadata</p>
              </div>
            )}

            {result && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Section: Git Metadata */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="p-1.5 bg-indigo-600 rounded-lg text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v7c0 1.1.9 2 2 2h7"/><path d="M18 15V9c0-1.1-.9-2-2-2h-5"/></svg>
                    </span>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Git Standard Workflow</h3>
                    <div className="flex-grow h-px bg-slate-200"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Branch */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group">
                      <div className="flex justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Branch Name</span>
                        <CopyButton text={`${result.type}/${result.jiraId}/${result.kebabDescription}`} />
                      </div>
                      <p className="text-sm font-mono text-slate-800 break-all leading-relaxed">
                        <span className="text-indigo-600">{result.type}</span>/<span className="text-amber-600 font-bold">{result.jiraId}</span>/{result.kebabDescription}
                      </p>
                    </div>

                    {/* Commit */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group">
                      <div className="flex justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Commit Message</span>
                        <CopyButton text={`${result.type}(${result.jiraId}): ${result.shortSummary}`} />
                      </div>
                      <p className="text-sm font-mono text-slate-800 break-all leading-relaxed">
                        <span className="text-indigo-600">{result.type}</span>(<span className="text-amber-600 font-bold">{result.jiraId}</span>): {result.shortSummary}
                      </p>
                    </div>

                    {/* MR Title */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group md:col-span-2">
                      <div className="flex justify-between mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Merge Request Title</span>
                        <CopyButton text={`${result.jiraId}: ${result.properTitle}`} />
                      </div>
                      <p className="text-sm font-mono text-slate-800 break-all leading-relaxed">
                        <span className="text-amber-600 font-bold">{result.jiraId}</span>: {result.properTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section: Technical Analysis */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="p-1.5 bg-emerald-600 rounded-lg text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z"/></svg>
                    </span>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Issue & QA Synthesis</h3>
                    <div className="flex-grow h-px bg-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Summary Card */}
                    <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h.01"/><path d="M12 16h.01"/><path d="M12 12h.01"/><path d="M12 8h.01"/><path d="M12 4h.01"/><path d="M16 20h.01"/><path d="M16 16h.01"/><path d="M16 12h.01"/><path d="M16 8h.01"/><path d="M16 4h.01"/><path d="M8 20h.01"/><path d="M8 16h.01"/><path d="M8 12h.01"/><path d="M8 8h.01"/><path d="M8 4h.01"/></svg>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Brief Summary</h4>
                        <CopyButton text={result.briefSummary} />
                      </div>
                      <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                        {result.briefSummary}
                      </p>
                    </div>

                    {/* How to Test Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">How to Test</h4>
                        <CopyButton text={result.howToTest} />
                      </div>
                      <div className="text-sm text-slate-700 space-y-3 leading-relaxed whitespace-pre-line font-medium italic">
                        {result.howToTest}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 flex flex-wrap gap-2 justify-center opacity-30">
                  {Object.values(Modifier).map(m => (
                    <span key={m} className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-tighter">{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-10 py-6 border-t border-slate-200 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Integrated Intelligence Layer • Version 2.0</p>
      </footer>
    </div>
  );
};

export default App;
