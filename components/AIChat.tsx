
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, X, Sparkles, Zap, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model' | 'error', text: string }[]>([
    { role: 'model', text: 'Hey Megh! ☁️ Ki khobor? Ajke bol ki bolte chas...' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const triggerPositiveVibe = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.9, x: 0.8 },
      colors: ['#FFC0CB', '#B0E0E6', '#FFD700']
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are Cloudy, Megh's (Mim) best friend's AI assistant. 
          Respond as a warm, funny, and supportive bestie. 
          Use Banglish and lots of cloud/star emojis. 
          Keep it short (max 20 words). 
          If she sounds sad, be extra sweet. 
          If she mentions June 10, say it was a magical day.`,
        },
      });
      
      const text = response.text || "Ki bolbi bol, ami sunchi...";
      
      const positiveKeywords = ['✨', 'happy', 'bhalo', 'smile', 'love', 'valobashi', 'joy', 'magic', 'hug'];
      if (positiveKeywords.some(k => text.toLowerCase().includes(k))) {
        triggerPositiveVibe();
      }

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg = error?.message?.includes('API_KEY') 
        ? "API Key missing! Admin ke bol thik korte. 🛠️" 
        : "Signal weak Megh, abar bol to? ☁️";
      setMessages(prev => [...prev, { role: 'error', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div 
          className="bg-white/95 backdrop-blur-3xl w-[88vw] sm:w-80 h-[500px] rounded-[3rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-6 duration-300"
          role="dialog"
        >
          <div className="bg-gradient-to-r from-pink-100/40 to-blue-50/40 p-5 border-b border-pink-50/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Sparkles size={14} className="text-pink-500 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-gray-800 text-xs tracking-tight">Cloudy AI</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-white/10">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm flex items-center gap-2 ${
                  m.role === 'user' ? 'bg-gray-900 text-white rounded-tr-none' : 
                  m.role === 'error' ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none' :
                  'glass text-gray-800 rounded-tl-none border-gray-100'
                }`}>
                  {m.role === 'error' && <AlertCircle size={14} />}
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass px-5 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2 bg-white/50">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Bol ki bolbi..."
              className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs outline-none focus:ring-2 focus:ring-pink-100 transition-all"
            />
            <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()}
              className="bg-gray-950 text-white p-3.5 rounded-2xl hover:bg-black disabled:opacity-50 transition-all active:scale-90"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gray-950 text-white p-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-90 transition-all flex items-center relative group"
        >
          <Zap size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 bg-pink-400 blur-xl opacity-40 animate-pulse group-hover:opacity-70 transition-opacity"></div>
        </button>
      )}
    </div>
  );
};

export default AIChat;
