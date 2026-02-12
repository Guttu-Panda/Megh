
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PenTool, Loader2, Wand2, Stars } from 'lucide-react';

const MagicPoem: React.FC = () => {
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('Stars');

  const themes = ['Rain', 'Stars', 'Coffee', 'Clouds', 'Memories'];

  const generatePoem = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-flash-lite-latest for ultra-fast "creative" tasks as per guidelines
      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: `Write a short 4-line poetic couplet in Banglish for a friend named Megh about ${theme}. Keep it sweet and cool.`,
      });
      setPoem(response.text || "Megh, tui holi akasher tara, tor bina ami sob e hara...");
    } catch (error) {
      console.error(error);
      setPoem("Failed to summon the Muse. Maybe try again later?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl max-w-lg mx-auto overflow-hidden relative group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl group-hover:bg-pink-300/30 transition-all"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Stars className="text-yellow-500" size={20} />
          <h3 className="text-xl font-bold text-gray-800">Megh's Magic Pen</h3>
          <Stars className="text-yellow-500" size={20} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {themes.map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                theme === t ? 'bg-pink-500 text-white shadow-md' : 'bg-white/50 text-gray-500 hover:bg-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {poem && (
          <div className="mb-8 p-6 bg-pink-50/50 rounded-2xl border border-pink-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-lg text-gray-800 font-romantic leading-relaxed italic">
              {poem}
            </p>
          </div>
        )}

        <button
          onClick={generatePoem}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all transform hover:scale-[1.02] active:scale-98 shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
          )}
          {loading ? 'Consulting the Clouds...' : 'Generate Magic'}
        </button>
      </div>
    </div>
  );
};

export default MagicPoem;
