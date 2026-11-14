import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MathText } from '@/design-system/components/MathText';
import { PracticeUnitChips } from './PracticeUnitChips';
import { loadPracticeBank } from '@/content/practice';
import { loadExercises } from '@/content/contentLoader';
import { unitPool } from '@/content/practice/practiceRound';

const Where = () => <div data-testid="where">{useLocation().pathname + useLocation().search}</div>;

describe('practice units on the Practice page', () => {
  it('shows one chip per unit and opens a practice round', async () => {
    render(
      <MemoryRouter initialEntries={['/practice']}>
        <Routes>
          <Route path="/practice" element={<PracticeUnitChips lessonId="phy-g6-b01" />} />
          <Route path="/play/:lessonId/:nodeId" element={<Where />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(await screen.findByText('Đơn vị và dụng cụ đo chiều dài'));
    expect(screen.getByTestId('where').textContent).toBe('/play/phy-g6-b01/practice-don-vi-dung-cu?mode=practice');
  });

  it('grade 6 practice questions render without raw markup', async () => {
    for (const lessonId of ['g6-b11', 'phy-g6-b08', 'bio-g6-b04']) {
      const bank = (await loadPracticeBank(lessonId))!;
      const ex = await loadExercises(lessonId);
      for (const u of bank.units) {
        for (const e of unitPool(bank, u, ex)) {
          const { container, unmount } = render(<MathText text={e.prompt} />);
          expect(container.textContent, e.id).not.toContain('[[');
          unmount();
        }
      }
    }
  });
});
