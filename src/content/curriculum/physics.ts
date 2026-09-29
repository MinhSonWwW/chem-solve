import type { Grade, GradeCurriculum } from './types';
import { GRADE_6_PHYSICS_CURRICULUM } from '../physics/g6/curriculum';
import { GRADE_7_PHYSICS_CURRICULUM } from '../physics/g7/curriculum';
import { GRADE_8_PHYSICS_CURRICULUM } from '../physics/g8/curriculum';
import { GRADE_9_PHYSICS_CURRICULUM } from '../physics/g9/curriculum';

/**
 * Khung chương trình môn Vật lý (THCS Lớp 6 - 9).
 * Cấu trúc dạng module plug-and-play.
 */
export const PHYSICS_CURRICULUM: Record<Grade, GradeCurriculum> = {
  6: GRADE_6_PHYSICS_CURRICULUM,
  7: GRADE_7_PHYSICS_CURRICULUM,
  8: GRADE_8_PHYSICS_CURRICULUM,
  9: GRADE_9_PHYSICS_CURRICULUM,
};
