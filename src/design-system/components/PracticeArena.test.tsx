import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MinigameIllustration, type MinigameId } from './MinigameIllustration';
import { GeneratorBadge } from './GeneratorBadge';

const ALL_MINIGAMES: MinigameId[] = [
  'blood-transfusion',
  'equation-balance',
  'formula-builder',
  'reaction-builder',
  'match',
  'sort',
  'speed',
  'true-false',
  'review',
];

const ALL_GENERATORS = [
  'gen-infinite',
  'gen-mol',
  'gen-gas',
  'gen-solution',
  'gen-stoich',
  'phy-gen-infinite',
  'phy-gen-speed',
  'phy-gen-density',
  'phy-gen-pressure',
  'phy-gen-energy',
  'phy-gen-ohm',
  'bio-gen-infinite',
  'bio-gen-mendel',
  'bio-gen-dna',
  'bio-gen-chromosomes',
  'bio-gen-calories',
  'bio-gen-blood',
];

describe('MinigameIllustration Component (M4)', () => {
  it.each(ALL_MINIGAMES)('renders SVG for minigame "%s"', (id) => {
    const { container } = render(<MinigameIllustration id={id} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies custom size and className', () => {
    const { container } = render(
      <MinigameIllustration id="blood-transfusion" size={72} className="test-illustration" />
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('72');
    expect(svg?.getAttribute('height')).toBe('72');
    expect(svg?.classList.contains('test-illustration')).toBe(true);
  });
});

describe('GeneratorBadge Component (M4)', () => {
  it.each(ALL_GENERATORS)('renders formula stamp SVG for "%s"', (id) => {
    const { container } = render(<GeneratorBadge id={id} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies custom size and className to GeneratorBadge', () => {
    const { container } = render(
      <GeneratorBadge id="gen-mol" size={60} className="test-badge" />
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('60');
    expect(svg?.getAttribute('height')).toBe('60');
    expect(svg?.classList.contains('test-badge')).toBe(true);
  });
});
