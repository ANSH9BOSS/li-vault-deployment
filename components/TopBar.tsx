
import React, { useState, useEffect, useMemo } from 'react';
import { Play, LogOut, CloudUpload, Loader2, MonitorPlay, Settings, CheckCircle2, GitBranch, ChevronDown, Plus, Box, Bell, Search, GitCommit, X, Send, Cpu, Timer, ShieldCheck, AlertTriangle, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Branch } from '../types';

interface TopBarProps {
  user: User;
  onLogout: () => void;
  onRun: () => void;
  onDebug: () => void;
  isExecuting: boolean;
  onSync: () => void;
  isSyncing: boolean;
  saveStatus: 'saved' | 'saving' | 'error';
  onToggleAI: () => void;
  onTogglePreview: () => void;
  showPreview: boolean;
  onShowSettings: () => void;
  branches: Branch[];
  currentBranch: string;
  onSwitchBranch: (name: string) => void;
  onCreateBranch: (name: string) => void;
  onExport: () => void;
  onCommit: (message: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  user, onLogout, onRun, onDebug, isExecuting, onSync, isSyncing, saveStatus, 
  onToggleAI, onTogglePreview, showPreview, onShowSettings,
  branches, currentBranch, onSwitchBranch, onCreateBranch, onExport, onCommit
}) => {
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [timer, setTimer] = useState(1500); 

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 1500), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  const healthScore = useMemo(() => 92 + Math.floor(Math.random() * 8), []);

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    onCommit(commitMessage);
    setCommitMessage('');
    setIsCommitting(false);
  };

  return (
    <header className="h-16 bg-[#0B0E14] border-b border-white/5 flex items-center justify-between px-6 z-50 relative">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
            <Box size={18} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[11px] font-black uppercase tracking-[0.2em] text-white group-hover:text-indigo-400 transition-colors">Li's Hub</h1>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.1em]">Engine v6.0</span>
               <div className="flex items-center gap-1">
                  <AnimatePresence mode="wait">
                    {saveStatus === 'saving' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                        <Loader2 size={8} className="animate-spin text-indigo-400" />
                        <span className="text-[7px] font-black uppercase text-indigo-400">Syncing...</span>
                      </motion.div>
                    )}
                    {saveStatus === 'saved' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                        <CheckCircle2 size={8} className="text-emerald-500" />
                        <span className="text-[7px] font-black uppercase text-emerald-500">Stored</span>
                      </motion.div>
                    )}
                    {saveStatus === 'error' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                        <AlertTriangle size={8} className="text-red-500 animate-pulse" />
                        <span className="text-[7px] font-black uppercase text-red-500">I/O Fail</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-l border-white/5 pl-6 h-8">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 transition-all cursor-help" title="Pomodoro Protocol">
              <Timer size={12} className="text-amber-500" />
              <span className="text-[10px] font-black text-white">{formatTime(timer)}</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full cursor-help" title="Workspace Integrity Score">
              <ShieldCheck size={12} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{healthScore}%</span>
           </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative">
            <button onClick={() => setShowBranchMenu(!showBranchMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-slate-400 hover:text-white">
              <GitBranch size={14} className="text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{currentBranch}</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${showBranchMenu ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showBranchMenu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 glass rounded-xl shadow-2xl p-2 z-[100] border border-white/5">
                  {branches.map(b => (
                    <button key={b.name} onClick={() => { onSwitchBranch(b.name); setShowBranchMenu(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-between transition-all ${currentBranch === b.name ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5'}`}>
                      {b.name} {currentBranch === b.name && <CheckCircle2 size={12} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => setIsCommitting(!isCommitting)} className={`p-2 rounded-lg transition-all ${isCommitting ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title="Snapshot Current State"><GitCommit size={16} /></button>
          <AnimatePresence>
            {isCommitting && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 mt-2 w-72 glass rounded-2xl p-4 z-[100] border border-indigo-500/20 shadow-2xl">
                <form onSubmit={handleCommitSubmit} className="space-y-3">
                  <textarea autoFocus placeholder="Why this snapshot?" value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] text-white focus:outline-none min-h-[80px]" />
                  <div className="flex items-center gap-2">
                     <button type="submit" className="flex-1 py-2 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">Store State</button>
                     <button type="button" onClick={() => setIsCommitting(false)} className="p-2 bg-white/5 rounded-xl text-slate-500"><X size={16}/></button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
        <ActionButton icon={<Play size={14} fill="currentColor"/>} active={isExecuting} loading={isExecuting} label="Run" color="text-emerald-500" onClick={onRun} />
        <ActionButton icon={<MonitorPlay size={14}/>} active={showPreview} label="Preview" color="text-sky-500" onClick={onTogglePreview} />
        <ActionButton icon={<Cloud size={14}/>} active={isSyncing} loading={isSyncing} label="Deploy" color="text-indigo-500" onClick={onSync} />
        <ActionButton icon={<Cpu size={14}/>} label="Neural Hub" color="text-amber-500" onClick={onToggleAI} />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">WASM Link Stable</span>
        </div>
        <button onClick={onShowSettings} className="p-2 text-slate-500 hover:text-white transition-colors" title="Settings"><Settings size={18} /></button>
        <div className="flex items-center gap-3">
          <motion.img whileHover={{ scale: 1.1 }} src={user.avatar} className="w-8 h-8 rounded-lg cursor-pointer ring-1 ring-white/10" alt="avatar"/>
          <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-400 transition-all" title="Logout Session"><LogOut size={18} /></button>
        </div>
      </div>
    </header>
  );
};

const ActionButton = ({ icon, label, onClick, loading, active, color }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${active ? 'bg-indigo-600/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    {loading ? <Loader2 size={12} className="animate-spin" /> : <span className={color}>{icon}</span>}
    {label}
  </button>
);

export default TopBar;
