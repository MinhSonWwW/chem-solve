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
      list.push(generateGasVolumeExercise('CO2', 'carbon dioxide', rnd(0.5, 3.0), `dyn-${Date.now()}-3`));
      list.push(generateGasDensityAirExercise('SO2', 'sulfur dioxide', 64, `dyn-${Date.now()}-4`));
    }
    if (lessonId === 'gen-solution' || lessonId === 'gen-infinite') {
      list.push(generateMassPercentageExercise('NaCl', 'sodium chloride', 15, 85, `dyn-${Date.now()}-5`));
      list.push(generateMolarConcentrationExercise('CuSO4', 'copper(II) sulfate', rnd(0.1, 0.8), 500, `dyn-${Date.now()}-6`));
    }
    if (lessonId === 'gen-stoich' || lessonId === 'gen-infinite') {
      list.push(generateMetalAcidStoichiometry('Zn', 'zinc (kẽm)', 65, 13, `dyn-${Date.now()}-7`));
      list.push(generateMetalAcidStoichiometry('Fe', 'iron (sắt)', 56, 11.2, `dyn-${Date.now()}-8`));
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

/**
 * Load and select a targeted subset of exercises for a specific milestone node.
 * This guarantees proper scaffolding (introductory vs advanced questions)
 * and keeps each learning session within 4-7 questions.
 */
export async function loadExercisesForNode(
  lessonId: string,
  nodeId: string
): Promise<Exercise[]> {
  const allExercises = await loadExercises(lessonId);
  if (!allExercises || allExercises.length === 0) return [];

  // Special node-level partitioning for multi-node lessons
  if (lessonId === 'g8-b03') {
    if (nodeId.endsWith('n01')) {
      const basic = allExercises.filter(
        (q) =>
          q.difficulty === 1 ||
          q.skillIds.some((s) => s.includes('mol') || s.includes('gas-volume'))
      );
      return basic.slice(0, 6);
    }
    if (nodeId.endsWith('n02')) {
      const advanced = allExercises.filter(
        (q) =>
          q.difficulty === 2 ||
          q.skillIds.some((s) => s.includes('density') || s.includes('molecular'))
      );
      return advanced.slice(0, 6);
    }
  }

  if (lessonId === 'g7-b02') {
    // 12 questions: n01 = atomic structure (p, n, e), n02 = atomic mass (amu)
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 6);
    if (nodeId.endsWith('n02')) return allExercises.slice(6, 12);
  }

  if (lessonId === 'g6-b09') {
    // 12 questions: n01 = objects/matter, n02 = properties, n03 = heating sugar/salt, boss = composite
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 4);
    if (nodeId.endsWith('n02')) return allExercises.slice(4, 8);
    if (nodeId.endsWith('n03')) return allExercises.slice(8, 12);
    if (nodeId.endsWith('boss')) {
      return [
        allExercises[0],
        allExercises[2],
        allExercises[4],
        allExercises[6],
        allExercises[8],
        allExercises[10],
      ].filter(Boolean);
    }
  }

  if (lessonId === 'g6-b10') {
    // 9 questions: n01 = 3 states, n02 = state changes, n03 = boiling/evaporation, boss = composite
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 3);
    if (nodeId.endsWith('n02')) return allExercises.slice(3, 6);
    if (nodeId.endsWith('n03')) return allExercises.slice(6, 9);
    if (nodeId.endsWith('boss')) return allExercises.slice(0, 6);
  }

  if (lessonId === 'g6-b11') {
    // 8 questions: n01 = oxygen role, n02 = air composition, n03 = air pollution, boss = composite
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 3);
    if (nodeId.endsWith('n02')) return allExercises.slice(3, 6);
    if (nodeId.endsWith('n03')) return allExercises.slice(5, 8);
    if (nodeId.endsWith('boss')) return allExercises.slice(0, 6);
  }

  // For lessons with more than 7 questions (e.g. g7-b01, g7-b03, g7-b04),
  // limit to 6 questions per session to avoid heart exhaustion
  if (allExercises.length > 7) {
    return allExercises.slice(0, 6);
  }

  return allExercises;
}

import { TheoryContentSchema, type TheoryContent } from './schema/theory';
export type { TheoryContent };

const theoryCache = new Map<string, TheoryContent>();

/**
 * Load and validate micro-learning theory content for a given lesson.
 */
export async function loadTheory(lessonId: string): Promise<TheoryContent | null> {
  if (theoryCache.has(lessonId)) {
    return theoryCache.get(lessonId)!;
  }

  const match = lessonId.match(/^g(\d)-b\d{2}$/);
  if (!match) return null;

  const grade = match[1];

  try {
    const module = await import(`./theories/g${grade}/${lessonId}.json`);
    const raw: unknown = module.default;

    const result = TheoryContentSchema.safeParse(raw);
    if (!result.success) {
      console.error(`Theory in ${lessonId} failed validation:`, result.error.issues);
      throw new Error(`Invalid theory in ${lessonId}: ${result.error.issues[0]?.message}`);
    }

    theoryCache.set(lessonId, result.data);
    return result.data;
  } catch (err) {
    return null;
  }
}

/** Clear the exercise and theory caches (useful for testing) */
export function clearExerciseCache(): void {
  exerciseCache.clear();
  theoryCache.clear();
}

