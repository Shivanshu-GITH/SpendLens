'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToolRow } from './ToolRow';
import { AuditFormInput, ToolInput, UseCase } from '@/lib/audit-engine/types';
import { Button } from '@/components/ui/button';
import { Plus, Calculator, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ApiError, fetchJson } from '@/lib/fetch-json';

const STORAGE_KEY = 'spendlens_audit_draft';

export function AuditForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuditFormInput>({
    tools: [
      { toolId: 'cursor', plan: 'pro', seats: 1, monthlySpend: 20 },
    ],
    teamSize: 1,
    primaryUseCase: 'coding',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setFormData(prev => ({ ...prev, ...parsed }));
        }, 0);
      } catch (e) {
        console.error('Failed to parse saved audit draft', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const addTool = () => {
    setFormData({
      ...formData,
      tools: [
        ...formData.tools,
        { toolId: 'chatgpt', plan: 'plus', seats: 1, monthlySpend: 20 },
      ],
    });
  };

  const updateTool = (index: number, updatedTool: ToolInput) => {
    const newTools = [...formData.tools];
    newTools[index] = updatedTool;
    setFormData({ ...formData, tools: newTools });
  };

  const removeTool = (index: number) => {
    const newTools = formData.tools.filter((_, i) => i !== index);
    setFormData({ ...formData, tools: newTools });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (formData.teamSize <= 0) {
        toast.error('Team size must be at least 1');
        setLoading(false);
        return;
      }

      if (formData.tools.some(t => t.seats <= 0 || t.monthlySpend < 0)) {
        toast.error('Tool seats and spend must be positive values');
        setLoading(false);
        return;
      }

      const { data } = await fetchJson<{ auditId: string }>('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const { auditId } = data;
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/results/${auditId}`);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof ApiError
          ? error.message
          : 'Something went wrong. Please try again.';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-300">Total Team Size</label>
          <Input
            type="number"
            min={1}
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 1 })}
            className="bg-slate-950 border-slate-800"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-300">Primary Use Case</label>
          <Select
            value={formData.primaryUseCase}
            onValueChange={(val: UseCase) => setFormData({ ...formData, primaryUseCase: val })}
          >
            <SelectTrigger className="bg-slate-950 border-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800">
              <SelectItem value="coding">Software Engineering</SelectItem>
              <SelectItem value="writing">Content & Writing</SelectItem>
              <SelectItem value="data">Data & Analysis</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="mixed">Mixed Usage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your AI Tools</h2>
          <Button type="button" variant="outline" size="sm" onClick={addTool} className="border-slate-800">
            <Plus className="w-4 h-4 mr-2" /> Add Tool
          </Button>
        </div>
        
        {formData.tools.map((tool, index) => (
          <ToolRow
            key={index}
            tool={tool}
            onChange={(updated) => updateTool(index, updated)}
            onRemove={() => removeTool(index)}
          />
        ))}

        {formData.tools.length === 0 && (
          <div className="p-8 text-center border border-dashed rounded-lg border-slate-800 text-slate-500">
            No tools added yet. Add your first AI tool to start the audit.
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-slate-800">
        <Button
          type="submit"
          disabled={loading || formData.tools.length === 0}
          className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Running Audit...
            </>
          ) : (
            <>
              <Calculator className="w-6 h-6 mr-2" /> Calculate Savings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
