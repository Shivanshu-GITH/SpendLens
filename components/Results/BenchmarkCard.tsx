import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenchmarkCardProps {
  spendPerDeveloper: number;
  benchmarkAverage: number;
  teamSize: number;
}

export function BenchmarkCard({ spendPerDeveloper, benchmarkAverage, teamSize }: BenchmarkCardProps) {
  const isAboveAverage = spendPerDeveloper > benchmarkAverage;
  const percentageDiff = Math.abs(((spendPerDeveloper - benchmarkAverage) / benchmarkAverage) * 100).toFixed(0);

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BarChart className="w-5 h-5 text-blue-400" /> Benchmark Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left space-y-1">
            <p className="text-sm text-slate-400 uppercase font-bold tracking-widest">Your Spend / Dev</p>
            <p className="text-4xl font-black text-slate-100">${spendPerDeveloper.toFixed(2)}</p>
          </div>

          <div className="hidden md:block w-px h-12 bg-slate-800"></div>

          <div className="text-center md:text-left space-y-1">
            <p className="text-sm text-slate-400 uppercase font-bold tracking-widest">Industry Avg</p>
            <p className="text-4xl font-black text-slate-500">${benchmarkAverage.toFixed(2)}</p>
          </div>

          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-2xl border font-bold",
            isAboveAverage 
              ? "bg-red-500/10 border-red-500/20 text-red-400" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          )}>
            {isAboveAverage ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {percentageDiff}% {isAboveAverage ? 'higher' : 'lower'} than peers
          </div>
        </div>

        <p className="text-sm text-slate-400 italic">
          * Based on anonymized data from {teamSize < 10 ? 'Seed' : 'Growth'} stage startups with similar team sizes.
        </p>
      </CardContent>
    </Card>
  );
}
