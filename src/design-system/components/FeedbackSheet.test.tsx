import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeedbackSheet } from './FeedbackSheet';

vi.mock('@/lib/audio', () => ({
  sound: {
    playClick: vi.fn(),
    playCorrect: vi.fn(),
    playWrong: vi.fn(),
    playLevelUp: vi.fn(),
  },
}));

describe('FeedbackSheet', () => {
  it('stays fixed at viewport bottom without conflicting relative class and displays partial diagnosis details', () => {
    const onRetry = vi.fn();
    const onContinue = vi.fn();

    const { container } = render(
      <FeedbackSheet
        status="partial"
        diagnosis="Hệ số chưa tối giản"
        smartHint="Số nguyên tử hai vế đã bằng nhau, nhưng bộ hệ số (2, 4, 2, 4) chưa tối giản — các hệ số đều chia hết cho 2. Hãy chia tất cả cho 2 để được tỉ lệ tối giản nhất!"
        onContinue={onContinue}
        onRetry={onRetry}
      />
    );

    const sheetEl = container.firstElementChild as HTMLElement;
    expect(sheetEl.className).toContain('fixed');
    expect(sheetEl.className).toContain('bottom-0');
    expect(sheetEl.className).not.toMatch(/\brelative\b/);

    expect(screen.getByText('Gần đúng rồi!')).toBeInTheDocument();
    expect(screen.getByText('Hệ số chưa tối giản')).toBeInTheDocument();
    expect(screen.getByText(/chia hết cho 2/)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: 'Sửa lại' });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onContinue).not.toHaveBeenCalled();
  });
});

