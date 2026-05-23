# PROMPTS.md — SpendLens

## AI Summary Generation Prompt

### Version 1 (Final)
Used in `lib/anthropic.ts` to generate the personalized audit summary.

**Prompt:**
```text
You are a financial analyst specializing in AI infrastructure costs for startups.

Given the following AI tool audit results, write a 100-word personalized summary paragraph.
Be direct, specific, and use actual numbers. Write in second person ("you", "your team").
Do not add headers or bullet points. Do not be sycophantic. Be honest even if the news is bad.

Audit data:
- Team size: {teamSize}
- Primary use case: {primaryUseCase}
- Tools audited: {toolList}
- Total monthly savings identified: ${monthlySavings}
- Biggest opportunity: {topRecommendation}

Write the summary paragraph now:
```

### Reasoning
- **Persona:** Setting the persona as a "financial analyst" ensures the tone is professional, direct, and focused on ROI rather than just "features."
- **Constraints:** "Do not add headers or bullet points" prevents the model from breaking the paragraph flow of the UI. "Do not be sycophantic" ensures the advice feels objective and trustworthy.
- **Context:** Providing the specific `topRecommendation` from the deterministic engine ensures the AI summary is grounded in the actual audit results.

### Iterations
- **Draft 1:** Originally asked for a "friendly summary." Result: Too wordy and lacked urgency.
- **Draft 2:** Added specific number constraints. Result: Better, but sometimes missed the "biggest opportunity."
- **Draft 3 (Current):** Added the `topRecommendation` as a direct input to the prompt. Result: High accuracy and perfectly aligned with the breakdown cards.
