import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '',
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey, serviceRoleKey } = getSupabaseConfig();
  return Boolean(url && anonKey && serviceRoleKey);
}

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  if (!publicClient) {
    publicClient = createClient(url, anonKey);
  }
  return publicClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  const { url, serviceRoleKey } = getSupabaseConfig();
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey);
  }
  return adminClient;
}
