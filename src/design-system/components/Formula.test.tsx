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

  it('safely renders full Vietnamese text without dropping characters or diacritics', () => {
    render(<Formula formula="Đun sôi nước bốc thành hơi nước" data-testid="vn-text" />);
    const el = screen.getByTestId('vn-text');
    expect(el.textContent).toBe('Đun sôi nước bốc thành hơi nước');
  });

  it('safely renders Vietnamese text with mixed chemical formula and numbers', () => {
    const { container } = render(<Formula formula="Cho 100 ml dung dịch H2SO4 phản ứng với Fe" />);
    const subs = container.querySelectorAll('sub');
    expect(subs.length).toBe(2);
    expect(subs[0].textContent).toBe('2');
    expect(subs[1].textContent).toBe('4');
    expect(container.textContent).toContain('Cho 100 ml dung dịch');
  });
});
