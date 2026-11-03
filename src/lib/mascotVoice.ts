// Mascot Voice Acting & Speech Synthesis System (Milestone M14)
// Provides unique voice personas and encouraging Vietnamese voice acting for Atom, Leafy, and Proton.

import {
  CHEM_CORRECT_PRAISE_LINES,
  BIO_CORRECT_PRAISE_LINES,
  PHYSICS_CORRECT_PRAISE_LINES,
  ALL_CORRECT_PRAISE_LINES,
  defaultVoicePicker,
} from '../copy/voiceScripts';

export {
  CHEM_CORRECT_PRAISE_LINES,
  BIO_CORRECT_PRAISE_LINES,
  PHYSICS_CORRECT_PRAISE_LINES,
  ALL_CORRECT_PRAISE_LINES,
  defaultVoicePicker,
};

export type MascotSubject = 'chem' | 'bio' | 'physics';

export interface VoicePersona {
  name: string;
  subject: MascotSubject;
  pitch: number;
  rate: number;
  catchphrase: string;
}

export const MASCOT_PERSONAS: Record<MascotSubject, VoicePersona> = {
  chem: {
    name: 'Atom',
    subject: 'chem',
    pitch: 1.35, // High, playful, bright
    rate: 1.15,
    catchphrase: 'Phản ứng xuất sắc!',
  },
  bio: {
    name: 'Leafy',
    subject: 'bio',
    pitch: 1.15, // Warm, gentle, friendly
    rate: 1.05,
    catchphrase: 'Quan sát rất tinh tế!',
  },
  physics: {
    name: 'Proton',
    subject: 'physics',
    pitch: 0.95, // Energetic, crisp, bold
    rate: 1.1,
    catchphrase: 'Bừng sáng năng lượng!',
  },
};

export const MASCOT_VOICE_SCRIPTS = {
  chem: {
    correct: CHEM_CORRECT_PRAISE_LINES,
    wrong: [
      'Đừng nản nhé, thử lại nào!',
      'Gần đúng rồi, cân bằng lại xem sao!',
      'Bình tĩnh, phản ứng này cần chút thời gian!',
      'Không sao đâu, đọc kỹ gợi ý nhé!',
    ],
    streak: [
      'Combo bùng cháy, tỏa nhiệt cực mạnh!',
      'Chuỗi đúng liên hoàn!',
      'Đẳng cấp nhà nghiên cứu!',
    ],
    completion: [
      'Chúc mừng bạn! Nhà hóa học tương lai đây rồi!',
      'Chặng học xuất sắc, nhận cúp vàng thôi nào!',
    ],
  },
  bio: {
    correct: BIO_CORRECT_PRAISE_LINES,
    wrong: [
      'Không sao cả, cùng nhìn kỹ lại nhé!',
      'Cố lên nào bạn ơi!',
      'Hít một hơi thật sâu rồi làm lại nào!',
      'Quan sát từng bước một nhé!',
    ],
    streak: [
      'Sinh trưởng thần tốc!',
      'Nhịp tim rộn ràng, phong độ đỉnh cao!',
    ],
    completion: [
      'Bạn thật là phi thường! Bảo tồn kiến thức đỉnh cao!',
      'Một bài học tràn ngập mầm xanh tri thức!',
    ],
  },
  physics: {
    correct: PHYSICS_CORRECT_PRAISE_LINES,
    wrong: [
      'Gia tốc lại nào!',
      'Chưa trúng đích, căn lại lực nhé!',
      'Giữ vững cơ năng, thử lại xem!',
      'Kiên trì sẽ tạo ra lực đẩy lớn!',
    ],
    streak: [
      'Công suất cực đại!',
      'Vận tốc ánh sáng, không gì cản nổi!',
    ],
    completion: [
      'Hoàn thành ngoạn mục! Năng lượng đạt đỉnh!',
      'Nhà vật lý siêu đẳng, vinh quang thuộc về bạn!',
    ],
  },
};

function getRandomItem(arr: string[]): string {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index] || arr[0];
}

class MascotVoiceManager {
  private enabled: boolean = false;
  private cachedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.enabled = false;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('chem_voice_enabled');
      } catch {
        // Ignore
      }

      // Preload available voices
      if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
          this.cachedVoice = this.findVietnameseVoice();
        };
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('chem_voice_enabled', String(val));
    }
    if (!val) {
      this.stop();
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public stop() {
    if (typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined') {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  private findVietnameseVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') return null;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural Vietnamese voice
    return (
      voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VIE') || v.lang.includes('VN')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null
    );
  }

  /**
   * Speaks a specific text using the subject persona voice.
   */
  public speakPhrase(subject: MascotSubject, text: string) {
    if (!this.enabled || !text) return;
    if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') return;

    try {
      this.stop();

      const persona = MASCOT_PERSONAS[subject] || MASCOT_PERSONAS.chem;
      const UtteranceConstructor =
        typeof SpeechSynthesisUtterance !== 'undefined'
          ? SpeechSynthesisUtterance
          : (globalThis as unknown as { SpeechSynthesisUtterance?: new (text: string) => unknown })
              .SpeechSynthesisUtterance;
      if (!UtteranceConstructor) return;

      const utterance = new UtteranceConstructor(text) as SpeechSynthesisUtterance;
      utterance.lang = 'vi-VN';
      utterance.pitch = persona.pitch;
      utterance.rate = persona.rate;

      const voice = this.cachedVoice || this.findVietnameseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Gracefully ignore speech synthesis errors
    }
  }

  /**
   * Mascot speaks encouraging praise upon correct answer.
   * Utilizes non-repeating smart picker across 200+ unique voice lines.
   */
  public speakCorrect(subject: MascotSubject = 'chem'): string {
    const scripts = MASCOT_VOICE_SCRIPTS[subject]?.correct || MASCOT_VOICE_SCRIPTS.chem.correct;
    const phrase = defaultVoicePicker.pick(`correct_${subject}`, scripts);
    this.speakPhrase(subject, phrase);
    return phrase;
  }

  /**
   * Returns all correct praise lines for a given subject.
   */
  public getPraiseLines(subject: MascotSubject = 'chem'): readonly string[] {
    return MASCOT_VOICE_SCRIPTS[subject]?.correct || MASCOT_VOICE_SCRIPTS.chem.correct;
  }

  /**
   * Returns all correct praise lines across all subjects (>= 200 lines).
   */
  public getAllPraiseLines(): readonly string[] {
    return ALL_CORRECT_PRAISE_LINES;
  }

  /**
   * Mascot speaks warm encouragement upon wrong answer.
   */
  public speakWrong(subject: MascotSubject = 'chem') {
    const scripts = MASCOT_VOICE_SCRIPTS[subject]?.wrong || MASCOT_VOICE_SCRIPTS.chem.wrong;
    this.speakPhrase(subject, getRandomItem(scripts));
  }

  /**
   * Mascot speaks streak surge cheer.
   */
  public speakStreak(subject: MascotSubject = 'chem') {
    const scripts = MASCOT_VOICE_SCRIPTS[subject]?.streak || MASCOT_VOICE_SCRIPTS.chem.streak;
    this.speakPhrase(subject, getRandomItem(scripts));
  }

  /**
   * Mascot speaks grand celebration when lesson is completed.
   */
  public speakCompletion(subject: MascotSubject = 'chem') {
    const scripts = MASCOT_VOICE_SCRIPTS[subject]?.completion || MASCOT_VOICE_SCRIPTS.chem.completion;
    this.speakPhrase(subject, getRandomItem(scripts));
  }
}

export const mascotVoice = new MascotVoiceManager();
