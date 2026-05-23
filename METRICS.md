# METRICS.md — SpendLens

## North Star Metric
**Weekly Audits Completed**
*Why:* This measures the core value delivery and is the primary driver of the lead-gen funnel.

## Input Metrics
1. **Landing Page Conversion Rate:** (Landing Page Views / Audit Starts)
   - *Target:* > 60%
2. **Audit Completion Rate:** (Audit Starts / Audit Submissions)
   - *Target:* > 80% (If lower, the form is too complex)
3. **Lead Conversion Rate:** (Audit Submissions / Email Captures)
   - *Target:* > 25%
4. **Viral Coefficient:** (Unique Results Page Shares / Total Audits)
   - *Target:* > 0.15

## Pivot Triggers
- **Low Completion Rate (< 40%):** The form has too many fields. Action: Simplify to "Top 3 Tools" only.
- **Low Savings Identified (< $50 avg):** Our rules are too conservative or we're targeting the wrong users. Action: Add more complex API usage rules.
- **Zero Shares:** The results page doesn't look "impressive" enough. Action: Redesign `HeroSavings` to be more "brag-worthy."

## Monitoring Tools
- **Supabase Dashboard:** Track total rows in `audits` and `leads`.
- **Vercel Analytics:** Track page views and performance (Lighthouse).
- **LogSnag (Optional):** Real-time event tracking for "Audit Completed."
