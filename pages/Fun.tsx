
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Smile, Heart, Star, Sparkles, Wand2, CloudRain, Coffee, Moon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import MagicPoem from '../components/MagicPoem.tsx';

const Fun: React.FC = () => {
  const [moodMsg, setMoodMsg] = useState<string | null>(null);
  const [loadingMood, setLoadingMood] = useState(false);

  const alchemyOptions = [
    { icon: <Smile className="text-yellow-400" />, label: 'Happy', emoji: '😊' },
    { icon: <CloudRain className="text-blue-400" />, label: 'Melancholy', emoji: '🌧️' },
    { icon: <Coffee className="text-amber-700" />, label: 'Tired', emoji: '☕' },
    { icon: <Moon className="text-indigo-400" />, label: 'Midnight Vibe', emoji: '🌙' },
  ];

  const handleAlchemy = async (mood: string) => {
    setLoadingMood(true);
    setMoodMsg(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am feeling "${mood}". Write a 1-sentence supportive Banglish mood-booster for Megh. Be very specific to the mood. No quotes.`,
      });
      setMoodMsg(response.text || "Everything will be just fine!");
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.8 },
        colors: ['#FFC0CB', '#B0E0E6']
      });
    } catch (e) {
      setMoodMsg("Bondhutto e sob thik kore dey! 🤍");
    } finally {
      setLoadingMood(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
      <div className="mb-10">
        <Sparkles className="w-12 h-12 text-yellow-300 animate-spin-slow mx-auto mb-4" />
        <h2 className="text-4xl md:text-6xl font-romantic text-gray-950">Mood Alchemy</h2>
        <p className="text-gray-400 mt-4 font-light tracking-wide uppercase text-xs">Transform your current cloud into a silver lining.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mb-16">
        {alchemyOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAlchemy(opt.label)}
            disabled={loadingMood}
            className="glass flex flex-col items-center p-8 rounded-[2.5rem] hover:scale-105 transition-all active:scale-95 disabled:opacity-50 group"
          >
            <div className="mb-4 transition-transform group-hover:rotate-12">
              {/* Added React.ReactElement<any> cast to fix the 'size' property type error */}
              {React.cloneElement(opt.icon as React.ReactElement<any>, { size: 32 })}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{opt.label}</span>
          </button>
        ))}
      </div>

      {moodMsg && (
        <div className="mb-20 glass p-10 rounded-[3rem] animate-in bounce-in duration-700 max-w-2xl border-pink-100">
          <p className="text-xl md:text-2xl font-romantic text-gray-800 italic leading-relaxed">
            "{moodMsg}"
          </p>
          <div className="mt-6 flex justify-center gap-2">
             <Heart size={12} className="text-pink-400 fill-pink-400" />
             <Heart size={12} className="text-pink-300 fill-pink-300" />
          </div>
        </div>
      )}

      <MagicPoem />

      <div className="mt-24 p-12 glass rounded-[4rem] w-full max-w-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Star size={80} className="fill-gray-900" />
        </div>
        <div className="mb-8 relative z-10">
          <Wand2 className="w-10 h-10 text-gray-950 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Bond Analyzer</h3>
          <p className="text-gray-400 text-xs italic mt-2">A tiny bit of data, a whole lot of heart.</p>
        </div>

        <button
          onClick={() => {
            confetti({ particleCount: 200, spread: 160 });
            alert("Analysis: Statistically, this friendship is 100% unbreakable. ☁️✨");
          }}
          className="px-10 py-5 bg-gray-950 text-white rounded-full hover:bg-black transition-all hover:translate-y-[-2px] shadow-2xl flex items-center gap-4 mx-auto font-bold uppercase text-[10px] tracking-[0.3em]"
        >
          Run Cloud Diagnostics
        </button>
      </div>
    </div>
  );
};

export default Fun;
