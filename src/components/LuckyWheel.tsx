import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface LuckyWheelProps {
  participants: string[];
  onResult: (winner: string) => void;
  isDrawing: boolean;
  setIsDrawing: (val: boolean) => void;
}

const COLORS = [
  '#1A2233', '#242E42', '#1A2233', '#242E42', '#1A2233', 
  '#242E42', '#1A2233', '#242E42', '#1A2233', '#242E42'
];

export const LuckyWheel: React.FC<LuckyWheelProps> = ({ 
  participants, 
  onResult, 
  isDrawing, 
  setIsDrawing 
}) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = async () => {
    if (participants.length < 2 || isDrawing) return;

    setIsDrawing(true);
    
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const segmentAngle = 360 / participants.length;
    
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const targetRotation = rotation + (extraSpins * 360) + (360 - (winnerIndex * segmentAngle + segmentAngle / 2));
    
    setRotation(targetRotation);

    await controls.start({
      rotate: targetRotation,
      transition: { 
        duration: 5, 
        ease: [0.15, 0, 0.15, 1]
      }
    });

    setIsDrawing(false);
    onResult(participants[winnerIndex]);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FFFFFF']
    });
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
        <p className="text-muted-foreground">請先新增參加者</p>
      </div>
    );
  }

  const segmentAngle = 360 / participants.length;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="relative w-72 h-72 md:w-[480px] md:h-[480px]">
        {/* Pointer */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-10 h-12">
          <div 
            className="w-full h-full bg-primary shadow-[0_0_20px_rgba(255,215,0,0.5)]" 
            style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} 
          />
        </div>

        {/* Wheel container */}
        <motion.div
          animate={controls}
          className="w-full h-full rounded-full border-[12px] border-[#1A2233] shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_20px_rgba(255,215,0,0.3)] overflow-hidden relative"
          style={{ rotate: rotation }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background pattern */}
            <circle cx="50" cy="50" r="50" fill="#1A2233" />
            
            {participants.map((name, i) => {
              const startAngle = i * segmentAngle;
              const endAngle = (i + 1) * segmentAngle;
              
              const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
              
              const largeArcFlag = segmentAngle > 180 ? 1 : 0;
              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              return (
                <g key={i}>
                  <path
                    d={pathData}
                    fill={i % 2 === 0 ? '#1A2233' : '#242E42'}
                    stroke="rgba(255,215,0,0.1)"
                    strokeWidth="0.1"
                  />
                  <text
                    x="50"
                    y="15"
                    transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                    fill={i % 2 === 0 ? '#E0E6ED' : '#FFD700'}
                    fontSize={participants.length > 20 ? "1.5" : "3"}
                    fontWeight="bold"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {name.length > 10 ? name.substring(0, 8) + '...' : name}
                  </text>
                </g>
              );
            })}
            
            {/* Decorative lines */}
            <circle cx="50" cy="50" r="50" fill="none" stroke="rgba(255,215,0,0.05)" strokeWidth="0.5" />
          </svg>
          
          {/* Center cap */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#0A0E17] border-4 border-primary rounded-full shadow-[0_0_15px_rgba(255,215,0,0.3)] flex items-center justify-center z-10">
            <span className="text-primary font-black text-xs tracking-widest">LUCKY</span>
          </div>
        </motion.div>
      </div>

      <Button 
        size="lg" 
        onClick={spin} 
        disabled={isDrawing || participants.length < 2}
        className="w-64 h-16 text-2xl font-black tracking-[4px] rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-black shadow-[0_10px_30px_rgba(255,165,0,0.4)] hover:scale-105 transition-transform border-none"
      >
        {isDrawing ? '正在抽獎...' : '立即抽獎'}
      </Button>
    </div>
  );
};
