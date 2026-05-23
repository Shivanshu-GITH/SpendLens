# REFLECTION.md — SpendLens

### 1. What was the most difficult technical challenge you faced?
The most difficult challenge was building a deterministic audit engine that could handle multiple overlapping rules while remaining defensible. For instance, determining when GitHub Copilot becomes redundant when using Cursor is straightforward, but deciding when a team should switch from individual Claude Pro plans to a Claude Team plan requires careful calculation of seat counts and plan-specific features. I had to ensure the math was transparent in the `reason` field so users could trust the recommendation.

### 2. How did you handle the trade-off between speed and code quality?
I prioritized a modular architecture for the audit engine. By separating pricing data, rule logic, and the main runner, I was able to write unit tests for the core logic early on. This "logic-first" approach meant that even while I was rushing to build the frontend, I knew the underlying savings calculations were accurate and verified. I used shadcn/ui to save time on UI primitives while focusing my effort on the custom `AuditForm` and `Results` components.

### 3. If you had 48 more hours, what would you add?
I would implement a PDF export feature for the audit report, as many engineering managers need a document to present to their finance or procurement departments. Additionally, I'd build a "Benchmark" mode that compares a team's spend per developer against industry averages for startups at similar stages (Seed, Series A, etc.), which would add another layer of value to the lead generation funnel.

### 4. What did you learn about the AI tool market while building this?
The market is highly fragmented but with significant overlap. Many tools (like Cursor and Windsurf) are built on top of the same underlying models (Claude/GPT), leading to massive redundancy in startup stacks. I also noticed that "Team" plans are often priced to encourage seat expansion rather than just per-user utility, which is a major area where startups overspend without realizing it.

### 5. How does this project act as a lead-gen tool for Credex?
SpendLens provides immediate value (cost savings) without any friction (no login). By surfacing high monthly savings, it naturally qualifies leads for Credex's primary offering: discounted AI credits. The "Credex CTA" only appears when significant savings are found, making the pitch feel like a helpful next step rather than a generic advertisement. The shareable URL also creates a viral loop where managers share the tool with their peers.
