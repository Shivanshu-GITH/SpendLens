import { AuditForm } from '@/components/AuditForm/AuditForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="container max-w-5xl py-12 px-4">
      <Link href="/" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-100 mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Run Your AI Spend Audit</h1>
        <p className="text-xl text-slate-400">
          Enter your team's current AI tool stack below. We'll compare your spending against the best available plans and identifies overlaps.
        </p>
      </div>

      <AuditForm />
    </div>
  );
}
