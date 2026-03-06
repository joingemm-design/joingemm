import React from 'react';

const marqueeItems = [
  "SELL MERCH INSTANTLY", "NO CODE REQUIRED", "OWN YOUR AUDIENCE", 
  "UNLOCK YOUR CITY", "EXCLUSIVE EVENTS", "LIVE EXPERIENCES"
];

export default function Marquee() {
  return (
    <div className="relative py-8 overflow-hidden bg-black border-y-2 border-white/10 -rotate-1 transform">
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-12">
            {marqueeItems.map((text) => (
              <div key={text} className="flex items-center gap-4 text-white">
                <span className="text-3xl font-black italic tracking-tighter uppercase">{text}</span>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}