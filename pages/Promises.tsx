
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const Promises: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const promises = [
    { 
      text: "I promise to stay real.", 
      detail: "In a world where everyone wears masks, I promise to always be the person you first met. Honesty is what keeps our 'cloudy' bond grounded.",
      color: "hover:shadow-blue-100", 
      delay: "0s" 
    },
    { 
      text: "I promise to respect your space.", 
      detail: "Your peace is priority. I understand that sometimes the best way to be there for you is to give you the room to breathe and find yourself.",
      color: "hover:shadow-pink-100", 
      delay: "100ms" 
    },
    { 
      text: "I promise to support you quietly.", 
      detail: "I don't need to shout my support from the rooftops. I'll be the steady force in the background, making sure you never have to walk alone.",
      color: "hover:shadow-purple-100", 
      delay: "200ms" 
    },
    { 
      text: "I promise to celebrate your wins.", 
      detail: "Every tiny victory of yours is a festival for me. I'll always be your biggest cheerleader, even for the wins you think are too small to mention.",
      color: "hover:shadow-green-100", 
      delay: "300ms" 
    },
    { 
      text: "I promise to always listen.", 
      detail: "Listening isn't just hearing words; it's understanding the silence between them. I promise to hear your heart even when you can't find the words.",
      color: "hover:shadow-yellow-100", 
      delay: "400ms" 
    },
    { 
      text: "I promise to keep our secrets.", 
      detail: "Our talks are sacred. Everything you trust me with is locked safely in the clouds, where only we have the key. Your trust is my greatest treasure.",
      color: "hover:shadow-indigo-100", 
      delay: "500ms" 
    },
    { 
      text: "I promise to be your calm.", 
      detail: "When your world gets too loud and the storms feel heavy, I'll be the calm sky you can come back to. I'll help you find your steady ground again.",
      color: "hover:shadow-teal-100", 
      delay: "600ms" 
    },
    { 
      text: "I promise to keep learning you.", 
      detail: "People change, and that's beautiful. I promise to keep discovering new things about you every day, and falling for this friendship all over again.",
      color: "hover:shadow-orange-100", 
      delay: "700ms" 
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={sectionRef}
      className={`max-w-5xl mx-auto px-6 py-10 md:py-16 text-center transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="mb-12">
        <div className="inline-block p-2 bg-pink-50 rounded-full mb-4">
          <Heart className="text-pink-400 fill-pink-400 w-5 h-5" />
        </div>
        <h2 className="text-4xl md:text-6xl font-romantic mb-4 text-gray-800 tracking-tight">Vows for the Sky, Megh ☁️</h2>
        <p className="text-gray-400 mb-2 font-light text-xs md:text-sm tracking-[0.3em] uppercase">Deepening our roots, one word at a time.</p>
        <p className="text-gray-300 text-[10px] italic">Tap any card to see the 'why' behind the promise</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
        {promises.map((promise, idx) => (
          <div 
            key={idx} 
            style={{ transitionDelay: isVisible ? promise.delay : '0ms' }}
            className={`transition-all duration-700 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <PromiseCard promise={promise} />
          </div>
        ))}
      </div>
      
      <div className="mt-20 opacity-30">
        <Sparkles size={16} className="mx-auto text-pink-200" />
      </div>
    </div>
  );
};

const PromiseCard: React.FC<{ promise: { text: string; detail: string; color: string } }> = ({ promise }) => {
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setActive(!active);
    
    if (!active) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 15,
        spread: 40,
        origin: { x, y },
        colors: ['#FFC0CB', '#FFD700', '#B0E0E6'],
        scalar: 0.6,
        shapes: ['circle'],
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative p-6 md:p-10 rounded-[2.5rem] bg-white/40 border border-white/80 backdrop-blur transition-all duration-500 cursor-pointer shadow-sm active:scale-[0.97] overflow-hidden
        ${active ? `ring-2 ring-pink-100 scale-[1.02] shadow-xl bg-white/90 ${promise.color}` : 'hover:bg-white/70 hover:scale-[1.01]'}
      `}
    >
      {/* Decorative gradient background for active state */}
      <div className={`absolute inset-0 bg-gradient-to-br from-pink-50/20 to-transparent transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`} />

      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-2xl transition-all duration-500 ${active ? 'bg-pink-500 text-white rotate-12' : 'bg-gray-50 text-gray-300'}`}>
              {active ? (
                <CheckCircle2 size={18} className="animate-in zoom-in duration-300" />
              ) : (
                <Sparkles size={18} className="group-hover:text-pink-200 transition-colors" />
              )}
            </div>
            <span className={`text-base md:text-xl font-bold tracking-tight text-left transition-colors duration-300 ${active ? 'text-gray-900' : 'text-gray-600'}`}>
              {promise.text}
            </span>
          </div>
          <ChevronDown className={`text-gray-300 w-4 h-4 transition-transform duration-500 ${active ? 'rotate-180 text-pink-400' : 'opacity-0 group-hover:opacity-100'}`} />
        </div>
        
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${active ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 border-t border-pink-50">
            <p className="text-xs md:text-sm text-left text-gray-500 leading-relaxed font-light italic pl-4 border-l-2 border-pink-200">
              {promise.detail}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle indicator for interactivity */}
      {!active && (
        <div className="absolute bottom-4 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[8px] font-bold text-pink-300 uppercase tracking-widest">Reveal Why</span>
        </div>
      )}
    </div>
  );
};

export default Promises;
