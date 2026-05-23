export interface PlanPricing {
  name: string;
  pricePerUser: number;
  isCustom?: boolean;
}

export interface ToolPricing {
  id: string;
  name: string;
  plans: PlanPricing[];
}

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    plans: [
      { name: 'hobby', pricePerUser: 0 },
      { name: 'pro', pricePerUser: 20 },
      { name: 'business', pricePerUser: 40 },
      { name: 'enterprise', pricePerUser: 0, isCustom: true },
    ],
  },
  github_copilot: {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    plans: [
      { name: 'individual', pricePerUser: 10 },
      { name: 'business', pricePerUser: 19 },
      { name: 'enterprise', pricePerUser: 39 },
    ],
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    plans: [
      { name: 'free', pricePerUser: 0 },
      { name: 'pro', pricePerUser: 20 },
      { name: 'max', pricePerUser: 100 },
      { name: 'team', pricePerUser: 25 },
      { name: 'enterprise', pricePerUser: 0, isCustom: true },
      { name: 'api direct', pricePerUser: 0, isCustom: true },
    ],
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    plans: [
      { name: 'free', pricePerUser: 0 },
      { name: 'plus', pricePerUser: 20 },
      { name: 'team', pricePerUser: 25 },
      { name: 'enterprise', pricePerUser: 0, isCustom: true },
      { name: 'api direct', pricePerUser: 0, isCustom: true },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    plans: [
      { name: 'business', pricePerUser: 20 },
      { name: 'enterprise', pricePerUser: 30 },
      { name: 'education', pricePerUser: 0, isCustom: true },
      { name: 'api direct', pricePerUser: 0, isCustom: true },
    ],
  },
  gemini_api: {
    id: 'gemini_api',
    name: 'Gemini API',
    plans: [
      { name: 'direct', pricePerUser: 0, isCustom: true },
    ],
  },
  anthropic_api: {
    id: 'anthropic_api',
    name: 'Anthropic API',
    plans: [
      { name: 'direct', pricePerUser: 0, isCustom: true },
    ],
  },
  openai_api: {
    id: 'openai_api',
    name: 'OpenAI API',
    plans: [
      { name: 'direct', pricePerUser: 0, isCustom: true },
    ],
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    plans: [
      { name: 'free', pricePerUser: 0 },
      { name: 'pro', pricePerUser: 20 },
      { name: 'enterprise', pricePerUser: 0, isCustom: true },
    ],
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    plans: [
      { name: 'free', pricePerUser: 0 },
      { name: 'pro', pricePerUser: 15 },
      { name: 'teams', pricePerUser: 35 },
    ],
  },
  v0: {
    id: 'v0',
    name: 'v0 (Vercel)',
    plans: [
      { name: 'free', pricePerUser: 0 },
      { name: 'premium', pricePerUser: 20 },
      { name: 'enterprise', pricePerUser: 0, isCustom: true },
    ],
  },
};
