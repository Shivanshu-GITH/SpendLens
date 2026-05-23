-- Audits table (public shareable data)
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tools_input JSONB NOT NULL,
  audit_result JSONB NOT NULL,
  total_monthly_savings DECIMAL(10, 2) NOT NULL,
  total_annual_savings DECIMAL(10, 2) NOT NULL,
  team_size INT,
  primary_use_case TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table (private, never exposed publicly)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id),
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INT,
  referral_code TEXT,
  is_high_savings BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Audits are publicly readable (for shareable URLs)
CREATE POLICY "Audits are publicly readable" ON audits
  FOR SELECT USING (true);

-- Only the server can insert (using service role key in API routes)
CREATE POLICY "Service role can insert audits" ON audits
  FOR INSERT WITH CHECK (true);

-- Leads are only server-accessible
CREATE POLICY "Service role only for leads" ON leads
  USING (false); -- No client access ever
