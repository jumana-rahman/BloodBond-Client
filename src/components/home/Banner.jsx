// components/BloodDonationBanner.js
'use client';

import React, { useMemo } from 'react';
import { Button, Input, Card } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, HeartHandshakeIcon, HeartPulseIcon } from 'lucide-react'; // Using lucide-react for standard icons

// Helper to generate random positions and animations
const generateDropletProps = (index) => ({
  size: 20 + Math.random() * 60, // size between 20px and 80px
  xStart: Math.random() * 100, // % width
  yStart: 100 + Math.random() * 50, // % height (starts below the viewport)
  duration: 15 + Math.random() * 20, // 15 to 35 seconds
  delay: Math.random() * 10, // 0 to 10 seconds delay
});

export default function Banner() {
  // Use useMemo to generate droplets data only once
  const dropletsData = useMemo(() => {
    return Array.from({ length: 40 }).map((_, index) => generateDropletProps(index));
  }, []);

  return (
    <section className="relative w-full h-[600px] overflow-hidden rounded-3xl bg-[#cc0000] text-white">
      {/* Animated Background Droplets */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence>
          {dropletsData.map((data, index) => (
            <motion.div
              key={index}
              className="absolute bg-gradient-to-br from-red-500 to-red-900 rounded-full shadow-2xl opacity-80"
              style={{
                width: `${data.size}px`,
                height: `${data.size}px`,
                left: `${data.xStart}%`,
                bottom: `-${data.size}px`, // Place them just below the bottom edge
                // Use background-image for the gradient and drop shape for more fidelity.
                // For simplicity, using background color and rounded shape. A real teardrop
                // shape would use a clip-path.
                // Clip-path teardrop:
                // clipPath: 'polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)',
              }}
              animate={{
                y: [0, -700, -800], // Float up past the top boundary
                x: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50], // Random horizontal sway
                opacity: [0.8, 0.9, 0.4, 0], // Fade in and then out
              }}
              transition={{
                duration: data.duration,
                delay: data.delay,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content (relative to allow z-index layering) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.2fr,1fr] gap-8 items-center h-full max-w-7xl mx-auto px-6 md:px-12 py-16">
        
        {/* Left Column - Text Content */}
        <div className="flex flex-col space-y-8">
          <div className="flex items-center gap-2">
            <Button
              className="border border-white/50 bg-white/10 text-white flex gap-2"
              size="sm"
              variant="bordered"
              radius="full"
              startContent={<HeartHandshakeIcon size={16} className="text-white" />}
            >
              SAVE LIVES, BE A HERO
            </Button>
          </div>

          <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
            Your Blood<br />Can Save Lives
          </h1>
          
          <p className="text-xl text-white/80 max-w-lg">
            Join our community of donors and help patients in critical need of blood.
          </p>
          
          <div className="flex gap-4 items-center">
            <Button
              className="bg-white text-red-700 font-semibold text-lg px-8 h-12"
              radius="full"
              startContent={<HeartHandshakeIcon size={22} className="text-red-700" />}
            >
              Join as a Donor
            </Button>
            
            <Input
              className="w-full max-w-xs"
              variant="bordered"
              radius="full"
              placeholder="Search Donors"
              startContent={<SearchIcon size={20} className="text-white" />}
              css={{
                '& .nextui-input-wrapper': {
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& input': {
                  color: 'white',
                  '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
            />
          </div>
        </div>
        
        {/* Right Column - Hero Graphic */}
        <div className="relative flex items-center justify-center h-full">
          {/* Main graphic container */}
          <div className="relative aspect-auto h-full max-h-[500px]">
            {/* The background heart and pulse-line are combined into one glowing asset for better styling */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    viewBox="0 0 500 500"
                    className="w-full h-full text-white fill-none opacity-90 filter drop-shadow-[0_0_15px_#ffffff]"
                >
                    {/* Background heart shape with neon effect */}
                    <path
                        d="M250 150 C300 70, 450 70, 450 200 C450 350, 250 480, 250 480 C250 480, 50 350, 50 200 C50 70, 200 70, 250 150 Z"
                        className="stroke-[1] stroke-white"
                        style={{ filter: 'drop-shadow(0 0 10px #ffcccc)' }}
                    />
                    {/* Small plus sign */}
                    <path d="M120,200 L160,200 M140,180 L140,220" className="stroke-[1.5] stroke-white"/>
                    {/* Pulse line */}
                    <path
                        d="M50,200 H160 L180,180 L200,220 L220,160 L240,240 L260,200 L280,210 L300,190 H450"
                        className="stroke-[1.5] stroke-white"
                        style={{ filter: 'drop-shadow(0 0 8px #ffcccc)' }}
                    />
                </svg>
            </div>
            
            {/* IV Stand, Bag, and Tube (rendered from assets or simple elements) */}
            <div className="absolute inset-0 flex flex-col items-center pt-10">
                {/* Simplified IV Stand (needs asset or clever masking for full fidelity) */}
                <div className="absolute top-0 right-[22%] w-[3px] h-[350px] bg-white rounded-full opacity-60"></div>
                
                {/* The Blood Bag (this is the complex asset) */}
                {/* If you have the bag asset, use an <img> or <Image> tag.
                    For code-only representation, it's hard to make it perfect.
                    Here's a representative simple bag to show structure.
                */}
                <Card className="absolute top-[80px] right-[10%] w-[180px] h-[250px] border-3 border-white/80 rounded-t-[10px] rounded-b-[60px] bg-red-900 shadow-2xl overflow-hidden">
                    <div className="p-0 flex items-center justify-center relative">
                        {/* A slight shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 to-red-900/50"></div>
                        
                        {/* Blood effect */}
                        <div className="absolute top-0 w-full h-[85%] bg-red-800 rounded-b-[40px] opacity-80 shadow-inner"></div>
                        
                        {/* The Heart Icon inside the bag */}
                        <HeartPulseIcon size={80} strokeWidth={1} className="text-white absolute fill-white" style={{ filter: 'drop-shadow(0 0 8px #ffcccc)' }} />
                    
                        {/* Bag hanger */}
                        <div className="absolute top-0 right-[15%] w-10 h-8 border-[3px] border-white/80 rounded-b-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white/60 rounded-full"></div>
                        </div>
                    </div>
                </Card>
                
                {/* Connecting tube - representative curve */}
                <div className="absolute top-[330px] right-[15%] w-32 h-[150px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50,0 Q60,50 30,100" className="stroke-white/70 stroke-[4] fill-none" />
                    </svg>
                </div>
            </div>

            {/* Small glowing dots/particles around the main area (Static for now, could be animated) */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="absolute bg-white rounded-full shadow-[0_0_10px_#ffffff]"
                        style={{
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            top: `${Math.random() * 80}%`,
                            left: `${Math.random() * 80}%`,
                        }}
                    />
                ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}