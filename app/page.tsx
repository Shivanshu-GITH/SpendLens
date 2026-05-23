import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Share2, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-32 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-12 text-sm font-medium border rounded-full bg-slate-900 border-slate-800 text-slate-400">
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green-400"></span>
          <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
        </span>
        Free AI Spend Audit Tool
      </div>

      <h1 className="max-w-4xl mb-6 text-5xl font-extrabold tracking-tight lg:text-7xl">
        Stop Guessing. See Exactly What Your{' '}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
          AI Tools
        </span>{' '}
        Should Cost.
      </h1>

      <p className="max-w-2xl mb-10 text-xl text-slate-400">
        Free 2-minute audit for startup teams. No login required. Get personalized savings recommendations instantly.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/audit">
          <Button size="lg" className="h-12 px-8 text-lg font-bold bg-emerald-600 hover:bg-emerald-700">
            Run My Audit <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Link href="#how-it-works" scroll={true}>
          <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-bold border-slate-800 hover:bg-slate-900">
            How it works
          </Button>
        </Link>
      </div>

      <div id="how-it-works" className="grid w-full max-w-5xl grid-cols-1 gap-8 mt-32 sm:grid-cols-3 pt-32 border-t border-slate-900">
        <FeatureCard
          icon={<Zap className="w-8 h-8 text-yellow-400" />}
          title="Instant Audit"
          description="Identify redundant tools and plan mismatches in under 2 minutes."
        />
        <FeatureCard
          icon={<BarChart3 className="w-8 h-8 text-blue-400" />}
          title="Personalized ROI"
          description="Get a detailed breakdown of potential monthly and annual savings."
        />
        <FeatureCard
          icon={<Share2 className="w-8 h-8 text-emerald-400" />}
          title="Shareable Reports"
          description="Generate unique URLs to share results with your finance team."
        />
      </div>

      <div className="mt-32 p-8 border rounded-2xl border-slate-800 bg-slate-900/50 max-w-2xl">
        <p className="text-lg italic text-slate-300">
          &quot;Saved us $1,200/month in 5 minutes. The audit showed us we were paying for three different coding assistants when we only needed one.&quot;
        </p>
        <div className="mt-4 font-bold text-slate-400">— Sarah K., CTO at FinTech startup</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 text-left border rounded-xl border-slate-800 bg-slate-900/50">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
