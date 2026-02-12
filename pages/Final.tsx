
import React, { useEffect, useRef } from 'react';
import { Heart, Cloud, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Final: React.FC = () => {
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          triggerCelebration();
        }
      },
      { threshold: 0.6 }
    );

    const element = document.getElementById('final-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const triggerCelebration = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div id="final-section" className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="relative mb-12">
        <Cloud className="w-24 h-24 md:w-32 md:h-32 text-blue-100 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Heart className="text-pink-400 w-10 h-10 md:w-12 md:h-12 fill-pink-400 animate-bounce" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 text-yellow-300 w-6 h-6 animate-spin-slow" />
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h2 className="text-3xl md:text-5xl font-romantic text-gray-800 max-w-2xl leading-tight">
          However many years pass, <br />
          10 June will always mean something special.
        </h2>

        <div className="w-16 h-1 bg-pink-100 mx-auto rounded-full" />

        <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-xl mx-auto italic">
          "Bondhutto thakbe, thakte hobe... <br />
          like the sky, constant and calm."
        </p>

        <div className="pt-8">
          <p className="text-xs text-gray-400 tracking-[0.4em] uppercase font-bold mb-4">
            Happy Promise Day, Megh ☁️
          </p>
          <div className="flex justify-center gap-4 text-pink-200">
             <Heart size={14} fill="currentColor" />
             <Heart size={14} fill="currentColor" className="scale-125" />
             <Heart size={14} fill="currentColor" />
          </div>
        </div>
      </div>
      
      <div className="mt-20 opacity-10 hover:opacity-50 transition-opacity">
        <p className="text-[10px] uppercase tracking-widest font-bold">Built with magic for Mim</p>
      </div>
    </div>
  );
};

export default Final;
