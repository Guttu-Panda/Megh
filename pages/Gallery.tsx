
import React, { useState } from 'react';
import { Camera, X, Sparkles, Loader2, Heart } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const Gallery: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [postcard, setPostcard] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const images = [
    { url: 'https://picsum.photos/800/1000?random=11', label: 'Cloudy Dreams', date: 'June 2024' },
    { url: 'https://picsum.photos/800/1000?random=12', label: 'Quiet Talk', date: 'Aug 2024' },
    { url: 'https://picsum.photos/800/1000?random=13', label: 'Magic Hour', date: 'Oct 2024' },
    { url: 'https://picsum.photos/800/1000?random=14', label: 'Sparkle Vibe', date: 'Dec 2024' },
    { url: 'https://picsum.photos/800/1000?random=15', label: 'Pure Sky', date: 'Jan 2025' },
    { url: 'https://picsum.photos/800/1000?random=16', label: 'Soft Echo', date: 'Feb 2025' },
  ];

  const generatePostcard = async (url: string) => {
    setAnalyzing(true);
    setPostcard(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentLabel = images.find(img => img.url === url)?.label || "A memory";
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a short 1-sentence poetic Banglish note as if written on the back of a photo postcard titled "${currentLabel}". Must be supportive and soft. No quotes.`,
      });
      setPostcard(response.text || "Eita ekta khub e sundor memory...");
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-20">
        <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <Camera className="text-gray-400" size={32} />
        </div>
        <h2 className="text-4xl md:text-6xl font-romantic text-gray-900 tracking-tight">Postcards of Us</h2>
        <p className="text-gray-400 mt-4 font-light tracking-widest uppercase text-xs">A collection of soft moments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {images.map((img, idx) => (
          <div 
            key={idx}
            onClick={() => {
              setSelectedImg(img.url);
              setPostcard(null);
            }}
            className="group relative bg-white p-4 pb-12 shadow-2xl transition-all hover:scale-[1.05] hover:-rotate-2 cursor-pointer border border-gray-100"
            style={{ transform: `rotate(${idx % 2 === 0 ? '-1.5deg' : '1.5deg'})` }}
          >
            <div className="aspect-[4/5] overflow-hidden bg-gray-50 mb-4">
              <img 
                src={img.url} 
                alt={img.label}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-handwriting text-2xl text-gray-700">{img.label}</span>
              <span className="text-[10px] text-gray-300 uppercase tracking-widest mt-1 font-bold">{img.date}</span>
            </div>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart size={20} className="text-pink-400 fill-pink-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Modern Lightbox / Postcard Back */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 sm:p-12"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-10 right-10 text-gray-400 hover:text-black transition-colors">
            <X size={36} />
          </button>

          <div className="flex flex-col lg:flex-row gap-12 items-center max-w-6xl w-full" onClick={e => e.stopPropagation()}>
            <div className="w-full lg:w-1/2 shadow-2xl rounded-sm border-[12px] border-white overflow-hidden rotate-[-2deg]">
              <img src={selectedImg} className="w-full h-full object-cover" />
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
               <h3 className="font-romantic text-4xl text-gray-900 mb-6">Write a Note...</h3>
               <p className="text-gray-400 text-sm mb-10 leading-relaxed text-center lg:text-left">
                 Every picture tells a story, but AI can help find the hidden words behind the clouds.
               </p>
               
               <button
                  onClick={() => generatePostcard(selectedImg)}
                  disabled={analyzing}
                  className="bg-gray-950 text-white px-10 py-5 rounded-full shadow-xl flex items-center gap-3 font-bold text-xs tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-50"
               >
                  {analyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} className="text-yellow-400" />}
                  {analyzing ? 'FLIPPING POSTCARD...' : 'REVEAL CLOUD NOTE'}
               </button>

               {postcard && (
                 <div className="mt-12 p-8 bg-gray-50 rounded-xl border-l-4 border-pink-400 animate-in slide-in-from-left-4 duration-500 w-full">
                    <p className="font-handwriting text-3xl text-gray-700 leading-snug">
                      "{postcard}"
                    </p>
                    <div className="flex items-center gap-2 mt-6">
                      <div className="w-8 h-px bg-pink-200"></div>
                      <span className="text-[10px] text-pink-300 font-bold uppercase tracking-widest">Cloudy Insight</span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
