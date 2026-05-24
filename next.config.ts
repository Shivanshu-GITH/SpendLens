import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tailwind v4 emits oklab/oklch; alias ensures all html2canvas imports use the pro fork.
  turbopack: {
    resolveAlias: {
      html2canvas: 'html2canvas-pro',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: 'html2canvas-pro',
    };
    return config;
  },
};

export default nextConfig;
