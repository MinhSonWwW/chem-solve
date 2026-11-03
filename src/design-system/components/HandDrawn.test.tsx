/**
 * Unit tests cho HandDrawnIcon và DoodleOrnament.
 * Kiểm tra:
 *  1. Render được SVG hợp lệ cho mọi icon/doodle.
 *  2. aria-hidden="true" để screen readers bỏ qua.
 *  3. fillColor / color prop ghi đè được.
 *  4. Null-safety cho tên không tồn tại.
 */
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HandDrawnIcon, type HandDrawnIconName } from './HandDrawnIcon';
import { DoodleOrnament, type DoodleOrnamentName } from './DoodleOrnament';

/* ──────────────────────────────────────────────
   HandDrawnIcon
   ────────────────────────────────────────────── */
const ALL_ICONS: HandDrawnIconName[] = [
  'flask',
  'test-tube',
  'atom',
  'dna',
  'heart-flask',
  'ice-shield',
  'xp-potion',
  'treasure-chest',
  'microscope',
  'flame',
];

describe('HandDrawnIcon', () => {
  it.each(ALL_ICONS)('renders SVG for icon "%s"', (name) => {
    const { container } = render(<HandDrawnIcon name={name} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it.each(ALL_ICONS)('icon "%s" is aria-hidden', (name) => {
    const { container } = render(<HandDrawnIcon name={name} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies custom size prop', () => {
    const { container } = render(<HandDrawnIcon name="flask" size={64} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('64');
    expect(svg?.getAttribute('height')).toBe('64');
  });

  it('applies className prop', () => {
    const { container } = render(
      <HandDrawnIcon name="atom" className="test-class-atom" />
    );
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('test-class-atom')).toBe(true);
  });

  it('applies custom fillColor to flask', () => {
    const { container } = render(
      <HandDrawnIcon name="flask" fillColor="var(--err)" />
    );
    const paths = container.querySelectorAll('path');
    const hasFill = Array.from(paths).some(
      (p) => p.getAttribute('fill') === 'var(--err)'
    );
    expect(hasFill).toBe(true);
  });

  it('returns null for unknown icon name', () => {
    // @ts-expect-error — kiểm tra runtime safety
    const { container } = render(<HandDrawnIcon name="does-not-exist" />);
    expect(container.firstChild).toBeNull();
  });

  it('has ink stroke-width of 2.5 on primary path (flask)', () => {
    const { container } = render(<HandDrawnIcon name="flask" />);
    const firstPath = container.querySelector('path');
    expect(firstPath?.getAttribute('stroke-width')).toBe('2.5');
  });
});

/* ──────────────────────────────────────────────
   DoodleOrnament
   ────────────────────────────────────────────── */
const ALL_DOODLES: DoodleOrnamentName[] = [
  'arrow-curved',
  'arrow-bounce',
  'sparkle-star',
  'glint',
  'wavy-underline',
  'double-underline',
  'star-dust',
  'bubble-lab',
];

describe('DoodleOrnament', () => {
  it.each(ALL_DOODLES)('renders SVG for doodle "%s"', (name) => {
    const { container } = render(<DoodleOrnament name={name} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it.each(ALL_DOODLES)('doodle "%s" is aria-hidden', (name) => {
    const { container } = render(<DoodleOrnament name={name} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies custom color to sparkle-star', () => {
    const { container } = render(
      <DoodleOrnament name="sparkle-star" color="var(--bio)" />
    );
    const paths = container.querySelectorAll('path, circle');
    const hasColor = Array.from(paths).some(
      (el) =>
        el.getAttribute('stroke') === 'var(--bio)' ||
        el.getAttribute('fill') === 'var(--bio)'
    );
    expect(hasColor).toBe(true);
  });

  it('applies className prop', () => {
    const { container } = render(
      <DoodleOrnament name="glint" className="glint-class" />
    );
    expect(container.querySelector('.glint-class')).not.toBeNull();
  });

  it('returns null for unknown doodle name', () => {
    // @ts-expect-error — kiểm tra runtime safety
    const { container } = render(<DoodleOrnament name="nonexistent" />);
    expect(container.firstChild).toBeNull();
  });

  it('wavy-underline has correct viewBox for wide underline', () => {
    const { container } = render(<DoodleOrnament name="wavy-underline" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 80 10');
  });
});
