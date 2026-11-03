import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MathText } from './MathText';

describe('MathText component', () => {
  it('renders inline math with KaTeX without raw dollar signs', () => {
    const { container } = render(
      <MathText text="Công thức tính: $W_đ = \frac{1}{2} m v^2$" />
    );
    expect(container.textContent).not.toContain('$');
    const katexEl = container.querySelector('.katex');
    expect(katexEl).not.toBeNull();
  });

  it('renders mixed Vietnamese text with scientific notation', () => {
    const { container } = render(
      <MathText text="Định nghĩa: Năng lượng do vật chuyển động mà có được gọi là động năng (kí hiệu: $W_đ$)." />
    );
    expect(container.textContent).toContain('Định nghĩa: Năng lượng do vật chuyển động');
    expect(container.textContent).not.toContain('$W_đ$');
    const katexEl = container.querySelector('.katex');
    expect(katexEl).not.toBeNull();
  });

  it('renders chemical formulas wrapped in double brackets [[H2SO4]]', () => {
    const { container } = render(
      <MathText text="Dung dịch [[H2SO4]] tác dụng với kim loại" />
    );
    expect(container.textContent).not.toContain('[[');
    expect(container.textContent).not.toContain(']]');
    const subs = container.querySelectorAll('sub');
    expect(subs.length).toBe(2);
  });

  it('renders markdown bold **...** text', () => {
    const { container } = render(
      <MathText text="Quy tắc: **Tốc độ tăng 2 lần** thì động năng tăng 4 lần ($2^2 = 4$)." />
    );
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe('Tốc độ tăng 2 lần');
    const katexEl = container.querySelector('.katex');
    expect(katexEl).not.toBeNull();
  });

  it('renders multi-math scientific parameter definitions without lingering dollars', () => {
    const { container } = render(
      <MathText text="Trong đó: $m$ là khối lượng của vật (đơn vị: kg); $v$ là tốc độ của vật (đơn vị: m/s); $W_đ$ là động năng của vật (đơn vị: Jun, kí hiệu J)." />
    );
    expect(container.textContent).not.toContain('$');
    const katexEls = container.querySelectorAll('.katex');
    expect(katexEls.length).toBe(3);
  });

  it('renders unit conversions with text macros and thin spaces ($1\\text{ kJ} = 1\\,000\\text{ J}$)', () => {
    const { container } = render(
      <MathText text="Ghi nhớ đơn vị: $1\\text{ kJ} = 1\\,000\\text{ J}$; $1\\text{ MJ} = 1\\,000\\,000\\text{ J}$." />
    );
    expect(container.textContent).not.toContain('$');
    const katexEls = container.querySelectorAll('.katex');
    expect(katexEls.length).toBe(2);
  });

  it('handles empty or null text safely', () => {
    const { container } = render(<MathText text="" />);
    expect(container.firstChild).toBeNull();
  });
});

