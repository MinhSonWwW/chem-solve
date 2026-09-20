import { describe, it, expect } from 'vitest';
import {
  generateMolFromMassExercise,
  generateMassFromMolExercise,
  generateGasVolumeExercise,
  generateMolFromGasVolumeExercise,
  generateGasDensityAirExercise,
  generateMassPercentageExercise,
  generateMolarConcentrationExercise,
  generateMetalAcidStoichiometry,
} from './index';
import { ExerciseSchema } from '@/content/schema';

describe('Exercise Generators Validation', () => {
  it('generates valid mol-from-mass exercises', () => {
    const ex = generateMolFromMassExercise(0, 0.5, 'test-01');
    const parseResult = ExerciseSchema.safeParse(ex);
    expect(parseResult.success, JSON.stringify(parseResult.error)).toBe(true);
    expect(ex.answer.kind).toBe('number');
  });

  it('generates valid mass-from-mol exercises', () => {
    const ex = generateMassFromMolExercise(1, 0.25, 'test-02');
    const parseResult = ExerciseSchema.safeParse(ex);
    expect(parseResult.success, JSON.stringify(parseResult.error)).toBe(true);
  });

  it('generates valid gas volume and mol exercises at 24.79 L/mol', () => {
    const ex1 = generateGasVolumeExercise('CO2', 'khí cacbonic', 2, 'test-03');
    expect(ExerciseSchema.safeParse(ex1).success).toBe(true);
    if (ex1.answer.kind === 'number') {
      expect(ex1.answer.value).toBe(49.58);
    }

    const ex2 = generateMolFromGasVolumeExercise('O2', 'khí oxi', 4.958, 'test-04');
    expect(ExerciseSchema.safeParse(ex2).success).toBe(true);
    if (ex2.answer.kind === 'number') {
      expect(ex2.answer.value).toBe(0.2);
    }
  });

  it('generates valid gas density exercises', () => {
    const ex = generateGasDensityAirExercise('SO2', 'khí lưu huỳnh đioxit', 64, 'test-05');
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
  });

  it('generates valid solution concentration exercises (C% and CM)', () => {
    const exCPercent = generateMassPercentageExercise('NaCl', 'natri clorua', 20, 80, 'test-06');
    expect(ExerciseSchema.safeParse(exCPercent).success).toBe(true);
    if (exCPercent.answer.kind === 'number') {
      expect(exCPercent.answer.value).toBe(20);
    }

    const exCMolar = generateMolarConcentrationExercise('CuSO4', 'đồng(II) sunfat', 0.2, 400, 'test-07');
    expect(ExerciseSchema.safeParse(exCMolar).success).toBe(true);
    if (exCMolar.answer.kind === 'number') {
      expect(exCMolar.answer.value).toBe(0.5);
    }
  });

  it('generates valid stoichiometry calculation exercises', () => {
    const ex = generateMetalAcidStoichiometry('Fe', 'sắt', 56, 5.6, 'test-08');
    expect(ExerciseSchema.safeParse(ex).success).toBe(true);
    if (ex.answer.kind === 'number') {
      expect(ex.answer.value).toBe(2.48);
    }
  });

  it('loads dynamic generator exercises via contentLoader seamlessly', async () => {
    const { loadExercises } = await import('@/content/contentLoader');
    const dynamicList = await loadExercises('gen-infinite');
    expect(dynamicList.length).toBe(5);
    dynamicList.forEach((ex) => {
      expect(ExerciseSchema.safeParse(ex).success).toBe(true);
      expect(ex.id).toBeDefined();
    });
  });
});

