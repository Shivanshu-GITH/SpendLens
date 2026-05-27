import { ToolAudit } from '@/lib/audit-engine/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, CheckCircle2, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolBreakdownProps {
  audits: ToolAudit[];
}

export function ToolBreakdown({ audits }: ToolBreakdownProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Per-Tool Analysis</h3>
      <div className="grid grid-cols-1 gap-4">
        {audits.map((audit, index) => (
          <AuditCard key={index} audit={audit} />
        ))}
      </div>
    </div>
  );
}

function AuditCard({ audit }: { audit: ToolAudit }) {
  const isOptimal = audit.action === 'keep';
  
  const iconMap = {
    keep: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    downgrade: <ArrowDownRight className="w-6 h-6 text-yellow-500" />,
    switch: <RefreshCw className="w-6 h-6 text-blue-500" />,
    eliminate: <XCircle className="w-6 h-6 text-red-500" />,
    optimize: <AlertCircle className="w-6 h-6 text-purple-500" />,
  };

  const actionColors = {
    keep: 'border-emerald-500/20 bg-emerald-500/5',
    downgrade: 'border-yellow-500/20 bg-yellow-500/5',
    switch: 'border-blue-500/20 bg-blue-500/5',
    eliminate: 'border-red-500/20 bg-red-500/5',
    optimize: 'border-purple-500/20 bg-purple-500/5',
  };

  return (
    <Card className={cn("border bg-slate-900/50", actionColors[audit.action])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            {iconMap[audit.action]}
          </div>
          <div>
            <CardTitle className="text-xl font-bold capitalize">
              {audit.toolId.replace(/_/g, ' ')}
            </CardTitle>
            <p className="text-sm text-slate-400">
              Current: {audit.currentPlan} — ${audit.currentMonthlySpend}/mo
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn("text-xl font-black", isOptimal ? "text-slate-400" : "text-emerald-400")}>
            {isOptimal ? "$0" : `-$${audit.savingsPerMonth}`}
          </div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Savings</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 text-slate-300 text-sm">
          <span className="font-bold text-slate-100 uppercase text-[10px] mr-2 px-1.5 py-0.5 rounded bg-slate-800">
            Recommendation
          </span>
          {audit.reason}
        </div>
      </CardContent>
    </Card>
  );
}
