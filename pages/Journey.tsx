
import React, { useState } from 'react';
import { Calendar, Laugh, MessageCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface TimelineEvent {
  title: string;
  icon: React.ReactNode;
  bangla: string;
  english: string;
}

const Journey: React.FC = () => {
  const events: TimelineEvent[] = [
    {
      title: 'Beginning',
      icon: <Calendar className="text-green-500" />,
      bangla: 'শুরুটা বেশ সাধারণ ছিল।',
      english: 'It all started so quietly, yet so meaningful.'
    },
    {
      title: 'Laughs',
      icon: <Laugh className="text-yellow-500" />,
      bangla: 'সেই অদ্ভুত হাসাহাসি গুলো।',
      english: 'Countless jokes and shared smiles.'
    },
    {
      title: 'Late Talks',
      icon: <MessageCircle className="text-blue-500" />,
      bangla: 'রাত জেগে কথা বলা।',
      english: 'Endless conversations under the stars.'
    },
    {
      title: 'Support',
      icon: <ShieldCheck className="text-purple-500" />,
      bangla: 'সব সময় পাশে থাকা।',
      english: 'Quiet support in every storm.'
    },
    {
      title: 'Still Here',
      icon: <Heart className="text-pink-500" />,
      bangla: 'এখনও আমরা আমরাই আছি।',
      english: 'Growing closer with every sunrise.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-romantic text-gray-800">Our Small Journey Together</h2>
        <p className="text-gray-400 mt-2 text-[10px] md:text-sm font-light uppercase tracking-widest">Since June 10, 2024</p>
      </div>
      
      <div className="relative">
        {/* Central Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-100 via-blue-50 to-pink-100 md:-translate-x-1/2 hidden xs:block" />

        <div className="space-y-12 md:space-y-24">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start md:items-center md:justify-center">
              {/* Layout structure */}
              <div className={`flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Card side */}
                <div className="flex-1 w-full pl-12 xs:pl-16 md:pl-0">
                  <div className="perspective-1000 w-full">
                    <FlipCard event={event} />
                  </div>
                </div>

                {/* Center Icon (Floating in the line) */}
                <div className="absolute left-6 md:left-1/2 top-4 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10 hidden xs:block">
                  <div className="p-2 md:p-3 bg-white rounded-full border-2 border-pink-50 shadow-lg text-gray-600 transition-transform hover:scale-110">
                    {React.cloneElement(event.icon as React.ReactElement<any>, { size: 18 })}
                  </div>
                </div>

                {/* Empty side for layout balance on desktop */}
                <div className="flex-1 hidden md:block" />
              </div>
              
              {/* Mobile-only tiny icon */}
              <div className="xs:hidden absolute left-0 top-6 p-1 bg-white rounded-full border border-pink-50 shadow-sm">
                {React.cloneElement(event.icon as React.ReactElement<any>, { size: 14 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FlipCard: React.FC<{ event: TimelineEvent }> = ({ event }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full min-h-[140px] md:min-h-[180px] perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-white/60 flex flex-col items-center justify-center p-6 transition-all hover:bg-white/90">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight text-center">{event.title}</h3>
          <div className="mt-3 flex items-center gap-2 text-pink-400">
            <Sparkles size={12} className="animate-pulse" />
            <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em]">Tap to Read</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-pink-50/95 to-white/95 backdrop-blur-md rounded-[2rem] shadow-inner border border-pink-100 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <p className="text-sm md:text-lg font-bold text-gray-800 mb-2 font-['Hind_Siliguri'] leading-snug">
            {event.bangla}
          </p>
          <div className="w-6 h-0.5 bg-pink-200/50 mb-2 rounded-full" />
          <p className="text-[10px] md:text-xs italic text-gray-500 font-light leading-relaxed px-2">
            {event.english}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Journey;
