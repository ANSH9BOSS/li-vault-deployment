
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileNode, TerminalLine, Theme, Branch, SidebarView, BottomTab, SearchResult, TemplateType, TodoItem, Snippet, CommitSnapshot } from '../types';
import Sidebar from './Sidebar';
import CodeEditor from './CodeEditor';
import BottomPanel from './BottomPanel';
import TopBar from './TopBar';
import AIChat from './AIChat';
import Preview from './Preview';
import TemplateGallery from './TemplateGallery';
import SettingsModal from './SettingsModal';
import StatusBar from './StatusBar';
import CommandPalette from './CommandPalette';
import { runCodeLocally } from '../services/localExecutionService';
import { Maximize2, Minimize2 } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, theme, setTheme }) => {
  const [branches, setBranches] = useState<Branch[]>([{ name: 'main', files: [] }]);
  const [currentBranchName, setCurrentBranchName] = useState('main');
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [openFileIds, setOpenFileIds] = useState<string[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snapshots, setSnapshots] = useState<CommitSnapshot[]>([]);
  
  const [sidebarView, setSidebarView] = useState<SidebarView>('explorer');
  const [bottomTab, setBottomTab] = useState<BottomTab>('terminal');
  const [isExecuting, setIsExecuting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [showAIChat, setShowAIChat] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: 'info', text: 'LI_HUB_OS v5.1.2 [NEURAL_REALTIME_ACTIVE]' },
    { type: 'success', text: 'KERNEL: All sub-systems operational.' },
    { type: 'info', text: 'Type "help" to see available hub commands.' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('hub_workspace_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFiles(parsed.files || []);
        setBranches(parsed.branches || [{ name: 'main', files: [] }]);
        setActiveFileId(parsed.activeId || null);
        setOpenFileIds(parsed.openIds || []);
        setTodos(parsed.todos || []);
        setSnippets(parsed.snippets || []);
        setSnapshots(parsed.snapshots || []);
      } catch (e) {
        handleLoadTemplate('html');
      }
    } else {
      handleLoadTemplate('html');
    }
  }, []);

  useEffect(() => {
    setSaveStatus('saving');
    const data = { files, branches, activeId: activeFileId, openIds: openFileIds, todos, snippets, snapshots };
    localStorage.setItem('hub_workspace_v5', JSON.stringify(data));
    const timer = setTimeout(() => setSaveStatus('saved'), 800);
    return () => clearTimeout(timer);
  }, [files, branches, activeFileId, openFileIds, todos, snippets, snapshots]);

  const activeFile = useMemo(() => files.find(f => f.id === activeFileId) || null, [files, activeFileId]);

  const handleRun = async () => {
    if (!activeFile) {
       setTerminalLines(p => [...p, { type: 'error', text: 'Kernel: No target module selected.' }]);
       return;
    }
    
    setIsExecuting(true);
    setBottomTab('terminal');

    try {
      await runCodeLocally(activeFile.content, activeFile.language, activeFile.name, (line) => {
        setTerminalLines(p => [...p, line]);
      });
    } catch (err: any) {
      setTerminalLines(p => [...p, { type: 'error', text: `RUNTIME_CRITICAL: ${err.message}` }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleTerminalCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setTerminalLines(p => [...p, { type: 'input', text: cmd }]);
    
    // Improved command parser
    if (trimmed === 'clear') {
      setTerminalLines([]);
    } else if (trimmed === 'zen') {
      setIsZenMode(!isZenMode);
      setTerminalLines(p => [...p, { type: 'info', text: `ZEN_MODE: ${!isZenMode ? 'ENABLED' : 'DISABLED'}` }]);
    } else if (trimmed === 'help') {
      setTerminalLines(p => [...p, { type: 'info', text: 'Commands: clear, ls, run, python3 [file], node [file], zen, help, version' }]);
    } else if (trimmed === 'ls') {
      setTerminalLines(p => [...p, { type: 'info', text: files.map(f => f.name).join('  ') }]);
    } else if (trimmed === 'run' || trimmed.startsWith('python') || trimmed.startsWith('node')) {
      handleRun();
    } else if (trimmed === 'version') {
       setTerminalLines(p => [...p, { type: 'success', text: 'Li Hub OS v5.1.2-Stable' }]);
    } else {
       setTerminalLines(p => [...p, { type: 'error', text: `Command not found: ${trimmed}. Type "help" for list.` }]);
    }
  };

  const handleCommit = (message: string) => {
    const snap: CommitSnapshot = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      timestamp: Date.now(),
      branch: currentBranchName
    };
    setSnapshots(p => [snap, ...p]);
    setTerminalLines(p => [...p, { type: 'success', text: `SNAPSHOT: [${snap.id}] stored in timeline.` }]);
  };

  const handleLoadTemplate = (type: TemplateType) => {
    let nf: FileNode[] = [];
    if (type === 'minecraft') {
      nf = [
        { id: 'mc-main', name: 'HubPlugin.java', language: 'java', content: 'package com.li.hub;\n\nimport org.bukkit.plugin.java.JavaPlugin;\n\npublic class HubPlugin extends JavaPlugin {\n    @Override\n    public void onEnable() {\n        getLogger().info("Neural Engine Plugin Enabled!");\n    }\n}', isOpen: true },
        { id: 'mc-yml', name: 'plugin.yml', language: 'yaml', content: 'name: LiHubPlugin\nversion: 1.0.0\nmain: com.li.hub.HubPlugin\napi-version: 1.20', isOpen: true }
      ];
    } else if (type === 'discord') {
      nf = [
        { id: 'dc-bot', name: 'bot.js', language: 'javascript', content: 'console.log("Discord Gateway: Connecting...");\n// Simulation logic for Bot Identity\nconsole.log("Logged in as LiHubBot#1337");\nconsole.log("Status: Listening for Neural Commands");', isOpen: true }
      ];
    } else if (type === 'python') {
      nf = [{ id: 'py-main', name: 'main.py', language: 'python', content: 'import math\n\ndef check_engine():\n    print(f"PI Precision: {math.pi}")\n    print("All Python cores active.")\n\ncheck_engine()', isOpen: true }];
    } else {
      nf = [{ id: 'web-index', name: 'index.html', language: 'html', content: '<!DOCTYPE html>\n<html>\n<body>\n  <h1 style="color: #6366f1;">Workspace Online</h1>\n</body>\n</html>', isOpen: true }];
    }
    setFiles(nf);
    setOpenFileIds(nf.map(f => f.id));
    setActiveFileId(nf[0].id);
    setShowTemplates(false);
    setTerminalLines(p => [...p, { type: 'success', text: `Architecture: ${type.toUpperCase()} Loaded.` }]);
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-[#020408] ${isZenMode ? 'p-0' : ''}`}>
      <AnimatePresence>
        {showPalette && <CommandPalette isOpen={showPalette} onClose={() => setShowPalette(false)} files={files} onSelect={(id) => { setActiveFileId(id); setShowPalette(false); }} />}
        {showTemplates && <TemplateGallery onSelect={handleLoadTemplate} onClose={() => setShowTemplates(false)} />}
        {showSettings && <SettingsModal theme={theme} setTheme={setTheme} onClose={() => setShowSettings(false)} />}
      </AnimatePresence>

      {!isZenMode && (
        <TopBar 
          user={user} onLogout={onLogout} onRun={handleRun} isExecuting={isExecuting}
          onSync={() => {}} isSyncing={false} 
          onToggleAI={() => setShowAIChat(!showAIChat)} onTogglePreview={() => setShowPreview(!showPreview)} 
          onShowSettings={() => setShowSettings(true)}
          branches={branches} currentBranch={currentBranchName} onSwitchBranch={setCurrentBranchName}
          onCommit={handleCommit}
          showPreview={showPreview} onDebug={() => setShowAIChat(true)} saveStatus={saveStatus}
          onCreateBranch={(n) => setBranches(p => [...p, { name: n, files: [] }])} onExport={() => {}}
        />
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {!isZenMode && (
          <Sidebar 
            files={files} activeFileId={activeFileId} activeView={sidebarView} onViewChange={setSidebarView}
            onSelectFile={(id) => { setActiveFileId(id); if (!openFileIds.includes(id)) setOpenFileIds(p => [...p, id]); }}
            onCreateFile={(n, l) => { const nf = { id: Date.now().toString(), name: n, language: l, content: '', isOpen: true }; setFiles(p => [...p, nf]); setActiveFileId(nf.id); setOpenFileIds(p => [...p, nf.id]); }}
            onDeleteFile={(id) => { setFiles(p => p.filter(f => f.id !== id)); setOpenFileIds(p => p.filter(f => f !== id)); if (activeFileId === id) setActiveFileId(null); }}
            onShowTemplates={() => setShowTemplates(true)} currentBranch={currentBranchName} onSync={() => {}} isSyncing={false}
            todos={todos} snippets={snippets} onAddSnippet={(s) => setSnippets(p => [...p, s])}
          />
        )}

        <main className="flex-1 flex flex-col min-w-0 bg-[#020408]/40 backdrop-blur-3xl relative">
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isZenMode && (
              <div className="h-11 bg-black/40 flex items-center border-b border-white/5 overflow-x-auto no-scrollbar px-2">
                {openFileIds.map(fid => {
                  const f = files.find(f => f.id === fid);
                  return f ? (
                    <div 
                      key={fid} onClick={() => setActiveFileId(fid)}
                      className={`group px-5 h-full flex items-center gap-3 text-[11px] font-black cursor-pointer transition-all border-r border-white/5 min-w-[150px] relative uppercase tracking-[0.2em] ${activeFileId === fid ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-500 hover:bg-white/5'}`}
                    >
                      <span className="truncate flex-1">{f.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setOpenFileIds(p => p.filter(id => id !== fid)); }} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">×</button>
                      {activeFileId === fid && <motion.div layoutId="t_under" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-lg shadow-indigo-500/50" />}
                    </div>
                  ) : null;
                })}
              </div>
            )}

            <div className="flex-1 flex overflow-hidden relative">
              <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
                {isZenMode && (
                  <button 
                    onClick={() => setIsZenMode(false)}
                    className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-500 hover:text-white transition-all backdrop-blur-xl border border-white/5"
                  >
                    <Minimize2 size={20} />
                  </button>
                )}
                <div className="flex-1">
                  <CodeEditor file={activeFile} theme={theme} onChange={(c) => setFiles(p => p.map(f => f.id === activeFileId ? { ...f, content: c } : f))} />
                </div>
              </div>
              
              <AnimatePresence>
                {showPreview && !isZenMode && (
                  <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} exit={{ width: 0 }} className="bg-white overflow-hidden flex flex-col border-l border-white/10">
                    <Preview 
                      html={files.find(f => f.language === 'html')?.content || ''} 
                      css={files.find(f => f.language === 'css')?.content || ''} 
                      js={files.find(f => f.language === 'javascript')?.content || ''} 
                      isVisible={showPreview} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isZenMode && (
              <div className="h-64">
                <BottomPanel 
                  activeTab={bottomTab} onTabChange={setBottomTab} terminalLines={terminalLines} onClearTerminal={() => setTerminalLines([])}
                  onDebug={() => setShowAIChat(true)} searchQuery="" onSearchChange={() => {}} replaceQuery="" onReplaceChange={() => {}}
                  searchResults={[]} onSelectResult={(id) => setActiveFileId(id)} searchInputRef={{ current: null } as any}
                  onTerminalCommand={handleTerminalCommand}
                  snapshots={snapshots}
                />
              </div>
            )}
          </div>

          <AnimatePresence>
            {showAIChat && !isZenMode && (
              <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} className="w-[420px] h-full border-l border-white/5 shadow-2xl z-30 bg-black/80 backdrop-blur-2xl">
                <AIChat activeFile={activeFile} onInsertCode={(code) => setFiles(p => p.map(f => f.id === activeFileId ? { ...f, content: f.content + '\n' + code } : f))} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      {!isZenMode && <StatusBar branch={currentBranchName} file={activeFile} theme={theme} />}
    </div>
  );
};

export default Dashboard;
