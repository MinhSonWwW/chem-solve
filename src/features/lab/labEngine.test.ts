import { describe, it, expect } from 'vitest';
import { evaluateReaction } from './chemEngine';
import { solveCircuit } from './circuitEngine';
import { calculateFocusClarity, SPECIMENS } from './microscopeEngine';
import type { CircuitComponent } from './types';

describe('Milestone M10: Virtual Lab Simulation Engines', () => {
  // ── Chemistry Reaction Engine Tests ──
  describe('Chemistry Reaction Engine', () => {
    it('evaluates acid + litmus turning red', () => {
      const res = evaluateReaction(['hcl', 'litmus']);
      expect(res).not.toBeNull();
      expect(res?.solutionColor).toBe('#ef4444');
      expect(res?.phenomenon).toContain('màu đỏ');
    });

    it('evaluates base + litmus turning blue', () => {
      const res = evaluateReaction(['naoh', 'litmus']);
      expect(res).not.toBeNull();
      expect(res?.solutionColor).toBe('#0ea5e9');
      expect(res?.phenomenon).toContain('màu xanh');
    });

    it('evaluates base + phenolphthalein turning pink', () => {
      const res = evaluateReaction(['naoh', 'phenol']);
      expect(res).not.toBeNull();
      expect(res?.solutionColor).toBe('#f43f5e');
      expect(res?.phenomenon).toContain('màu hồng');
    });

    it('evaluates zinc + hydrochloric acid releasing H2 gas', () => {
      const res = evaluateReaction(['hcl', 'zinc']);
      expect(res).not.toBeNull();
      expect(res?.gasReleased).toBe('H2');
      expect(res?.gasBubbles).toBe(true);
      expect(res?.equation).toContain('Zn + 2HCl → ZnCl2 + H2↑');
    });

    it('confirms copper does not react with hydrochloric acid', () => {
      const res = evaluateReaction(['hcl', 'copper']);
      expect(res).not.toBeNull();
      expect(res?.equation).toContain('Không phản ứng');
      expect(res?.gasBubbles).toBeUndefined();
    });

    it('evaluates BaCl2 + H2SO4 forming white precipitate BaSO4', () => {
      const res = evaluateReaction(['bacl2', 'h2so4']);
      expect(res).not.toBeNull();
      expect(res?.precipitateColor).toBe('#ffffff');
      expect(res?.equation).toContain('BaSO4↓');
    });
    it('evaluates CaCO3 + HCl releasing CO2 gas effervescence', () => {
      const res = evaluateReaction(['caco3', 'hcl']);
      expect(res).not.toBeNull();
      expect(res?.gasReleased).toBe('CO2');
      expect(res?.gasBubbles).toBe(true);
      expect(res?.equation).toContain('CaCO3 + 2HCl → CaCl2 + H2O + CO2↑');
    });
  });

  // ── Physics Circuit Engine Tests ──
  describe('Physics Circuit Engine', () => {
    it('handles open switch with zero current', () => {
      const components: CircuitComponent[] = [
        { id: 'b1', type: 'battery', value: 3, position: 0 },
        { id: 's1', type: 'switch', value: 0, state: false, position: 1 },
        { id: 'bulb1', type: 'bulb', value: 10, position: 2 },
      ];
      const res = solveCircuit(components);
      expect(res.isClosed).toBe(false);
      expect(res.current).toBe(0);
      expect(res.bulbBrightness).toBe(0);
    });

    it('calculates correct current using Ohm Law: I = U/R', () => {
      const components: CircuitComponent[] = [
        { id: 'b1', type: 'battery', value: 3, position: 0 },
        { id: 's1', type: 'switch', value: 0, state: true, position: 1 },
        { id: 'bulb1', type: 'bulb', value: 10, position: 2 },
      ];
      const res = solveCircuit(components);
      expect(res.isClosed).toBe(true);
      expect(res.isShortCircuit).toBe(false);
      expect(res.totalVoltage).toBe(3);
      expect(res.totalResistance).toBe(10);
      expect(res.current).toBe(0.3); // 3V / 10Ω = 0.3A
      expect(res.bulbBrightness).toBeGreaterThan(0.5);
      expect(res.isBulbBurnt).toBe(false);
    });

    it('handles multiple batteries and series resistor', () => {
      const components: CircuitComponent[] = [
        { id: 'b1', type: 'battery', value: 3, position: 0 },
        { id: 'b2', type: 'battery', value: 1.5, position: 1 },
        { id: 'res1', type: 'resistor', value: 20, position: 2 },
        { id: 'bulb1', type: 'bulb', value: 10, position: 3 },
      ];
      const res = solveCircuit(components);
      expect(res.totalVoltage).toBe(4.5);
      expect(res.totalResistance).toBe(30);
      expect(res.current).toBe(0.15); // 4.5 / 30 = 0.15A
      expect(res.isBulbBurnt).toBe(false);
    });

    it('detects short circuit when battery has no load', () => {
      const components: CircuitComponent[] = [
        { id: 'b1', type: 'battery', value: 9, position: 0 },
        { id: 's1', type: 'switch', value: 0, state: true, position: 1 },
      ];
      const res = solveCircuit(components);
      expect(res.isShortCircuit).toBe(true);
      expect(res.statusMessage).toContain('ĐOẢN MẠCH');
    });

    it('detects overcurrent and burns bulb filament', () => {
      const components: CircuitComponent[] = [
        { id: 'b1', type: 'battery', value: 24, position: 0 }, // Excessive voltage
        { id: 'bulb1', type: 'bulb', value: 10, position: 1 },
      ];
      const res = solveCircuit(components);
      expect(res.current).toBe(2.4); // > 1.2A
      expect(res.isBulbBurnt).toBe(true);
      expect(res.bulbBrightness).toBe(0);
    });
  });

  // ── Biology Microscope Engine Tests ──
  describe('Biology Microscope Engine', () => {
    it('calculates optical focus clarity', () => {
      const optimal = 55;
      const sharpState = calculateFocusClarity(55, optimal);
      expect(sharpState.isSharp).toBe(true);
      expect(sharpState.blurPx).toBe(0);
      expect(sharpState.clarityPercent).toBe(100);

      const blurryState = calculateFocusClarity(20, optimal);
      expect(blurryState.isSharp).toBe(false);
      expect(blurryState.blurPx).toBeGreaterThan(3);
      expect(blurryState.clarityPercent).toBeLessThan(70);
    });

    it('contains all required specimens with organelles', () => {
      expect(SPECIMENS['onion-cell']).toBeDefined();
      expect(SPECIMENS['cheek-cell']).toBeDefined();
      expect(SPECIMENS['leaf-chloroplast']).toBeDefined();
      expect(SPECIMENS['amoeba']).toBeDefined();

      const onion = SPECIMENS['onion-cell'];
      expect(onion.organelles.some((o) => o.name.includes('Thành tế bào'))).toBe(true);
      expect(onion.organelles.some((o) => o.name.includes('Nhân'))).toBe(true);

      const amoeba = SPECIMENS['amoeba'];
      expect(amoeba.organelles.some((o) => o.name.includes('Chân giả'))).toBe(true);
    });
  });
});
