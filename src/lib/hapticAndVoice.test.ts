import { describe, it, expect, vi, beforeEach } from 'vitest';
import { haptic } from './haptic';
import {
  mascotVoice,
  MASCOT_PERSONAS,
  MASCOT_VOICE_SCRIPTS,
  CHEM_CORRECT_PRAISE_LINES,
  BIO_CORRECT_PRAISE_LINES,
  PHYSICS_CORRECT_PRAISE_LINES,
  ALL_CORRECT_PRAISE_LINES,
  defaultVoicePicker,
} from './mascotVoice';

describe('Milestone M14: Mobile Haptic & Mascot Voice Acting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mobile Tactile Haptic Manager', () => {
    it('supports enable, disable and toggle state changes', () => {
      haptic.setEnabled(true);
      expect(haptic.isEnabled()).toBe(true);

      haptic.setEnabled(false);
      expect(haptic.isEnabled()).toBe(false);

      const toggled = haptic.toggle();
      expect(toggled).toBe(true);
      expect(haptic.isEnabled()).toBe(true);
    });

    it('triggers vibrate pattern when navigator.vibrate is available', () => {
      const mockVibrate = vi.fn();
      vi.stubGlobal('navigator', { vibrate: mockVibrate });

      haptic.setEnabled(true);
      haptic.tap();
      expect(mockVibrate).toHaveBeenCalledWith(12);

      haptic.tick();
      expect(mockVibrate).toHaveBeenCalledWith(8);

      haptic.correct();
      expect(mockVibrate).toHaveBeenCalledWith([15, 45, 25]);

      haptic.wrong();
      expect(mockVibrate).toHaveBeenCalledWith([35, 50, 40]);

      haptic.streak();
      expect(mockVibrate).toHaveBeenCalledWith([15, 30, 20, 30, 30]);

      haptic.completion();
      expect(mockVibrate).toHaveBeenCalledWith([20, 35, 25, 35, 40, 50, 60]);

      vi.unstubAllGlobals();
    });

    it('gracefully does not vibrate when disabled', () => {
      const mockVibrate = vi.fn();
      vi.stubGlobal('navigator', { vibrate: mockVibrate });

      haptic.setEnabled(false);
      haptic.tap();
      expect(mockVibrate).not.toHaveBeenCalled();

      haptic.setEnabled(true);
      vi.unstubAllGlobals();
    });
  });

  describe('Mascot Voice Acting & Personas', () => {
    it('has distinct personas configured for all 3 mascots', () => {
      expect(MASCOT_PERSONAS.chem.name).toBe('Atom');
      expect(MASCOT_PERSONAS.chem.pitch).toBeGreaterThan(1.2); // Playful pitch

      expect(MASCOT_PERSONAS.bio.name).toBe('Leafy');
      expect(MASCOT_PERSONAS.bio.pitch).toBeGreaterThan(1.0); // Gentle warm pitch

      expect(MASCOT_PERSONAS.physics.name).toBe('Proton');
      expect(MASCOT_PERSONAS.physics.pitch).toBeLessThan(1.0); // Bold energetic pitch
    });

    it('contains rich encouraging scripts for all events', () => {
      (['chem', 'bio', 'physics'] as const).forEach((subj) => {
        expect(MASCOT_VOICE_SCRIPTS[subj].correct.length).toBeGreaterThanOrEqual(3);
        expect(MASCOT_VOICE_SCRIPTS[subj].wrong.length).toBeGreaterThanOrEqual(3);
        expect(MASCOT_VOICE_SCRIPTS[subj].streak.length).toBeGreaterThanOrEqual(2);
        expect(MASCOT_VOICE_SCRIPTS[subj].completion.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('provides at least 200 distinct correct praise voice lines across subjects', () => {
      const allLines = ALL_CORRECT_PRAISE_LINES;
      expect(allLines.length).toBeGreaterThanOrEqual(200);

      // Verify no duplicates across the entire corpus
      const uniqueLines = new Set(allLines);
      expect(uniqueLines.size).toBe(allLines.length);
      expect(uniqueLines.size).toBeGreaterThanOrEqual(200);

      // Verify each individual subject has extensive pools (>= 70 lines each)
      expect(CHEM_CORRECT_PRAISE_LINES.length).toBeGreaterThanOrEqual(70);
      expect(BIO_CORRECT_PRAISE_LINES.length).toBeGreaterThanOrEqual(70);
      expect(PHYSICS_CORRECT_PRAISE_LINES.length).toBeGreaterThanOrEqual(70);

      // Verify mascotVoice manager exposes them
      expect(mascotVoice.getAllPraiseLines().length).toBeGreaterThanOrEqual(200);
      expect(mascotVoice.getPraiseLines('chem')).toBe(CHEM_CORRECT_PRAISE_LINES);
      expect(mascotVoice.getPraiseLines('bio')).toBe(BIO_CORRECT_PRAISE_LINES);
      expect(mascotVoice.getPraiseLines('physics')).toBe(PHYSICS_CORRECT_PRAISE_LINES);
    });

    it('features authentic subject-tailored pedagogical terminology for THCS', () => {
      // Chemistry: reactions, mole, acids, bases, precipitates, conservation
      const chemSample = CHEM_CORRECT_PRAISE_LINES.join(' ');
      expect(chemSample).toMatch(/phản ứng|mol|axit|bazơ|kết tủa|khối lượng|electron/i);

      // Biology: cells, DNA, photosynthesis, respiration, ecosystems, genetics
      const bioSample = BIO_CORRECT_PRAISE_LINES.join(' ');
      expect(bioSample).toMatch(/tế bào|quang hợp|ADN|Men-đen|hệ sinh thái|tuần hoàn/i);

      // Physics: energy, Ohm law, circuit, velocity, force, optics
      const physSample = PHYSICS_CORRECT_PRAISE_LINES.join(' ');
      expect(physSample).toMatch(/năng lượng|định luật|mạch điện|vận tốc|thấu kính|áp suất/i);
    });

    it('picker rotates non-repeating praise lines without immediate duplicates', () => {
      defaultVoicePicker.reset();
      const testPool = ['Câu 1', 'Câu 2', 'Câu 3', 'Câu 4', 'Câu 5'];
      const picked: string[] = [];

      for (let i = 0; i < 5; i++) {
        const item = defaultVoicePicker.pick('test_pool', testPool);
        picked.push(item);
      }

      // First 5 picks of a 5-item pool with history must be distinct
      const uniquePicked = new Set(picked);
      expect(uniquePicked.size).toBe(5);
    });

    it('invokes speech synthesis when available', () => {
      const mockSpeak = vi.fn();
      const mockCancel = vi.fn();
      class MockUtterance {
        text: string;
        lang = '';
        pitch = 1;
        rate = 1;
        constructor(text: string) {
          this.text = text;
        }
      }
      vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
      vi.stubGlobal('speechSynthesis', {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: () => [],
      });

      mascotVoice.setEnabled(true);
      mascotVoice.speakPhrase('chem', 'Thử nghiệm giọng nói');

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();

      vi.unstubAllGlobals();
    });

    it('respects mute setting for voice acting', () => {
      const mockSpeak = vi.fn();
      vi.stubGlobal('speechSynthesis', {
        speak: mockSpeak,
        cancel: vi.fn(),
        getVoices: () => [],
      });

      mascotVoice.setEnabled(false);
      mascotVoice.speakCorrect('bio');

      expect(mockSpeak).not.toHaveBeenCalled();

      mascotVoice.setEnabled(true);
      vi.unstubAllGlobals();
    });
  });
});
