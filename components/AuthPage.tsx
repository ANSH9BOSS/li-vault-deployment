import React, { useState, useEffect } from 'react';
import { Github, Cpu, Sparkles, Zap, Shield, Globe, Terminal, Loader2, ChevronRight, Binary, Database, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [bootPhase, setBootPhase] = useState<'idle' | 'kernel' | 'neural' | 'ready'>('idle');
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const runBootSequence = (user: User) => {
    setBootPhase('kernel');
    const logs = [
      "CORE: Initializing quantum handshake...",
      "HW: Detecting Neural NPU v4.5...",
      "FS: Mounting persistent encrypted volumes...",
      "NET: Establishing secure tunnel to GitHub Nexus...",
      "SYSTEM: All cores active. Workspace ready."
    ];
    
    logs.forEach((log, i) => {
      setTimeout(() => {
        setBootLogs(prev => [...prev, log]);
        if (i === 2) setBootPhase('neural');
        if (i === logs.length - 1) {
          setTimeout(() => onLogin(user), 800);
        }
      }, i * 400);
    });
  };

  const simulateLogin = (provider: 'google' | 'github') => {
    runBootSequence({
      name: provider === 'google' ? 'Nexus Engineer' : 'Root User',
      email: `${provider}@neural.hub`,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${provider === 'google' ? 'blue' : 'purple'}`,
      provider,
      accessToken: provider === 'github' ? githubToken : 'neural_id_v4'
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-black">
      <AnimatePresence mode="wait">
        {bootPhase !== 'idle' ? (
          <motion.div 
            key="booting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#020408] flex flex-col items-center justify-center p-8 font-mono overflow-hidden"
          >
            {/* Cinematic Background Elements */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[800px] h-[800px] border border-indigo-500/10 rounded-full opacity-20 pointer-events-none"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-[600px] h-[600px] border border-white/5 rounded-full opacity-10 pointer-events-none"
            />

            <div className="w-full max-w-lg relative z-10">
              <div className="flex items-center gap-6 mb-16">
                <div className="relative">
                   <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/50">
                      <Binary className="text-white" size={32} />
                   </div>
                   <div className="absolute -inset-2 bg-indigo-600/20 blur-xl animate-pulse rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter">LI_HUB_BOOT_SEQUENCE</h2>
                  <div className="flex items-center gap-2">
                     <div className="h-1 w-24 bg-indigo-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2.5 }}
                          className="h-full bg-indigo-400"
                        />
                     </div>
                     <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Phase: {bootPhase}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner">
                {bootLogs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -15 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={i} 
                    className="text-[11px] flex gap-4 items-center group"
                  >
                    <span className="text-indigo-500 font-black opacity-30 select-none">0{i+1}</span>
                    <span className={`tracking-tight ${i === bootLogs.length - 1 ? "text-indigo-400 font-bold" : "text-slate-400"}`}>
                      {log}
                    </span>
                    {i === bootLogs.length - 1 && <div className="w-1.5 h-3 bg-indigo-400 animate-pulse" />}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row relative z-10">
            {/* Visuals Sidebar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:flex flex-col justify-center p-24 w-[55%] relative overflow-hidden"
            >
              <div className="space-y-12 relative z-10">
                <motion.div 
                   initial={{ y: -20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="flex items-center gap-6"
                >
                  <div className="w-16 h-16 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-indigo-600/40">
                    <Cpu className="text-white" size={32} />
                  </div>
                  <h1 className="text-5xl font-black tracking-tighter text-white">LI'S HUB</h1>
                </motion.div>

                <div className="space-y-6">
                  <h2 className="text-[110px] font-black leading-[0.8] text-white tracking-tighter">
                    Build <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-indigo-400 to-white italic">Beyond.</span>
                  </h2>
                  <p className="text-slate-400 text-2xl max-w-md font-medium leading-relaxed">
                    The ultra-engine for architects of the new web. 100% Native. 100% Local.
                  </p>
                </div>

                <div className="flex gap-8 pt-10">
                  {/* Fixed typo: changed lowercase binary to Binary */}
                  <FeatureStat icon={<Binary className="text-indigo-400" size={16}/>} label="ALL LANGUAGES" value="Integrated" />
                  <div className="w-px h-10 bg-white/10" />
                  <FeatureStat icon={<Network className="text-emerald-400" size={16}/>} label="REAL GITHUB" value="Real-time" />
                </div>
              </div>

              {/* 4D Background Animation Elements */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"
              />
              <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full" />
            </motion.div>

            {/* Auth Panel */}
            <div className="flex-1 flex items-center justify-center p-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass p-10 rounded-[40px] shadow-2xl relative"
              >
                <div className="mb-10">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-3 block">Identity Node</span>
                  <h3 className="text-4xl font-black text-white mb-2">Initialize</h3>
                  <p className="text-slate-500 text-sm font-medium">Select your synchronization protocol</p>
                </div>

                <div className="space-y-4">
                  <AuthButton 
                    onClick={() => simulateLogin('google')} 
                    icon={<Globe size={18}/>} 
                    label="Cloud Identity Nexus" 
                    sub="Google Protocol"
                  />

                  <div className="relative py-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <span className="relative px-6 bg-[#020408] text-[9px] font-black tracking-[0.5em] text-slate-700 uppercase">Secure Bridge</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {!showTokenInput ? (
                      <motion.button 
                        key="git"
                        onClick={() => setShowTokenInput(true)}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-50 text-white font-black rounded-[24px] shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-4 group"
                      >
                        <Github size={24} />
                        REAL GITHUB SYNC
                      </motion.button>
                    ) : (
                      <motion.div key="input" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                        <div className="relative">
                           <input 
                              type="password" 
                              placeholder="Personal Access Token" 
                              value={githubToken} 
                              onChange={(e) => setGithubToken(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-2xl p-5 text-indigo-400 font-mono text-xs focus:outline-none focus:border-indigo-500 transition-all"
                           />
                        </div>
                        <button 
                          onClick={() => simulateLogin('github')}
                          className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all"
                        >
                          ACTIVATE TOKEN <ChevronRight size={18}/>
                        </button>
                        <button onClick={() => setShowTokenInput(false)} className="w-full text-slate-600 text-[10px] font-black uppercase tracking-widest pt-2 hover:text-slate-400 transition-colors">Abort Session</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeatureStat = ({ icon, label, value }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-white/40">
       {icon}
       <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

const AuthButton = ({ onClick, icon, label, sub }: any) => (
  <button 
    onClick={onClick}
    className="w-full p-6 bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 rounded-[28px] flex items-center gap-6 transition-all group text-left"
  >
    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
       {icon}
    </div>
    <div className="flex flex-col">
       <span className="text-white font-black text-sm uppercase tracking-wide">{label}</span>
       <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{sub}</span>
    </div>
  </button>
);

export default AuthPage;