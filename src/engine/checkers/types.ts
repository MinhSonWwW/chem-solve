import type { CommonMistake } from '../../content/schema/exercise';

export type PartialReason =
  | 'not-simplest'
  | 'noncanonical-formula'
  | 'missing-unit'
  | 'wrong-case'
  | 'other';

export type Verdict =
  | { status: 'correct' }
  | { status: 'partial'; reason: PartialReason; message: string }
  | { status: 'incorrect'; reason: string; mistakeId?: string; diagnosis?: string };

export interface Checker<A, I> {
  check(answer: A, input: I, commonMistakes?: CommonMistake[]): Verdict;
}
