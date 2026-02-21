import React from 'react';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Globe, ShoppingBag, Calendar, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white/70 backdrop-blur-md shadow-sm">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-black tracking-tighter text-xl">GEMM</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-black hover:scale-105 transition-all">
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center">
        {/* Animated Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-200/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>

        <div className="max-w-7xl mx-auto w-full text-center lg:text-left grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-center lg:items-start z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-100 bg-emerald-50 mb-8">
              <Zap size={14} className="text-emerald-600 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">The New Creator Standard</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              Build your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-500">
                gemm.
              </span>
            </h1>

            <p className="text-xl opacity-60 mb-10 max-w-lg leading-relaxed font-medium">
              The all-in-one operating system for modern creators. Sell products, host events, and own your audience with a link that shines.
            </p>

            {/* THE CLAIM BAR */}
            <form className="w-full max-w-md relative group">
              <div className="flex items-center w-full min-h-[70px] rounded-[2.5rem] border-2 border-gray-100 bg-white shadow-2xl hover:border-emerald-400 transition-all px-2 focus-within:border-emerald-500">
                <div className="pl-5 font-bold opacity-30 text-lg sm:text-xl">gemm.live/</div>
                <input 
                  type="text" 
                  placeholder="yourname" 
                  className="flex-1 bg-transparent outline-none text-lg sm:text-xl font-bold p-2 w-full"
                />
                <button className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg">
                  <span className="hidden sm:inline">Claim</span> <ArrowRight size={20} />
                </button>
              </div>
            </form>

            <div className="flex gap-6 mt-12 opacity-30 font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2"><ShieldCheck size={14}/> Secured by Stripe</div>
              <div className="flex items-center gap-2"><Globe size={14}/> Instant Global Edge</div>
            </div>
          </div>

          {/* RIGHT SIDE: THE MOCKUP */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700 overflow-hidden relative">
              <div className="absolute top-0 w-full h-full bg-slate-50 flex flex-col p-4">
                {/* Profile Header */}
                <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl mb-6 shadow-inner"></div>
                <div className="space-y-3">
                  <div className="h-12 w-full bg-white rounded-xl border border-gray-100 shadow-sm flex items-center px-4 font-bold text-sm text-gray-700">Digital Shop</div>
                  <div className="h-12 w-full bg-white rounded-xl border border-gray-100 shadow-sm flex items-center px-4 font-bold text-sm text-gray-700">Latest Tour Tickets</div>
                  <div className="h-32 w-full bg-zinc-900 rounded-2xl p-4 flex flex-col justify-end">
                    <div className="text-white font-bold text-xs">Featured Item</div>
                    <div className="text-emerald-400 font-bold text-lg">$49.00</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Small Floating Card */}
            <div className="absolute -bottom-6 -left-10 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 hidden md:block animate-bounce">
                <div className="text-[10px] font-black uppercase text-emerald-600">New Sale</div>
                <div className="text-sm font-bold">+$120.00</div>
            </div>
          </div>

        </div>
      </main>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
           <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"><ShoppingBag /></div>
              <h3 className="text-xl font-bold mb-2">Commerce</h3>
              <p className="text-sm opacity-60">Sell digital goods and physical merch in two clicks.</p>
           </div>
           <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-6"><Calendar /></div>
              <h3 className="text-xl font-bold mb-2">Events</h3>
              <p className="text-sm opacity-60">Host workshops or meetups with built-in ticketing.</p>
           </div>
           <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6"><Layers /></div>
              <h3 className="text-xl font-bold mb-2">Insights</h3>
              <p className="text-sm opacity-60">Deep analytics to understand your audience growth.</p>
           </div>
        </div>
      </section>

    </div>
  );
}