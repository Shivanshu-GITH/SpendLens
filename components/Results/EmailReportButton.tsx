'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailReportButtonProps {
  auditId: string;
  teamSize: number;
}

export function EmailReportButton({ auditId, teamSize }: EmailReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

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
          auditId,
          teamSize,
          website: '', // Honeypot
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      setSubmitted(true);
      localStorage.setItem('spendlens_lead_submitted', 'true');
      toast.success('Report sent to your inbox!');
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="lg" 
        onClick={() => setIsOpen(true)}
        className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 h-12 px-6 font-bold"
      >
        <Mail className="w-5 h-5 mr-2" /> Email Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-2">
              <Mail className="w-6 h-6 text-emerald-500" /> Send Audit Report
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Get the full breakdown and savings guide delivered to your inbox.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Check className="w-16 h-16 text-emerald-500 mb-4 animate-in zoom-in duration-300" />
              <h3 className="text-xl font-bold mb-2">Sent Successfully!</h3>
              <p className="text-slate-400">Check your inbox at {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email_btn" className="text-sm font-bold text-slate-300">Email Address</Label>
                <Input
                  id="email_btn"
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_btn" className="text-sm font-bold text-slate-300">Company Name</Label>
                <Input
                  id="company_btn"
                  type="text"
                  placeholder="Acme Inc."
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-slate-900 border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role_btn" className="text-sm font-bold text-slate-300">Your Role</Label>
                <Input
                  id="role_btn"
                  type="text"
                  placeholder="CTO, Engineering Manager, etc."
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-slate-900 border-slate-800"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-12 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send My Report'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
