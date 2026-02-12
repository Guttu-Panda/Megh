
import React, { useState } from 'react';
import { Settings, Shield, Zap, RefreshCw, X, HeartCrack, BarChart2, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AdminPanelProps {
  onClose: () => void;
  superMode: boolean;
  setSuperMode: (val: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, superMode, setSuperMode }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState('');

  const checkAuth = () => {
    if (password === 'megh2024') {
      setIsAuthorized(true);
    } else {
      alert('Tui admin na! Palah eikhan theke! 😂');
    }
  };

  const analyzeBond = async () => {
    // Check if API key selection is needed for Gemini 3 Pro model as per guidelines
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        // Assuming success after triggering selection as per race condition guidelines
      }
    }

    setAnalyzing(true);
    setInsight('');
    try {
      // Re-initialize GoogleGenAI to ensure latest API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Analyze the concept of a long-term friendship starting from June 10. Write a 2-sentence 'Deep Insight' about why this bond (Megh & friend) is statistically and emotionally unique. Use poetic Banglish.",
      });
      setInsight(response.text || "Bondhutto mane holo ekta bhalo lagar jayga...");
    } catch (err: any) {
      // Reset key selection if the request fails due to invalid/not found entity
      if (err?.message?.includes("Requested entity was not found.")) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
          await (window as any).aistudio.openSelectKey();
        }
      }
      setInsight("Cloud analysis failed. The bond is too complex for AI!");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-500">
        <div className="bg-gray-950 p-7 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/10 rounded-xl">
              <Shield className="text-yellow-400" size={20} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Admin Console</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {!isAuthorized ? (
          <div className="p-10 space-y-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2 font-medium">Restricted Access</p>
              <h3 className="text-2xl font-bold text-gray-800">Passcode Required</h3>
            </div>
            <input 
              type="password"
              placeholder="Developer Key..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white transition-all outline-none"
            />
            <button 
              onClick={checkAuth}
              className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Verify Identity
            </button>
          </div>
        ) : (
          <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${superMode ? 'bg-pink-100' : 'bg-gray-200'}`}>
                  <Zap className={superMode ? "text-pink-500 fill-pink-500" : "text-gray-400"} size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Super Mode</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Enhanced VFX</p>
                </div>
              </div>
              <button 
                onClick={() => setSuperMode(!superMode)}
                className={`w-12 h-6 rounded-full transition-all relative ${superMode ? 'bg-pink-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${superMode ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 rounded-xl">
                    <BarChart2 className="text-blue-600" size={20} />
                   </div>
                   <p className="font-bold text-gray-800 text-sm">AI Insights</p>
                </div>
                {analyzing ? <Loader2 className="animate-spin text-blue-400" size={18} /> : (
                  <button onClick={analyzeBond} className="text-blue-600 hover:bg-blue-100 p-1 rounded-md transition-colors">
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>
              
              {insight && (
                <div className="p-4 bg-white/60 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{insight}"</p>
                </div>
              )}
              {/* Added mandatory billing link for Gemini 3 Pro features */}
              <p className="text-[9px] text-gray-400 mt-2 px-1 italic">
                Note: Features using Gemini 3 Pro require a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">paid project API key</a>.
              </p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-3 p-5 bg-gray-50 text-gray-600 font-bold rounded-[2rem] hover:bg-gray-100 transition-all text-sm"
            >
              <RefreshCw size={18} /> Hard Refresh App
            </button>

            <button 
              onClick={() => {
                setSuperMode(true);
                alert("Chaos Mode Initialized! ✨🌈🦋");
              }}
              className="w-full flex items-center justify-center gap-3 p-5 bg-pink-50 text-pink-600 font-bold rounded-[2rem] hover:bg-pink-100 transition-all text-sm"
            >
              <Sparkles size={18} /> Enable Chaos
            </button>

            <button 
              disabled
              className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-300 font-bold rounded-[2rem] opacity-50 cursor-not-allowed text-sm"
            >
              <HeartCrack size={18} /> Purge Memories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
