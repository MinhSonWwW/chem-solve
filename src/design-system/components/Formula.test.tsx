import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Formula } from './Formula';

describe('Formula component', () => {
  it('renders H2SO4 with proper subscripts', () => {
    const { container } = render(<Formula code="H2SO4" />);
    const subs = container.querySelectorAll('sub');
    expect(subs.length).toBe(2);
    expect(subs[0].textContent).toBe('2');
    expect(subs[1].textContent).toBe('4');
  });

  it('renders Fe^3+ with superscript', () => {
    const { container } = render(<Formula code="Fe^3+" />);
    const sup = container.querySelector('sup');
    expect(sup).not.toBeNull();
    expect(sup?.textContent).toBe('3+');
  });

  it('strips bracket syntax [[H2]]', () => {
    render(<Formula code="[[H2]]" />);
    expect(screen.getByText('H')).toBeInTheDocument();
  });
});
