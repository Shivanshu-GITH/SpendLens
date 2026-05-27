'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Spend Audit Report',
          text: 'Check out how much I could save on my AI tool stack!',
          url: window.location.href,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Button 
      variant="outline" 
      size="lg" 
      onClick={handleShare}
      className="border-slate-800 bg-slate-900 hover:bg-slate-800 h-12 px-6"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 mr-2 text-emerald-500" /> Copied
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5 mr-2" /> Share Report
        </>
      )}
    </Button>
  );
}
