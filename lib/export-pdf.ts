import type { Options as Html2CanvasOptions } from 'html2canvas-pro';

/** Tailwind v4 / modern CSS color spaces that legacy html2canvas cannot parse. */
const MODERN_COLOR_RE = /(?:oklch|oklab|lab|lch|color-mix)\(/i;

const COLOR_CSS_PROPS = [
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'caret-color',
  'column-rule-color',
  'fill',
  'stroke',
] as const;

const SHADOW_PROPS = ['box-shadow', 'text-shadow'] as const;

let colorCanvas: HTMLCanvasElement | null = null;

/** Resolve any CSS color string to rgb/hex via the browser (see html2canvas-pro + MDN canvas fillStyle). */
function cssColorToRgb(cssValue: string): string {
  if (!cssValue || cssValue === 'transparent' || cssValue === 'none') {
    return cssValue;
  }

  if (!MODERN_COLOR_RE.test(cssValue) && /^#|^(?:rgb|rgba|hsl|hsla)\(/i.test(cssValue.trim())) {
    return cssValue;
  }

  try {
    if (!colorCanvas) {
      colorCanvas = document.createElement('canvas');
    }
    const ctx = colorCanvas.getContext('2d');
    if (!ctx) return '#94a3b8';

    ctx.fillStyle = '#000000';
    ctx.fillStyle = cssValue;
    const resolved = ctx.fillStyle;

    if (typeof resolved === 'string' && resolved && !MODERN_COLOR_RE.test(resolved)) {
      return resolved;
    }
  } catch {
    // fall through
  }

  return '#94a3b8';
}

function sanitizeShadow(value: string): string {
  if (!value || value === 'none' || !MODERN_COLOR_RE.test(value)) {
    return value;
  }

  return value.replace(
    /(?:oklch|oklab|lab|lch|color-mix|color)\([^)]*\)/gi,
    (match) => cssColorToRgb(match),
  );
}

/**
 * Inline safe rgb colors on the html2canvas clone so stylesheet oklab/oklch rules are not parsed.
 * Pairs nodes with the live DOM so getComputedStyle reflects final rendered values.
 */
export function fixModernColorsForCapture(
  originalRoot: HTMLElement,
  clonedDoc: Document,
): void {
  const clonedRoot = clonedDoc.getElementById(originalRoot.id);
  if (!clonedRoot) return;

  clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    node.parentNode?.removeChild(node);
  });

  const originalNodes = [originalRoot, ...originalRoot.querySelectorAll('*')];
  const clonedNodes = [clonedRoot, ...clonedRoot.querySelectorAll('*')];

  for (let i = 0; i < originalNodes.length && i < clonedNodes.length; i++) {
    const original = originalNodes[i] as HTMLElement;
    const clone = clonedNodes[i] as HTMLElement;
    const computed = window.getComputedStyle(original);

    for (const prop of COLOR_CSS_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') continue;
      clone.style.setProperty(prop, cssColorToRgb(value), 'important');
    }

    const backgroundImage = computed.backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      if (MODERN_COLOR_RE.test(backgroundImage)) {
        const bgColor = computed.backgroundColor;
        clone.style.setProperty('background-image', 'none', 'important');
        if (bgColor && bgColor !== 'transparent') {
          clone.style.setProperty('background-color', cssColorToRgb(bgColor), 'important');
        }
      }
    }

    for (const prop of SHADOW_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (value && value !== 'none' && MODERN_COLOR_RE.test(value)) {
        clone.style.setProperty(prop, sanitizeShadow(value), 'important');
      }
    }

    clone.style.animation = 'none';
    clone.style.transition = 'none';
  }

  clonedRoot.style.height = 'auto';
  clonedRoot.style.overflow = 'visible';
  clonedRoot.style.backgroundColor = cssColorToRgb(
    window.getComputedStyle(originalRoot).backgroundColor,
  );
}

/** Inline resolved colors on the live DOM so capture does not depend on stylesheet parsing. */
export function prepareLiveElementForCapture(root: HTMLElement): () => void {
  const snapshots: { el: HTMLElement; style: string | null }[] = [];
  const nodes = [root, ...root.querySelectorAll('*')] as HTMLElement[];

  for (const el of nodes) {
    snapshots.push({ el, style: el.getAttribute('style') });
    const computed = window.getComputedStyle(el);

    for (const prop of COLOR_CSS_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') continue;
      el.style.setProperty(prop, cssColorToRgb(value), 'important');
    }

    const backgroundImage = computed.backgroundImage;
    if (backgroundImage && backgroundImage !== 'none' && MODERN_COLOR_RE.test(backgroundImage)) {
      const bgColor = computed.backgroundColor;
      el.style.setProperty('background-image', 'none', 'important');
      if (bgColor && bgColor !== 'transparent') {
        el.style.setProperty('background-color', cssColorToRgb(bgColor), 'important');
      }
    }

    for (const prop of SHADOW_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (value && value !== 'none' && MODERN_COLOR_RE.test(value)) {
        el.style.setProperty(prop, sanitizeShadow(value), 'important');
      }
    }

    el.style.animation = 'none';
    el.style.transition = 'none';
  }

  return () => {
    for (const { el, style } of snapshots) {
      if (style === null) {
        el.removeAttribute('style');
      } else {
        el.setAttribute('style', style);
      }
    }
  };
}

export async function waitForReportReady(
  root: HTMLElement,
  { timeoutMs = 30_000, pollMs = 200 }: { timeoutMs?: number; pollMs?: number } = {},
): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const stillLoading =
      root.querySelector('[data-pdf-loading]') ||
      root.querySelector('.animate-spin');

    if (!stillLoading) {
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        await document.fonts.ready;
      }
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  throw new Error('Report is still loading. Please wait a moment and try again.');
}

/**
 * Capture an element and save a multi-page A4 PDF.
 * Uses html2canvas-pro (oklab/oklch support) per https://github.com/niklasvh/html2canvas/issues/3150
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  html2canvasOptions?: Partial<Html2CanvasOptions>,
): Promise<void> {
  const html2canvas = (await import('html2canvas-pro')).default;
  const { jsPDF } = await import('jspdf');

  const restoreLiveStyles = prepareLiveElementForCapture(element);

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#020617',
      logging: false,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: Math.max(element.scrollWidth, 1024),
      onclone: (clonedDoc) => {
        fixModernColorsForCapture(element, clonedDoc);
      },
      ...html2canvasOptions,
    });
  } finally {
    restoreLiveStyles();
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const imgData = canvas.toDataURL('image/jpeg', 0.92);

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
  heightLeft -= contentHeight;

  while (heightLeft > 0) {
    position = margin - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= contentHeight;
  }

  pdf.save(filename);
}
