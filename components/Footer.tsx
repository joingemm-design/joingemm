import React from 'react';

export default function Footer() {
  return (
    <footer className="py-24 px-6 border-t border-zinc-100 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="font-black tracking-tighter text-3xl mb-4 italic italic uppercase">GEMM</div>
          <p className="opacity-40 text-sm max-w-xs font-medium">
            The complete operating system for the next generation of digital empires.
          </p>
        </div>
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-widest mb-6">Platform</h4>
          <div className="flex flex-col gap-3 text-xs font-bold opacity-40">
            <a href="/pricing">Pricing</a>
            <a href="/events">Events</a>
            <a href="/dashboard">Creator OS</a>
          </div>
        </div>
        <div>
          <h4 className="font-black text-[10px] uppercase tracking-widest mb-6">Support</h4>
          <div className="flex flex-col gap-3 text-xs font-bold opacity-40">
            <a href="/contact">Contact Us</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-100 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] opacity-30">
        <div>© 2026 GEMM INC.</div>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           All Systems Operational
        </div>
      </div>
    </footer>
  );
}