import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EquationInput } from './EquationInput';

vi.mock('@/lib/audio', () => ({
  sound: {
    playClick: vi.fn(),
    playCorrect: vi.fn(),
    playWrong: vi.fn(),
    playLevelUp: vi.fn(),
  },
}));

describe('EquationInput', () => {
  it('omits bogus temperature badge when reaction condition is undefined and renders it when provided', () => {
    const { rerender } = render(
      <EquationInput
        mode="fill-coefficients"
        reactants={['Cu', 'AgNO3']}
        products={['Cu(NO3)2', 'Ag']}
        coefficients={[1, 2, 1, 2]}
        value={[1, 2, 1, 2]}
        onChange={vi.fn()}
      />
    );

    expect(screen.queryByText('t°')).not.toBeInTheDocument();

    rerender(
      <EquationInput
        mode="fill-coefficients"
        reactants={['CaCO3']}
        products={['CaO', 'CO2']}
        coefficients={[1, 1, 1]}
        condition="t°"
        value={[1, 1, 1]}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('t°')).toBeInTheDocument();
  });

  it('shows not-simplest real-time warning when coefficients are balanced multiples', () => {
    const { container } = render(
      <EquationInput
        mode="fill-coefficients"
        reactants={['Cu', 'AgNO3']}
        products={['Cu(NO3)2', 'Ag']}
        coefficients={[1, 2, 1, 2]}
        value={[2, 4, 2, 4]}
        verdict={{
          status: 'partial',
          reason: 'not-simplest',
          message:
            'Số nguyên tử hai vế đã bằng nhau, nhưng bộ hệ số (2, 4, 2, 4) chưa tối giản — các hệ số đều chia hết cho 2. Hãy chia tất cả cho 2 để được tỉ lệ tối giản nhất!',
        }}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('Chưa tối giản (chia hết cho 2)')).toBeInTheDocument();
    expect(container.firstElementChild?.firstElementChild?.className).toContain('border-[var(--warn-edge)]');
  });

  it('hides not-simplest warning when coefficients are minimal balanced ratio', () => {
    render(
      <EquationInput
        mode="fill-coefficients"
        reactants={['Cu', 'AgNO3']}
        products={['Cu(NO3)2', 'Ag']}
        coefficients={[1, 2, 1, 2]}
        value={[1, 2, 1, 2]}
        onChange={vi.fn()}
      />
    );

    expect(screen.queryByText(/Chưa tối giản/)).not.toBeInTheDocument();
  });
});

