# 🧾 SpendLens — AI Spend Audit Tool

See exactly where your AI budget is burning. SpendLens is a free, 2-minute audit tool for startup teams to identify redundant AI subscriptions and optimize their spend.

![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2F100-brightgreen)
![Build Status](https://github.com/your-username/spendlens/actions/workflows/ci.yml/badge.svg)

## 🚀 Live Demo
[spendlens.vercel.app](https://spendlens.vercel.app)

## ✨ Features
- **Deterministic Audit Engine:** Rule-based analysis of tool redundancy and plan mismatches.
- **AI-Generated Summaries:** Personalized insights powered by Claude 3 Haiku.
- **Shareable Results:** Unique URLs with Server-Side Rendered OG tags for social sharing.
- **Privacy First:** No login required. No bank connections needed.
- **localStorage Persistence:** Draft your audit and come back later without losing data.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Next.js API Routes, Supabase (PostgreSQL)
- **Integrations:** Anthropic (Claude SDK), Resend (Email)
- **Testing:** Vitest

## 📦 Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/spendlens.git
   cd spendlens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in your keys.
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   npm run test
   ```

## 🏗️ Architecture
See [ARCHITECTURE.md](ARCHITECTURE.md) for a detailed breakdown of the system design and data flow.

## ⚖️ Trade-offs
1. **Manual Input vs. Plaid/Bank Sync:** Chose manual input to reduce friction and eliminate privacy concerns for a simple audit tool.
2. **Deterministic Rules vs. LLM-only:** Used a TypeScript engine for the math to ensure 100% accuracy, using LLMs only for the natural language summary.
3. **Supabase vs. PlanetScale:** Chose Supabase for its built-in Auth and Storage potential, and superior DX for small-to-medium projects.
4. **localStorage vs. DB Drafts:** Used localStorage for draft persistence to avoid unnecessary DB writes and simplify the "No Login" experience.
5. **Tailwind CSS vs. CSS Modules:** Chose Tailwind for rapid prototyping and easy integration with shadcn/ui.

## 📄 Documentation
- [DEVLOG.md](DEVLOG.md) - Daily progress logs
- [REFLECTION.md](REFLECTION.md) - Project retrospective
- [PRICING_DATA.md](PRICING_DATA.md) - Sourced pricing references
- [GTM.md](GTM.md) - Go-to-market strategy

---
Built by the SpendLens Team. All pricing data sourced directly from vendor pages.
