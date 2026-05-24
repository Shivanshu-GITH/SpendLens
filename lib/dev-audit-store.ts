import { AuditResult } from '@/lib/audit-engine/types';
import { isSupabaseConfigured } from '@/lib/supabase';

export type StoredAudit = {
  id: string;
  tools_input: Record<string, unknown>;
  audit_result: AuditResult;
  total_monthly_savings: number;
  total_annual_savings: number;
  team_size: number;
  primary_use_case: string;
};

const globalStore = globalThis as typeof globalThis & {
  __spendlensDevAudits?: Map<string, StoredAudit>;
};

function getStore(): Map<string, StoredAudit> {
  if (!globalStore.__spendlensDevAudits) {
    globalStore.__spendlensDevAudits = new Map();
  }
  return globalStore.__spendlensDevAudits;
}

export function useDevAuditStore(): boolean {
  return process.env.NODE_ENV === 'development' && !isSupabaseConfigured();
}

export const devAuditStore = {
  save(audit: StoredAudit): void {
    getStore().set(audit.id, audit);
  },
  get(id: string): StoredAudit | null {
    return getStore().get(id) ?? null;
  },
};
