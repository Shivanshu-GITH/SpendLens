'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles } from 'lucide-react';

export function OptimizationCTA() {
  return (
    <div className="p-8 rounded-3xl bg-linear-to-br from-indigo-900/50 to-blue-900/50 border border-indigo-500/20 shadow-xl overflow-hidden relative">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Exclusive Offer
          </div>
          <h3 className="text-3xl font-black mb-4">Capture Even More Savings</h3>
          <p className="text-indigo-200 text-lg mb-0">
            Based on your spend, you qualify for **discounted AI credits** via our partner network. 
            Reduce your API costs by up to 30% through our exclusive optimization programs.
          </p>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-lead-modal'));
          }}
          className="bg-white text-indigo-950 hover:bg-indigo-50 font-black h-14 px-8 text-lg"
        >
          Claim My Credits <ExternalLink className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
