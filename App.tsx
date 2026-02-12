
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Heart, Cloud, Volume2, VolumeX, ChevronRight, ChevronLeft, Sparkles, Wand2 } from 'lucide-react';
import Hero from './pages/Hero.tsx';
import Journey from './pages/Journey.tsx';
import Promises from './pages/Promises.tsx';
import Letters from './pages/Letters.tsx';
import HugDay from './pages/HugDay.tsx';
import Fun from './pages/Fun.tsx';
import Gallery from './pages/Gallery.tsx';
import Final from './pages/Final.tsx';
import AIChat from './components/AIChat.tsx';
import AdminPanel from './components/AdminPanel.tsx';

const FloatingBackground: React.FC<{ superMode: boolean }> = ({ superMode }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const count = isMobile ? (superMode ? 15 : 6) : (superMode ? 30 : 12);
  const emojis = useMemo(() => superMode ? ['💖', '✨', '🌈', '🦋', '🌸'] : ['☁️', '🤍', '✨'], [superMode]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`absolute text-2xl transition-all duration-1000 ease-in-out ${superMode ? 'opacity-40 scale-125' : 'opacity-20'}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${superMode ? 2 + Math.random() * 2 : 5 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {emojis[i % emojis.length]}
        </div>
      ))}
      {superMode && Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`heart-${i}`}
          className="absolute text-pink-400 opacity-30 animate-heart-rain"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${10 + Math.random() * 20}px`
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [superMode, setSuperMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const sections = [
    { id: 'home', component: <Hero /> },
    { id: 'journey', component: <Journey /> },
    { id: 'hug', component: <HugDay /> },
    { id: 'promises', component: <Promises /> },
    { id: 'letters', component: <Letters /> },
    { id: 'fun', component: <Fun /> },
    { id: 'gallery', component: <Gallery /> },
    { id: 'final', component: <Final /> }
  ];

  // Synthesized ambient sound logic
  useEffect(() => {
    if (!isMuted) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 10);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      
      oscillatorRef.current = osc;
      gainRef.current = gain;
    } else {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          oscillatorRef.current?.stop();
        }, 600);
      }
    }
    return () => {
      oscillatorRef.current?.stop();
    };
  }, [isMuted]);

  const changePage = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= sections.length || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIdx(newIdx);
      setIsTransitioning(false);
    }, 500);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // Explicitly resume on interaction to ensure sound works
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  return (
    <div className={`page-deck transition-all duration-1000 ${superMode ? 'bg-[#fff5f8]' : 'bg-[#fdfcfb]'} text-gray-900`}>
      <FloatingBackground superMode={superMode} />

      {/* Top Track */}
      <div className="fixed top-0 left-0 w-full h-1 z-[80] flex gap-1 px-6 pt-6">
        {sections.map((_, i) => (
          <div 
            key={i} 
            onClick={() => changePage(i)}
            className="flex-1 h-full cursor-pointer relative group"
          >
            <div className={`h-full rounded-full transition-all duration-700 ${i <= activeIdx ? (superMode ? 'bg-pink-400' : 'bg-pink-300') : 'bg-gray-100/30'} shadow-sm`} />
          </div>
        ))}
      </div>

      {/* Top Left Controls Cluster */}
      <div className="fixed top-8 left-8 z-[90] flex items-center gap-3">
        {/* Secret Admin Trigger */}
        <div 
          onClick={() => setShowAdmin(true)}
          className="cursor-pointer opacity-20 hover:opacity-100 transition-all active:scale-90"
        >
          <Cloud className={`w-8 h-8 ${superMode ? 'text-pink-400' : 'text-blue-100'}`} />
        </div>

        {/* Sound Toggle (Shifted to Top Left) */}
        <button
          onClick={handleMuteToggle}
          className="glass p-2.5 rounded-full text-gray-400 hover:text-pink-500 transition-all active:scale-75 shadow-sm"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Main Story Content Area */}
      <div className={`page-content custom-scrollbar transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 animate-cloud-slide'}`}>
        <div className="w-full max-w-7xl mx-auto px-4">
          {sections[activeIdx].component}
        </div>
      </div>

      {/* Floating Navigation */}
      <div className="fixed bottom-10 left-0 w-full z-[90] flex items-center justify-between px-8 pointer-events-none">
        <button
          onClick={() => changePage(activeIdx - 1)}
          disabled={activeIdx === 0 || isTransitioning}
          className={`glass p-4 rounded-full text-gray-400 hover:text-pink-500 transition-all active:scale-75 pointer-events-auto disabled:opacity-0 ${activeIdx === 0 ? 'invisible' : 'visible'}`}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-col items-center">
            <div className="glass px-4 py-1.5 rounded-full mb-4 pointer-events-auto">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">Section {activeIdx + 1}</span>
            </div>
            {activeIdx < sections.length - 1 && (
                <button
                    onClick={() => changePage(activeIdx + 1)}
                    className="p-3 bg-gray-900 text-white rounded-full shadow-2xl hover:scale-105 hover:bg-black active:scale-90 transition-all pointer-events-auto flex items-center gap-2 pr-5 group"
                >
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Continue</span>
                </button>
            )}
        </div>

        <div className="w-[48px]" />
      </div>

      <AIChat />

      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          superMode={superMode} 
          setSuperMode={setSuperMode} 
        />
      )}
    </div>
  );
};

export default App;
