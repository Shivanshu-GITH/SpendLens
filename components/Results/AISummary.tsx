'use client';

import { useState, useEffect } from 'react';
import { AuditResult } from '@/lib/audit-engine/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { fetchJson } from '@/lib/fetch-json';

interface AISummaryProps {
  auditResult: AuditResult;
  teamSize: number;
  primaryUseCase: string;
}

export function AISummary({ auditResult, teamSize, primaryUseCase }: AISummaryProps) {
  const [summary, setSummary] = useState<string>(auditResult.aiSummary || '');
  const [loading, setLoading] = useState(!auditResult.aiSummary);

  useEffect(() => {
    // Only fetch if we don't already have a summary (for legacy audits)
    if (auditResult.aiSummary) {
      setLoading(false);
      return;
    }

    async function fetchSummary() {
      try {
        const { data } = await fetchJson<{ summary: string }>('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auditResult, teamSize, primaryUseCase }),
        });
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to fetch summary', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [auditResult, teamSize, primaryUseCase]);

  return (
    <Card className="border-emerald-500/20 bg-slate-900/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles className="w-12 h-12 text-emerald-400" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" /> AI-Generated Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8" data-pdf-loading>
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <span className="ml-3 text-slate-400">AI is analyzing your stack...</span>
          </div>
        ) : (
          <p className="text-slate-300 leading-relaxed italic">
            "{summary}"
          </p>
        )}
      </CardContent>
    </Card>
  );
}
