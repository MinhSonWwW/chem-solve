import { ExerciseSchema } from './schema/exercise';
import type { Exercise } from './schema/exercise';

import {
  generateMolFromMassExercise,
  generateMassFromMolExercise,
  generateGasVolumeExercise,
  generateGasDensityAirExercise,
  generateMassPercentageExercise,
  generateMolarConcentrationExercise,
  generateMetalAcidStoichiometry,
} from './generators';

const exerciseCache = new Map<string, Exercise[]>();

/**
 * Load and validate exercises for a given lesson.
 * Uses dynamic import to code-split per lesson.
 */
export async function loadExercises(lessonId: string): Promise<Exercise[]> {
  // Support dynamic on-the-fly generated exercises
  if (lessonId.startsWith('gen-')) {
    const list: Exercise[] = [];
    const rnd = (min: number, max: number) => +(Math.random() * (max - min) + min).toFixed(1);

    if (lessonId === 'gen-mol' || lessonId === 'gen-infinite') {
      list.push(generateMolFromMassExercise(Math.floor(Math.random() * 4), rnd(0.2, 2.5), `dyn-${Date.now()}-1`));
      list.push(generateMassFromMolExercise(Math.floor(Math.random() * 4), rnd(0.2, 2.0), `dyn-${Date.now()}-2`));
    }
    if (lessonId === 'gen-gas' || lessonId === 'gen-infinite') {
      list.push(generateGasVolumeExercise('CO2', 'khí cacbonic', rnd(0.5, 3.0), `dyn-${Date.now()}-3`));
      list.push(generateGasDensityAirExercise('SO2', 'khí lưu huỳnh đioxit', 64, `dyn-${Date.now()}-4`));
    }
    if (lessonId === 'gen-solution' || lessonId === 'gen-infinite') {
      list.push(generateMassPercentageExercise('NaCl', 'natri clorua', 15, 85, `dyn-${Date.now()}-5`));
      list.push(generateMolarConcentrationExercise('CuSO4', 'đồng(II) sunfat', rnd(0.1, 0.8), 500, `dyn-${Date.now()}-6`));
    }
    if (lessonId === 'gen-stoich' || lessonId === 'gen-infinite') {
      list.push(generateMetalAcidStoichiometry('Zn', 'kẽm', 65, 13, `dyn-${Date.now()}-7`));
      list.push(generateMetalAcidStoichiometry('Fe', 'sắt', 56, 11.2, `dyn-${Date.now()}-8`));
    }
    return list.slice(0, 5);
  }

  if (exerciseCache.has(lessonId)) {
    return exerciseCache.get(lessonId)!;
  }

  // Extract grade and lesson number from lessonId (e.g., "g8-b03")
  const match = lessonId.match(/^g(\d)-b\d{2}$/);
  if (!match) {
    throw new Error(`Invalid lessonId format: ${lessonId}`);
  }

  const grade = match[1];

  try {
    // Dynamic import — Vite handles JSON modules
    const module = await import(`./exercises/g${grade}/${lessonId}.json`);
    const raw: unknown[] = module.default;

    // Validate each exercise against Zod schema
    const exercises: Exercise[] = raw.map((item, i) => {
      const result = ExerciseSchema.safeParse(item);
      if (!result.success) {
        console.error(`Exercise ${i} in ${lessonId} failed validation:`, result.error.issues);
        throw new Error(`Invalid exercise at index ${i}: ${result.error.issues[0]?.message}`);
      }
      return result.data;
    });

    exerciseCache.set(lessonId, exercises);
    return exercises;
  } catch (err) {
    if (err instanceof Error && err.message.includes('Invalid exercise')) {
      throw err;
    }
    throw new Error(`Failed to load exercises for lesson "${lessonId}": ${err}`);
  }
}

/** Clear the exercise cache (useful for testing) */
export function clearExerciseCache(): void {
  exerciseCache.clear();
}
