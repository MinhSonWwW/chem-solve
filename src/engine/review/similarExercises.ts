import { Exercise } from '@/content/schema';
import {
  generateMolFromMassExercise,
  generateMassFromMolExercise,
  generateGasVolumeExercise,
  generateMassPercentageExercise,
  generateMolarConcentrationExercise,
  generateMetalAcidStoichiometry,
} from '@/content/generators';

/**
 * Finds similar exercises from an existing pool or generates fresh ones on-demand
 */
export function findSimilarExercises(
  target: Exercise,
  pool: Exercise[],
  maxResults = 3
): Exercise[] {
  // 1. Filter by shared skillIds and difficulty +/- 1, excluding the target itself
  const matches = pool.filter((ex) => {
    if (ex.id === target.id) return false;
    const sharesSkill = ex.skillIds.some((s) => target.skillIds.includes(s));
    const closeDiff = Math.abs(ex.difficulty - target.difficulty) <= 1;
    return sharesSkill && closeDiff;
  });

  if (matches.length >= maxResults) {
    return matches.slice(0, maxResults);
  }

  // 2. If pool has insufficient matches, dynamically synthesize reinforcement problems via generators!
  const synthesized: Exercise[] = [...matches];
  const targetSkill = target.skillIds[0] || '';

  const uniqueId = `sim-${Date.now().toString().slice(-4)}`;

  if (targetSkill.includes('mol') || targetSkill === 'mol-mass-calc') {
    synthesized.push(generateMolFromMassExercise(3, 0.4, `${uniqueId}-1`));
    synthesized.push(generateMassFromMolExercise(4, 0.5, `${uniqueId}-2`));
  } else if (targetSkill.includes('gas') || targetSkill === 'gas-volume-calc') {
    synthesized.push(generateGasVolumeExercise('N2', 'khí nitơ', 2.5, `${uniqueId}-1`));
  } else if (targetSkill.includes('percentage') || targetSkill === 'mass-percentage-calc') {
    synthesized.push(generateMassPercentageExercise('KCl', 'kali clorua', 15, 85, `${uniqueId}-1`));
  } else if (targetSkill.includes('molar') || targetSkill === 'molar-concentration-calc') {
    synthesized.push(generateMolarConcentrationExercise('HCl', 'axit clohiđric', 0.1, 200, `${uniqueId}-1`));
  } else if (targetSkill.includes('stoich') || targetSkill === 'stoichiometry-calc') {
    synthesized.push(generateMetalAcidStoichiometry('Zn', 'kẽm', 65, 6.5, `${uniqueId}-1`));
  }

  return synthesized.slice(0, maxResults);
}
