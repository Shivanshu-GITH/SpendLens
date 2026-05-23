'use client';

import { useEffect } from 'react';
import { ToolInput } from '@/lib/audit-engine/types';
import { PRICING_DATA } from '@/lib/audit-engine/pricing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ToolRowProps {
  tool: ToolInput;
  onChange: (updatedTool: ToolInput) => void;
  onRemove: () => void;
}

export function ToolRow({ tool, onChange, onRemove }: ToolRowProps) {
  const toolPricing = PRICING_DATA[tool.toolId];

  // Ensure plan is always valid for the selected tool
  useEffect(() => {
    if (toolPricing && !toolPricing.plans.find(p => p.name === tool.plan)) {
      const firstPlan = toolPricing.plans[0].name;
      onChange({ ...tool, plan: firstPlan });
    }
  }, [tool.toolId, toolPricing, tool.plan, tool, onChange]);

  const updateSpend = (updatedTool: ToolInput) => {
    const pricing = PRICING_DATA[updatedTool.toolId];
    const plan = pricing.plans.find((p) => p.name === updatedTool.plan);
    if (plan && !plan.isCustom) {
      updatedTool.monthlySpend = plan.pricePerUser * updatedTool.seats;
    }
    onChange(updatedTool);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg border-slate-800 bg-slate-900/50">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">Tool</label>
        <Select
          value={tool.toolId}
          onValueChange={(val) => {
            const firstPlan = PRICING_DATA[val].plans[0].name;
            updateSpend({ ...tool, toolId: val, plan: firstPlan });
          }}
        >
          <SelectTrigger className="bg-slate-950 border-slate-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-slate-800">
            {Object.values(PRICING_DATA).map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">Plan</label>
        <Select
          value={tool.plan}
          onValueChange={(val) => updateSpend({ ...tool, plan: val })}
        >
          <SelectTrigger className="bg-slate-950 border-slate-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-slate-800">
            {toolPricing.plans.map((p) => (
              <SelectItem key={p.name} value={p.name}>
                {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">Seats</label>
        <Input
          type="number"
          min={1}
          value={tool.seats}
          onChange={(e) => updateSpend({ ...tool, seats: parseInt(e.target.value) || 1 })}
          className="bg-slate-950 border-slate-800"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-400">Monthly Spend ($)</label>
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            value={tool.monthlySpend}
            onChange={(e) => onChange({ ...tool, monthlySpend: parseFloat(e.target.value) || 0 })}
            className="bg-slate-950 border-slate-800"
          />
          <Button variant="ghost" size="icon" onClick={onRemove} className="text-slate-500 hover:text-red-400">
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
