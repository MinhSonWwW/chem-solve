// Mobile Tactile Haptic Vibration Manager - Zero dependency, graceful degradation
class HapticManager {
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chem_haptic_enabled');
      if (stored !== null) {
        this.enabled = stored === 'true';
      }
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function';
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('chem_haptic_enabled', String(val));
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  private trigger(pattern: number | number[]) {
    if (!this.enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Gracefully ignore on unsupported devices or permission restrictions
    }
  }

  /**
   * 1. Ultra-light click/tap vibration (12ms) - ideal for chunky 3D buttons
   */
  public tap() {
    this.trigger(12);
  }

  /**
   * 2. Light selection tick (8ms) - for selecting options, keyboard keys
   */
  public tick() {
    this.trigger(8);
  }

  /**
   * 3. Joyful 2-pulse bounce for correct answer (15ms buzz, 45ms gap, 25ms accent)
   */
  public correct() {
    this.trigger([15, 45, 25]);
  }

  /**
   * 4. Noticeable warning buzz for incorrect answer (35ms buzz, 50ms gap, 40ms buzz)
   */
  public wrong() {
    this.trigger([35, 50, 40]);
  }

  /**
   * 5. Streak / Combo surge vibration
   */
  public streak() {
    this.trigger([15, 30, 20, 30, 30]);
  }

  /**
   * 6. Grand celebratory fanfare vibration pattern for level-up & trophy completion
   */
  public completion() {
    this.trigger([20, 35, 25, 35, 40, 50, 60]);
  }
}

export const haptic = new HapticManager();
