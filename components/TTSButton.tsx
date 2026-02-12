
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Volume2, Loader2, Music, Square } from 'lucide-react';

// Global context to prevent multiple instance issues
let globalAudioCtx: AudioContext | null = null;

const TTSButton: React.FC<{ text: string }> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Stop audio on unmount or text change
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch(e) {}
      }
    };
  }, [text]);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

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

  const playSpeech = async () => {
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      if (!globalAudioCtx) {
        globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      if (globalAudioCtx.state === 'suspended') {
        await globalAudioCtx.resume();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        // Model used for TTS as per coding guidelines
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this softly and warmly as a best friend: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              // 'Puck' provides a friendly, warm male voice
              prebuiltVoiceConfig: { voiceName: 'Puck' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && globalAudioCtx) {
        const audioBuffer = await decodeAudioData(decode(base64Audio), globalAudioCtx, 24000, 1);
        const source = globalAudioCtx.createBufferSource();
        source.buffer = audioBuffer;
        
        const gainNode = globalAudioCtx.createGain();
        gainNode.gain.setValueAtTime(0, globalAudioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, globalAudioCtx.currentTime + 0.1);
        
        source.connect(gainNode);
        gainNode.connect(globalAudioCtx.destination);
        
        source.onended = () => {
          setIsPlaying(false);
          sourceRef.current = null;
        };
        
        sourceRef.current = source;
        setIsLoading(false);
        setIsPlaying(true);
        source.start();
      } else {
        setIsLoading(false);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio error:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  return (
    <button 
      onClick={playSpeech}
      disabled={isLoading}
      className={`p-3.5 px-5 rounded-[1.5rem] transition-all shadow-sm flex items-center gap-3 active:scale-95 ${
        isPlaying 
          ? 'bg-pink-600 text-white shadow-pink-200 shadow-xl' 
          : 'bg-white text-gray-500 hover:text-pink-500 hover:shadow-md'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isPlaying ? "Stop Voice" : "Listen to Note"}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : isPlaying ? (
        <Square size={18} className="fill-current" />
      ) : (
        <Volume2 size={18} />
      )}
      <span className="text-[11px] font-extrabold uppercase tracking-widest">
        {isLoading ? 'Summoning...' : isPlaying ? 'Stop' : 'Hear Note'}
      </span>
      {isPlaying && (
        <div className="flex gap-0.5 items-end h-3">
          <div className="w-1 bg-white/40 animate-pulse h-full"></div>
          <div className="w-1 bg-white/40 animate-pulse [animation-delay:0.2s] h-[70%]"></div>
          <div className="w-1 bg-white/40 animate-pulse [animation-delay:0.4s] h-[85%]"></div>
        </div>
      )}
    </button>
  );
};

export default TTSButton;
