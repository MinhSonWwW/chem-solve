import type { Grade, GradeCurriculum } from './types';
import { GRADE_6_BIOLOGY_CURRICULUM } from '../biology/g6/curriculum';
import { GRADE_7_BIOLOGY_CURRICULUM } from '../biology/g7/curriculum';
import { GRADE_8_BIOLOGY_CURRICULUM } from '../biology/g8/curriculum';
import { GRADE_9_BIOLOGY_CURRICULUM } from '../biology/g9/curriculum';

/**
 * Khung chương trình môn Sinh học (THCS Lớp 6 - 9).
 * Cấu trúc dạng module plug-and-play.
 */
export const BIOLOGY_CURRICULUM: Record<Grade, GradeCurriculum> = {
  6: GRADE_6_BIOLOGY_CURRICULUM,
  7: GRADE_7_BIOLOGY_CURRICULUM,
  8: GRADE_8_BIOLOGY_CURRICULUM,
  9: GRADE_9_BIOLOGY_CURRICULUM,
};
