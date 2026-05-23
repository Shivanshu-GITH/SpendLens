# ARCHITECTURE.md — SpendLens

## Tech Stack Decision
| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Essential for Server-Side Rendering (SSR) of Open Graph (OG) tags for shareable URLs, and built-in API routes. |
| **Language** | TypeScript | Ensures type safety for complex audit engine logic and pricing data. |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development of a modern, accessible, and responsive UI. |
| **Database** | Supabase | Postgres-as-a-service with excellent TypeScript support and built-in RLS for secure data handling. |
| **Email** | Resend | Simple DX for transactional emails with a generous free tier. |
| **LLM** | Gemini / Anthropic | Multi-provider support. Uses Gemini 1.5 Flash (Free Tier) by default, with Anthropic and Deterministic fallbacks. |

## Data Flow Diagram
```mermaid
graph TD
    A[User visits /audit] --> B[Fills form - persisted in localStorage]
    B --> C[Submits form]
    C --> D[POST /api/audit]
    D --> E[runAudit engine - pure TypeScript]
    E --> F[Save to Supabase audits table]
    F --> G[Return auditId]
    G --> H[Redirect to /results/auditId]
    H --> I[Server fetches audit from Supabase]
    I --> J[Render results page with OG tags]
    J --> K[Client loads AI summary via /api/summary]
    K --> L[AI Summary Service]
    L --> L1[Google Gemini - Free]
    L --> L2[Anthropic - Paid]
    L --> L3[Deterministic Fallback - $0]
    J --> M[User enters email]
    M --> N[POST /api/leads]
    N --> O[Save to Supabase leads table]
    N --> P[Send email via Resend]
```

## Scalability & Performance
- **Deterministic Engine:** The core audit logic is a pure function, making it extremely fast and easy to test.
- **Edge Runtime:** The OG image generation runs on the edge for minimal latency.
- **SSR for SEO:** Results pages are server-rendered to ensure metadata is available for social sharing.
- **Rate Limiting:** IP-based rate limiting on lead capture prevents abuse of the Resend API.
