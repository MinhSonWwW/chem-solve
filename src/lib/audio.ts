// Web Audio API synthesized sound effects - zero dependencies, zero network requests, instant playback
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chem_sound_muted');
      if (stored !== null) {
        this.isMuted = stored === 'true';
      }
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('chem_sound_muted', String(muted));
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  // 1. Crisp pop/click sound for buttons and options
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Audio playback fails gracefully if blocked by browser policy
    }
  }

  // 2. Bright, cheerful chime chord for correct answer (Duolingo signature style)
  public playCorrect() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.25 }, // C5
        { freq: 659.25, time: 0.08, dur: 0.28 }, // E5
        { freq: 783.99, time: 0.16, dur: 0.45 }, // G5
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.3, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // Graceful ignore
    }
  }

  // 3. Low, soft double-thud tone for wrong answer
  public playWrong() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 220, time: 0.0, dur: 0.12 }, // A3
        { freq: 174.61, time: 0.1, dur: 0.25 }, // F3
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + time + dur);

        gain.gain.setValueAtTime(0.18, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // Graceful ignore
    }
  }

  // 4. Sparkling arpeggio for streak / fanfare
  public playStreak() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const time = idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.25, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + 0.36);
      });
    } catch {
      // Graceful ignore
    }
  }

  // 5. Crisp tap-to-place / drag-and-drop snapping sound
  public playDragDrop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.035);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Graceful ignore
    }
  }

  // 6. Confident check / submit sound
  public playSubmit() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Graceful ignore
    }
  }

  // 7. Chemistry bubbling effect (micro bubbles popping in test tube)
  public playBubbling() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 4 miniature rising pitch bubble bursts
      const bubbleDelays = [0.0, 0.07, 0.13, 0.22];
      bubbleDelays.forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startFreq = 400 + idx * 80 + Math.random() * 50;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, now + delay + 0.045);

        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.055);
      });
    } catch {
      // Graceful ignore
    }
  }

  // 8. Chemistry gas hiss (gentle filtered effervescence)
  public playGasHiss() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 0.25; // 250ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.25);
    } catch {
      // Graceful ignore
    }
  }

  // 9. Level up celebratory brassy fanfare
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // G4 -> C5 -> E5 -> G5
      const fanfare = [
        { freq: 392.0, time: 0.0, dur: 0.12 },
        { freq: 523.25, time: 0.12, dur: 0.12 },
        { freq: 659.25, time: 0.24, dur: 0.14 },
        { freq: 783.99, time: 0.38, dur: 0.45 },
      ];

      fanfare.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.28, now + time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {
      // Graceful ignore
    }
  }

  // 10. Completion fanfare chord
  public playCompletion() {
    this.playLevelUp();
    setTimeout(() => {
      this.playStreak();
    }, 450);
  }
}

export const sound = new SoundManager();

