
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Search, AlertCircle, Trash2, FileText, Repeat, History, Info, Activity, ShieldCheck, Clock, Network as NetIcon, Globe, ArrowDownUp } from 'lucide-react';
import { TerminalLine, BottomTab, SearchResult, CommitSnapshot } from '../types';
import Terminal from './Terminal';

interface NetworkRequest {
  id: string;
  method: string;
  url: string;
  status: number;
  size: string;
  timestamp: number;
}

interface BottomPanelProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  terminalLines: TerminalLine[];
  onClearTerminal: () => void;
  onDebug: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  replaceQuery: string;
  onReplaceChange: (q: string) => void;
  searchResults: SearchResult[];
  onSelectResult: (id: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  onTerminalCommand?: (cmd: string) => void;
  snapshots?: CommitSnapshot[];
}

const BottomPanel: React.FC<BottomPanelProps> = ({ 
  activeTab, onTabChange, terminalLines, onClearTerminal, onDebug,
  searchQuery, onSearchChange, replaceQuery, onReplaceChange, searchResults, onSelectResult, searchInputRef,
  onTerminalCommand, snapshots = []
}) => {
  const [loadData, setLoadData] = useState<number[]>(Array(40).fill(0));
  const [heapData, setHeapData] = useState<number[]>(Array(40).fill(0));
  const [networkLogs, setNetworkLogs] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadData(p => [...p.slice(1), Math.random() * 40 + 10]);
      setHeapData(p => [...p.slice(1), Math.random() * 60 + 20]);
    }, 1000);

    const handleNetwork = (e: any) => {
       setNetworkLogs(prev => [{ ...e.detail, id: Math.random().toString(), timestamp: Date.now() }, ...prev].slice(0, 20));
    };
    window.addEventListener('li-network', handleNetwork);

    return () => {
      clearInterval(interval);
      window.removeEventListener('li-network', handleNetwork);
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#020408]">
      <div className="flex items-center px-4 bg-slate-950 border-b border-white/5 h-10 overflow-x-auto no-scrollbar">
        <TabBtn icon={<TerminalIcon size={12}/>} label="Terminal" active={activeTab === 'terminal'} onClick={() => onTabChange('terminal')} />
        <TabBtn icon={<Search size={12}/>} label="Search" active={activeTab === 'search'} onClick={() => onTabChange('search')} />
        <TabBtn icon={<Activity size={12}/>} label="Performance" active={activeTab === 'performance'} onClick={() => onTabChange('performance')} />
        <TabBtn icon={<NetIcon size={12}/>} label="Network" active={activeTab === 'network'} onClick={() => onTabChange('network')} />
        <TabBtn icon={<Clock size={12}/>} label="Timeline" active={activeTab === 'timeline'} onClick={() => onTabChange('timeline')} />
        <TabBtn icon={<AlertCircle size={12}/>} label="Problems" active={activeTab === 'problems'} onClick={() => onTabChange('problems')} />
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'terminal' && (
            <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
              <Terminal 
                lines={terminalLines} 
                onClear={onClearTerminal} 
                onDebug={onDebug} 
                onCommand={onTerminalCommand}
              />
            </motion.div>
          )}

          {activeTab === 'network' && (
             <motion.div key="network" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto p-4 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="text-[9px] font-black uppercase text-slate-500 border-b border-white/5 tracking-widest">
                         <th className="pb-3 px-2">Method</th>
                         <th className="pb-3 px-2">Module URL</th>
                         <th className="pb-3 px-2">Status</th>
                         <th className="pb-3 px-2">Size</th>
                         <th className="pb-3 px-2 text-right">Latency</th>
                      </tr>
                   </thead>
                   <tbody>
                      {networkLogs.length === 0 ? (
                        <tr><td colSpan={5} className="py-20 text-center text-slate-700 italic text-[11px]">No intercepted traffic.</td></tr>
                      ) : (
                        networkLogs.map(log => (
                           <tr key={log.id} className="text-[11px] font-mono hover:bg-white/5 transition-colors border-b border-white/5 group">
                              <td className="py-2 px-2"><span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[9px] font-bold">{log.method}</span></td>
                              <td className="py-2 px-2 text-slate-300 truncate max-w-md">{log.url}</td>
                              <td className="py-2 px-2"><span className="text-emerald-500 font-bold">{log.status}</span></td>
                              <td className="py-2 px-2 text-slate-500">{log.size}</td>
                              <td className="py-2 px-2 text-right text-slate-500 group-hover:text-indigo-400 transition-colors">12ms</td>
                           </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div key="performance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-6 flex flex-col bg-[#020408]">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <MetricLabel label="CPU Usage" value={`${Math.round(loadData[39])}%`} color="bg-indigo-500" />
                    <MetricLabel label="JS Heap" value={`${Math.round(heapData[39])}MB`} color="bg-purple-500" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 tracking-tighter">PROTOCOL: NEURAL_WASM_V6</span>
               </div>
               <div className="flex-1 flex items-end gap-1 relative border-l border-b border-white/5">
                  <div className="absolute inset-0 grid grid-cols-1 grid-rows-4 opacity-5 pointer-events-none">
                     <div className="border-t border-white" />
                     <div className="border-t border-white" />
                     <div className="border-t border-white" />
                     <div className="border-t border-white" />
                  </div>
                  {loadData.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-px h-full">
                       <motion.div animate={{ height: `${heapData[i] / 2}%` }} className="w-full bg-purple-500/20 rounded-t-sm" />
                       <motion.div animate={{ height: `${val}%` }} className={`w-full rounded-t-sm transition-colors ${val > 35 ? 'bg-indigo-500' : 'bg-indigo-500/30'}`} />
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
             <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto p-6 bg-[#020408] custom-scrollbar">
                <div className="space-y-6">
                   {snapshots.length === 0 ? (
                      <div className="text-center py-12 text-slate-600 italic text-[11px]">No state snapshots recorded.</div>
                   ) : (
                      snapshots.map(snap => (
                         <div key={snap.id} className="flex gap-4 border-l border-white/10 pl-6 pb-6 relative group">
                            <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40 group-hover:scale-125 transition-transform" />
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">{snap.message}</span>
                                  <span className="text-[9px] font-bold text-slate-600 uppercase">{new Date(snap.timestamp).toLocaleTimeString()}</span>
                               </div>
                               <div className="text-[9px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <ShieldCheck size={10} className="text-indigo-400" /> ID: {snap.id} / BR: {snap.branch}
                               </div>
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col bg-[#020408]">
              <div className="p-4 border-b border-white/5 flex items-center gap-4">
                 <div className="relative flex-1 max-w-md">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input ref={searchInputRef} value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Query global context..." className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none" />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                 {searchResults.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4 opacity-40">
                       <Search size={40} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Global Indexer Ready</span>
                    </div>
                 ) : (
                    searchResults.map((res, i) => (
                      <button key={i} onClick={() => onSelectResult(res.fileId)} className="w-full text-left p-3 border-b border-white/5 hover:bg-white/5 flex items-center gap-4 group transition-all">
                          <FileText size={12} className="text-slate-500 group-hover:text-indigo-400" />
                          <div className="flex-1 truncate text-[11px] text-slate-500 font-mono">
                             <span className="text-indigo-400 font-bold">{res.fileName}</span> : L{res.line} - {res.text}
                          </div>
                      </button>
                    ))
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MetricLabel = ({ label, value, color }: any) => (
  <div className="flex items-center gap-3">
     <div className={`w-2 h-2 rounded-full ${color}`} />
     <div className="flex flex-col">
        <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{label}</span>
        <span className="text-xs font-bold text-white">{value}</span>
     </div>
  </div>
);

const TabBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-[#020408] text-white border-x border-t border-white/5' : 'text-slate-600 hover:text-slate-400'}`}>
    {icon} {label}
  </button>
);

export default BottomPanel;
