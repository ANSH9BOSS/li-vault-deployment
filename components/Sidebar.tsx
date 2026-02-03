
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Plus, ChevronDown, Trash2, GitBranch, Settings, Layout, Sparkles, FolderPlus, BarChart3, Puzzle, CheckSquare, Bookmark, Terminal, HardDrive, Cpu, Search, Network, Box, Zap, Globe, Share2, Image as ImageIcon, FileText } from 'lucide-react';
import { FileNode, SidebarView, TodoItem, Snippet, Extension } from '../types';

interface SidebarProps {
  files: FileNode[];
  activeFileId: string | null;
  activeView: SidebarView;
  onViewChange: (v: SidebarView) => void;
  onSelectFile: (id: string) => void;
  onCreateFile: (name: string, language: string) => void;
  onDeleteFile: (id: string) => void;
  onShowTemplates: () => void;
  currentBranch: string;
  onSync: () => void;
  isSyncing: boolean;
  todos: TodoItem[];
  snippets: Snippet[];
  onAddSnippet: (s: Snippet) => void;
  extensions?: Extension[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  files, activeFileId, activeView, onViewChange, 
  onSelectFile, onCreateFile, onDeleteFile, onShowTemplates, currentBranch,
  todos, snippets
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const [localExtensions, setLocalExtensions] = useState<Extension[]>([
    { id: 'ext-1', name: 'Neural Linter', description: 'AI-powered syntax verification', enabled: true, icon: 'Zap' },
    { id: 'ext-2', name: 'Quantum Debug', description: 'WASM-based step debugger', enabled: false, icon: 'Cpu' },
    { id: 'ext-3', name: 'Git Graph Pro', description: 'Visual commit relationships', enabled: true, icon: 'GitBranch' },
  ]);

  const langStats = useMemo(() => {
    const stats: Record<string, number> = {};
    files.forEach(f => {
      stats[f.language] = (stats[f.language] || 0) + 1;
    });
    return Object.entries(stats).sort((a,b) => b[1] - a[1]);
  }, [files]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const ext = newName.split('.').pop() || '';
    const langMap: any = { py: 'python', js: 'javascript', ts: 'typescript', css: 'css', html: 'html', md: 'markdown', java: 'java', rust: 'rust', yml: 'yaml', yaml: 'yaml', json: 'json' };
    onCreateFile(newName, langMap[ext] || 'plaintext');
    setNewName(''); setShowCreate(false);
  };

  return (
    <div className="flex h-full border-r border-white/5 bg-[#020408] relative z-20">
      <div className="w-[68px] flex flex-col items-center py-6 gap-6 border-r border-white/5 bg-black/40">
        <ActivityIcon icon={<Layout size={20}/>} active={activeView === 'explorer'} onClick={() => onViewChange('explorer')} />
        <ActivityIcon icon={<Search size={20}/>} active={activeView === 'search'} onClick={() => onViewChange('search')} />
        <ActivityIcon icon={<Share2 size={20}/>} active={activeView === 'graph'} onClick={() => onViewChange('graph')} />
        <ActivityIcon icon={<ImageIcon size={20}/>} active={activeView === 'assets'} onClick={() => onViewChange('assets')} />
        <ActivityIcon icon={<Puzzle size={20}/>} active={activeView === 'extensions'} onClick={() => onViewChange('extensions')} />
        <ActivityIcon icon={<CheckSquare size={20}/>} active={activeView === 'todos'} onClick={() => onViewChange('todos')} />
        <ActivityIcon icon={<Bookmark size={20}/>} active={activeView === 'snippets'} onClick={() => onViewChange('snippets')} />
        <ActivityIcon icon={<BarChart3 size={20}/>} active={activeView === 'stats'} onClick={() => onViewChange('stats')} />
        <div className="mt-auto"><ActivityIcon icon={<Settings size={20}/>} /></div>
      </div>

      <aside className="w-72 flex flex-col bg-black/50 backdrop-blur-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'explorer' && (
            <motion.div key="explorer" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1 flex flex-col">
              <div className="px-6 py-6 flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Explorer</h2>
                <div className="flex gap-1">
                  <SidebarAction icon={<FolderPlus size={14} />} onClick={onShowTemplates} />
                  <SidebarAction icon={<Plus size={14} />} onClick={() => setShowCreate(!showCreate)} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-4 custom-scrollbar">
                {showCreate && (
                  <form onSubmit={handleCreate} className="mb-4">
                    <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="module.java" className="w-full bg-slate-900 border border-indigo-500/30 text-[11px] text-white rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 shadow-xl shadow-indigo-500/10" />
                  </form>
                )}
                <div className="flex items-center gap-2 px-2 text-slate-600 mb-2">
                    <ChevronDown size={12} />
                    <Box size={12} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">LI_WORKSPACE_V5</span>
                </div>
                <div className="space-y-0.5">
                  {files.map(file => (
                    <div key={file.id} className="group flex items-center gap-1">
                      <button onClick={() => onSelectFile(file.id)} className={`flex-1 flex items-center gap-3 px-4 py-2 text-[12px] rounded-xl transition-all relative ${activeFileId === file.id ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5'}`}>
                        <FileCode size={16} className={activeFileId === file.id ? 'text-white' : 'text-slate-600'} />
                        <span className="truncate">{file.name}</span>
                      </button>
                      <button onClick={() => onDeleteFile(file.id)} className="p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'assets' && (
             <motion.div key="assets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex-1 flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Asset Vault</h3>
                <div className="grid grid-cols-2 gap-3">
                   {['logo.png', 'hero_bg.svg', 'icon.ico', 'blob.json'].map(asset => (
                      <div key={asset} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 group transition-all cursor-pointer">
                         <div className="w-full aspect-square bg-slate-900 rounded-lg mb-3 flex items-center justify-center text-slate-700 group-hover:text-indigo-500 transition-colors">
                            <ImageIcon size={24} />
                         </div>
                         <span className="text-[9px] font-black uppercase text-slate-400 block truncate">{asset}</span>
                      </div>
                   ))}
                </div>
             </motion.div>
          )}

          {activeView === 'search' && (
             <motion.div key="search-side" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex-1 flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Context Search</h3>
                <div className="space-y-6">
                   <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input placeholder="Symbol name..." className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 pl-9 text-[11px] text-white focus:outline-none" />
                   </div>
                   <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Recent Findings</span>
                      {files.slice(0, 3).map(f => (
                         <div key={f.id} className="p-3 bg-white/5 rounded-xl text-[10px] text-slate-400 font-bold hover:text-white transition-colors cursor-pointer flex items-center gap-2">
                            <FileText size={12} className="text-indigo-500" /> {f.name}
                         </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          )}

          {activeView === 'graph' && (
            <motion.div key="graph" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex-1 flex flex-col">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Dependency Graph</h3>
               <div className="flex-1 relative flex items-center justify-center">
                  <div className="space-y-6 w-full">
                    {files.map((f, i) => (
                      <div key={f.id} className="flex flex-col items-center">
                         <div className={`px-4 py-2 rounded-xl border text-[10px] font-bold ${activeFileId === f.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                           {f.name}
                         </div>
                         {i < files.length - 1 && <div className="w-px h-6 bg-white/10" />}
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeView === 'stats' && (
             <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Project Engine Stats</h3>
                <div className="grid grid-cols-1 gap-4">
                   <StatCard icon={<Cpu size={14}/>} label="V-NPU LOAD" value="1.4%" color="text-indigo-400" />
                   <StatCard icon={<Network size={14}/>} label="GATEWAY" value="12ms" color="text-emerald-400" />
                   <div className="space-y-4 pt-4 border-t border-white/5">
                      <h4 className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Composition</h4>
                      {langStats.map(([lang, count]) => (
                        <div key={lang} className="flex flex-col gap-1">
                           <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-slate-400">{lang}</span>
                              <span className="text-white">{Math.round((count / files.length) * 100)}%</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(count / files.length) * 100}%` }} className="h-full bg-indigo-500" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          )}

          {activeView === 'extensions' && (
            <motion.div key="extensions" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 flex-1 flex flex-col overflow-hidden">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Neural Store</h3>
               <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                  {localExtensions.map(ext => (
                    <div key={ext.id} className={`p-4 rounded-2xl border transition-all ${ext.enabled ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-white/5 border-white/5 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${ext.enabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                               {ext.icon === 'Zap' && <Zap size={12}/>}
                               {ext.icon === 'Cpu' && <Cpu size={12}/>}
                               {ext.icon === 'GitBranch' && <GitBranch size={12}/>}
                            </div>
                            <span className="text-xs font-black text-white">{ext.name}</span>
                         </div>
                         <button 
                           onClick={() => setLocalExtensions(p => p.map(e => e.id === ext.id ? {...e, enabled: !e.enabled} : e))}
                           className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${ext.enabled ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}
                         >
                            {ext.enabled ? 'Active' : 'Enable'}
                         </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{ext.description}</p>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="p-5 bg-white/5 border border-white/5 rounded-3xl transition-all hover:border-white/10 group">
     <div className={`flex items-center gap-2 mb-2 ${color} opacity-70 group-hover:opacity-100`}>{icon} <span className="text-[9px] font-black uppercase tracking-widest">{label}</span></div>
     <div className="text-2xl font-black text-white">{value}</div>
  </div>
);

const ActivityIcon = ({ icon, active, onClick }: any) => (
  <button onClick={onClick} className={`p-3 rounded-2xl transition-all relative group ${active ? 'text-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-600/5' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}>
    {icon}
    {active && <motion.div layoutId="active_bar" className="absolute -left-12 top-2 bottom-2 w-1.5 bg-indigo-500 rounded-full" />}
  </button>
);

const SidebarAction = ({ icon, onClick }: any) => (
  <button onClick={onClick} className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">{icon}</button>
);

export default Sidebar;
