'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

interface LeadCaptureModalProps {
  auditId: string;
  teamSize: number;
  isAlreadyOptimal?: boolean;
}

export function LeadCaptureModal({ auditId, teamSize, isAlreadyOptimal }: LeadCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [referral, setReferral] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-lead-modal', handleOpen);
    
    // Show modal after 3 seconds
    const timer = setTimeout(() => {
      const hasSubmitted = localStorage.getItem('spendlens_lead_submitted');
      if (!hasSubmitted) {
        setIsOpen(true);
      }
    }, 3000);
    
    return () => {
      window.removeEventListener('open-lead-modal', handleOpen);
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName: company,
          role,
          referralCode: referral,
          auditId,
          teamSize,
          website: '', // Honeypot
        }),
      });

      if (!response.ok) throw new Error('Failed to save lead');

      setSubmitted(true);
      localStorage.setItem('spendlens_lead_submitted', 'true');
      toast.success('Report sent to your email!');
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-500" /> 
            {isAlreadyOptimal ? 'Get Optimization Alerts' : 'Save Your Report'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isAlreadyOptimal 
              ? "Your stack is already great! Enter your email to be notified when new AI pricing optimizations or discounts apply to your tools."
              : "Enter your email to receive the full audit report and a personalized savings implementation guide."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-in zoom-in duration-300" />
            <h3 className="text-xl font-bold mb-2">
              {isAlreadyOptimal ? "You're on the list!" : "Check your inbox!"}
            </h3>
            <p className="text-slate-400">
              {isAlreadyOptimal 
                ? "We'll notify you as soon as we find new ways to save on your stack."
                : `We've sent the report to ${email}.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-bold text-slate-300">Company Name</Label>
              <Input
                id="company"
                type="text"
                placeholder="Acme Inc."
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-slate-900 border-slate-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-bold text-slate-300">Your Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="CTO, Engineering Manager, etc."
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-900 border-slate-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral" className="text-sm font-bold text-slate-300">Referral Code (Optional)</Label>
              <Input
                id="referral"
                type="text"
                placeholder="CREDEX-PRO-20"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className="bg-slate-900 border-slate-800"
              />
            </div>
            
            {/* Honeypot */}
            <input type="text" name="website" className="hidden" tabIndex={-1} />

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isAlreadyOptimal ? 'Signing up...' : 'Saving...'}
                </>
              ) : (
                isAlreadyOptimal ? 'Notify Me of Savings' : 'Get My Report'
              )}
            </Button>
            <p className="text-[10px] text-center text-slate-500">
              By submitting, you agree to receive a one-time audit report and occasional updates from SpendLens.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
