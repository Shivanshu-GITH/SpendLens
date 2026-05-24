import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixModernColorsForCapture } from '../lib/export-pdf';

describe('export-pdf', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('replaces oklch colors on the cloned tree using live DOM computed styles', () => {
    const original = document.createElement('div');
    original.id = 'audit-report-content';
    const child = document.createElement('p');
    child.textContent = 'Savings';
    original.appendChild(child);
    document.body.appendChild(original);

    const clonedDoc = document.implementation.createHTMLDocument('clone');
    const clonedRoot = clonedDoc.createElement('div');
    clonedRoot.id = 'audit-report-content';
    const clonedChild = clonedDoc.createElement('p');
    clonedChild.textContent = 'Savings';
    clonedRoot.appendChild(clonedChild);
    clonedDoc.body.appendChild(clonedRoot);

    const getPropertyValue = vi.fn((prop: string) => {
      if (prop === 'color') return 'oklab(0.7 0.1 180)';
      if (prop === 'background-color') return 'transparent';
      if (prop === 'background-image') return 'none';
      return '';
    });

    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue,
    } as unknown as CSSStyleDeclaration);

    fixModernColorsForCapture(original, clonedDoc);

    expect(clonedChild.style.getPropertyValue('color')).toBeTruthy();
    expect(clonedChild.style.getPropertyValue('color')).not.toMatch(/oklab|oklch/i);
  });
});
