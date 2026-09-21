import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Mascot, MascotState } from './Mascot';
import { ReactionVisualizer } from './ReactionVisualizer';
import { sound } from '@/lib/audio';

describe('Mascot 9 States Component', () => {
  const allStates: MascotState[] = [
    'idle',
    'happy',
    'thinking',
    'correct',
    'wrong',
    'celebrating',
    'surprised',
    'sleeping',
    'cheering',
    'out_of_hearts',
  ];

  allStates.forEach((st) => {
    it(`renders state "${st}" correctly`, () => {
      render(<Mascot state={st} size="md" data-testid={`mascot-${st}`} />);
      const el = screen.getByTestId(`mascot-${st}`);
      expect(el).toBeInTheDocument();
      expect(el).toHaveAttribute('title', `Flasky (${st})`);
    });
  });

  it('handles click interaction without errors', () => {
    const handleClick = vi.fn();
    render(<Mascot state="happy" onClick={handleClick} data-testid="interactive-mascot" />);
    const el = screen.getByTestId('interactive-mascot');
    fireEvent.click(el);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('ReactionVisualizer Component', () => {
  it('renders gas effect with label', () => {
    render(<ReactionVisualizer type="gas" label="↑ Khí H2 bay lên" autoPlaySound={false} />);
    expect(screen.getByText('↑ Khí H2 bay lên')).toBeInTheDocument();
  });

  it('renders precipitate effect with custom color', () => {
    render(
      <ReactionVisualizer
        type="precipitate"
        color="#38bdf8"
        label="↓ Kết tủa Cu(OH)2 xanh lam"
        autoPlaySound={false}
      />
    );
    expect(screen.getByText('↓ Kết tủa Cu(OH)2 xanh lam')).toBeInTheDocument();
  });

  it('renders indicator effect', () => {
    render(
      <ReactionVisualizer
        type="indicator"
        color="#ef4444"
        label="Quỳ tím hóa đỏ"
        autoPlaySound={false}
      />
    );
    expect(screen.getByText('Quỳ tím hóa đỏ')).toBeInTheDocument();
  });

  it('renders liquid level effect', () => {
    render(
      <ReactionVisualizer
        type="liquid-level"
        label="Đo thể tích dung dịch"
        autoPlaySound={false}
      />
    );
    expect(screen.getByText('Đo thể tích dung dịch')).toBeInTheDocument();
  });
});

describe('SoundManager', () => {
  it('toggles muted state and persists to localStorage', () => {
    sound.setMuted(true);
    expect(sound.isSoundMuted()).toBe(true);
    expect(localStorage.getItem('chem_sound_muted')).toBe('true');

    sound.setMuted(false);
    expect(sound.isSoundMuted()).toBe(false);
    expect(localStorage.getItem('chem_sound_muted')).toBe('false');
  });

  it('triggers synthesized sounds without crashing', () => {
    expect(() => {
      sound.playClick();
      sound.playCorrect();
      sound.playWrong();
      sound.playStreak();
      sound.playDragDrop();
      sound.playSubmit();
      sound.playBubbling();
      sound.playGasHiss();
      sound.playLevelUp();
    }).not.toThrow();
  });
});
