
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Loader2, Volume2 } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import confetti from 'canvas-confetti';

// Shared Audio Helper (Raw PCM for TTS)
const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

const HugDay: React.FC = () => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hugNote, setHugNote] = useState<string | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const whisperSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const startHug = async () => {
    if (isCompleted) return;
    setIsPressing(true);
    
    // 1. Immersive Haptic (Double Heartbeat Pulse)
    if ("vibrate" in navigator) {
      heartbeatRef.current = window.setInterval(() => {
        navigator.vibrate([40, 100, 40, 500]);
      }, 800);
    }

    // 2. Soft Whisper Audio (Puck Voice)
    triggerWhisper();

    // 3. Progress Fill
    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          completeHug();
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);
  };

  const triggerWhisper = async () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: "Softly say: I'm here for you, Megh. Feel the warmth." }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioCtxRef.current) {
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const audioBuffer = await decodeAudioData(bytes, audioCtxRef.current, 24000, 1);
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = audioBuffer;
        
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtxRef.current.currentTime + 0.5);
        
        source.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);
        source.start();
        whisperSourceRef.current = source;
      }
    } catch (e) {
      console.error("Whisper failed:", e);
    }
  };

  const stopHug = () => {
    setIsPressing(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (whisperSourceRef.current) {
      try { whisperSourceRef.current.stop(); } catch(e) {}
    }
    if (!isCompleted) setProgress(0);
  };

  const completeHug = () => {
    setIsCompleted(true);
    setIsPressing(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#FFB6C1', '#F08080', '#FED7AA']
    });

    fetchHugNote();
  };

  const fetchHugNote = async () => {
    setLoadingNote(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Today is Hug Day. Write a tiny, super-warm Banglish note for Megh (Mim) to accompany a virtual hug. 12 words max. Use 'Cloudy' style.",
      });
      setHugNote(response.text || "Eita ekta boro jadur jhappi tor jonno! ❤️");
    } catch (e) {
      setHugNote("Asol jhappi ta thaklo, Megh! 🤗");
    } finally {
      setLoadingNote(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[85vh] px-6 text-center py-12 relative transition-all duration-700 ${isPressing ? 'scale-[0.98]' : 'scale-100'}`}>
      {/* Warmth Radiance Overlay */}
      <div className={`fixed inset-0 transition-opacity duration-1000 pointer-events-none z-[-1] ${isPressing ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: 'radial-gradient(circle at center, #fff7ed 0%, transparent 70%)' }} />
      
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="glass inline-block px-6 py-2 rounded-full mb-4 ring-1 ring-pink-100">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-pink-400">February 12 • Hug Day</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-romantic text-gray-900 mb-4 tracking-tight">The Warmest Embrace</h2>
        <p className="text-gray-400 text-sm md:text-xl font-light italic max-w-md mx-auto leading-relaxed">
          {isCompleted 
            ? "Hug Delivered. Warmth received? 🫂" 
            : "Sometimes words can't squeeze tight enough. Hold the heart and don't let go."}
        </p>
      </div>

      <div className="relative mb-16 select-none group">
        {/* Progress Halo */}
        <div className={`absolute inset-[-20px] rounded-full blur-[40px] transition-all duration-700 ${isPressing ? 'bg-orange-200/40 opacity-100 scale-110' : 'opacity-0 scale-90'}`} />
        
        <svg className="w-64 h-64 md:w-80 md:h-80 transform -rotate-90 relative z-10">
          <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#f3f4f6" strokeWidth="2" />
          <circle
            cx="50%" cy="50%" r="48%"
            fill="none"
            stroke={isCompleted ? "#f472b6" : "#fb923c"}
            strokeWidth="4"
            strokeDasharray="100%"
            strokeDashoffset={`${100 - progress}%`}
            className="transition-all duration-100 ease-linear"
            strokeLinecap="round"
          />
        </svg>

        {/* The Heart Core */}
        <div 
          onMouseDown={startHug}
          onMouseUp={stopHug}
          onMouseLeave={stopHug}
          onTouchStart={startHug}
          onTouchEnd={stopHug}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-60 md:h-60 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer shadow-2xl z-20
            ${isPressing ? 'scale-[1.1] bg-white ring-8 ring-orange-50' : 'scale-100 bg-white hover:shadow-pink-100'}
            ${isCompleted ? 'bg-pink-50 ring-0' : ''}
          `}
        >
          <div className={`transition-all duration-500 ${isPressing ? 'animate-pulse' : ''}`}>
             <Heart 
               size={isPressing ? 80 : 64} 
               className={`transition-all duration-500 ${isCompleted || isPressing ? 'text-pink-500 fill-pink-500' : 'text-pink-100'}`} 
             />
          </div>
          <div className="mt-4 flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {isCompleted ? 'Held Tight' : isPressing ? 'Squeezing...' : 'Long Press'}
            </span>
            {isPressing && <Volume2 size={12} className="text-orange-400 animate-bounce" />}
          </div>
        </div>

        {isPressing && Array.from({ length: 6 }).map((_, i) => (
            <div 
                key={i} 
                className="absolute text-pink-300 opacity-50 animate-ping pointer-events-none"
                style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animationDuration: `${1 + Math.random() * 2}s`
                }}
            >
              <Heart size={16} fill="currentColor" />
            </div>
        ))}
      </div>

      {isCompleted && (
        <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {loadingNote ? (
                <div className="flex items-center gap-4 text-gray-300 text-xs justify-center py-8">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="tracking-[0.3em] uppercase font-bold">Summoning a hug note...</span>
                </div>
            ) : hugNote && (
                <div className="glass p-10 rounded-[3.5rem] relative overflow-hidden group shadow-2xl ring-1 ring-pink-50">
                    <div className="absolute -top-4 -right-4 p-8 opacity-5">
                        <Sparkles size={60} className="text-pink-500" />
                    </div>
                    <p className="text-xl md:text-3xl font-romantic text-gray-800 leading-relaxed italic">
                        "{hugNote}"
                    </p>
                    <div className="mt-8 flex justify-center items-center gap-3">
                        <div className="w-10 h-px bg-pink-100"></div>
                        <Heart size={14} className="text-pink-200 fill-pink-200" />
                        <div className="w-10 h-px bg-pink-100"></div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default HugDay;
