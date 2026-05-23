# USER_INTERVIEWS.md — SpendLens

## Interview 1 — J.D., CTO, Seed Stage Fintech
**Date:** 2026-05-18
**Duration:** 15 minutes

**Direct quotes:**
- "I have no idea how many of my devs are on individual Claude plans vs the company account."
- "If you can show me a single number of what I'm wasting, I'll use it in my next board meeting."

**Most surprising thing:** They aren't worried about $20/mo, they are worried about the *administrative overhead* of tracking 50 different $20/mo subscriptions.
**What it changed:** Added the "Team vs Individual" logic to the audit engine.

## Interview 2 — M.S., Engineering Manager, Series A SaaS
**Date:** 2026-05-19
**Duration:** 10 minutes

**Direct quotes:**
- "We use Cursor and Copilot. I know it's redundant but some devs just like the Copilot ghost text better."
- "I'd share a link with our Ops person if it actually had a 'Save as PDF' or 'Shareable Link'."

**Most surprising thing:** Redundancy is often a choice, not an accident. The audit needs to explain *why* it's redundant (feature parity).
**What it changed:** Improved the "Redundancy" reasoning in `rules.ts` to be more persuasive.

## Interview 3 — R.K., Founder, Bootstrap AI Agency
**Date:** 2026-05-20
**Duration:** 20 minutes

**Direct quotes:**
- "API costs are my biggest headache. I don't care about the $20 ChatGPT seats, I care about the $2,000 OpenAI bill."
- "Credex credits sound interesting if it's a direct plug-and-play."

**Most surprising thing:** For small agencies, API spend outweighs seat spend 10:1.
**What it changed:** Ensured the audit form includes API direct spend and added the Credex CTA for high API spenders.
