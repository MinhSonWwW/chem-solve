import { z } from 'zod';

export const DifficultySchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export const OptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  note: z.string().optional()
});

export const McqSingleAnswerSchema = z.object({
  kind: z.literal('mcq-single'),
  options: z.array(OptionSchema).min(2),
  correctId: z.string()
});

export const McqMultiAnswerSchema = z.object({
  kind: z.literal('mcq-multi'),
  options: z.array(OptionSchema).min(2),
  correctIds: z.array(z.string()).min(1)
});

export const TrueFalseStatementSchema = z.object({
  id: z.string(),
  text: z.string(),
  correct: z.boolean()
});

export const TrueFalseAnswerSchema = z.object({
  kind: z.literal('true-false'),
  statements: z.array(TrueFalseStatementSchema).min(1)
});

export const NumberAnswerSchema = z.object({
  kind: z.literal('number'),
  value: z.number(),
  unit: z.string().optional(),
  decimals: z.number().int().nonnegative().optional(),
  tolerance: z.object({
    abs: z.number().optional(),
    rel: z.number().optional()
  }).optional(),
  strictUnit: z.boolean().optional()
});

export const FormulaAnswerSchema = z.object({
  kind: z.literal('formula'),
  accepted: z.array(z.string()).min(1)
});

export const TextAnswerSchema = z.object({
  kind: z.literal('text'),
  accepted: z.array(z.string()).min(1),
  lenientDiacritics: z.boolean().optional()
});

export const EquationAnswerSchema = z.object({
  kind: z.literal('equation'),
  mode: z.enum(['fill-coefficients', 'build']),
  reactants: z.array(z.string()).min(1),
  products: z.array(z.string()).min(1),
  coefficients: z.array(z.number().int().positive()),
  condition: z.string().optional()
});

export const MatchAnswerSchema = z.object({
  kind: z.literal('match'),
  pairs: z.array(z.object({
    left: z.string(),
    right: z.string()
  })).min(2)
});

export const SortAnswerSchema = z.object({
  kind: z.literal('sort'),
  buckets: z.array(z.object({
    id: z.string(),
    label: z.string()
  })).min(2),
  items: z.array(z.object({
    id: z.string(),
    label: z.string(),
    bucketId: z.string()
  })).min(2)
});

export const OrderingAnswerSchema = z.object({
  kind: z.literal('ordering'),
  correctOrder: z.array(z.string()).min(2)
});

export const FormulaBuilderAnswerSchema = z.object({
  kind: z.literal('formula-builder'),
  tiles: z.array(z.string()).min(2),
  accepted: z.array(z.string()).min(1)
});

export const AnswerSchema = z.discriminatedUnion('kind', [
  McqSingleAnswerSchema,
  McqMultiAnswerSchema,
  TrueFalseAnswerSchema,
  NumberAnswerSchema,
  FormulaAnswerSchema,
  TextAnswerSchema,
  EquationAnswerSchema,
  MatchAnswerSchema,
  SortAnswerSchema,
  OrderingAnswerSchema,
  FormulaBuilderAnswerSchema
]);

export const SolutionStepKindSchema = z.enum([
  'identify',
  'given',
  'knowledge',
  'equation',
  'compute',
  'answer',
  'pitfalls'
]);

export const SolutionStepSchema = z.object({
  kind: SolutionStepKindSchema,
  title: z.string(),
  body: z.string(),
  interactive: z.object({
    prompt: z.string(),
    options: z.array(z.string()).min(2),
    correct: z.array(z.number().int().nonnegative())
  }).optional()
});

export const CommonMistakeSchema = z.object({
  id: z.string(),
  message: z.string(),
  trapAnswers: z.array(z.string()).optional()
});

export const HintSchema = z.object({
  level: z.union([z.literal(1), z.literal(2)]),
  text: z.string()
});

export const GivenItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  unit: z.string().optional()
});

export const FindItemSchema = z.object({
  label: z.string(),
  unit: z.string().optional()
});

export const ExerciseSchema = z.object({
  id: z.string().regex(/^g[7-9]-b\d{2}-[a-z0-9-]+$/),
  lessonId: z.string().regex(/^g[7-9]-b\d{2}$/),
  skillIds: z.array(z.string()).min(1),
  difficulty: DifficultySchema,
  prompt: z.string().min(3),
  given: z.array(GivenItemSchema).optional(),
  find: FindItemSchema.optional(),
  knowledge: z.array(z.string()).default([]),
  answer: AnswerSchema,
  hints: z.array(HintSchema).min(2),
  steps: z.array(SolutionStepSchema).min(3),
  finalSolution: z.string().min(1),
  commonMistakes: z.array(CommonMistakeSchema).default([]),
  related: z.array(z.string()).optional(),
  minigameTags: z.array(z.string()).optional(),
  visual: z.object({ sprite: z.string() }).optional(),
  verify: z.object({
    fn: z.string(),
    args: z.record(z.union([z.string(), z.number()]))
  }).optional()
});

// Infer TypeScript types from Zod schemas
export type Difficulty = z.infer<typeof DifficultySchema>;
export type Option = z.infer<typeof OptionSchema>;
export type Answer = z.infer<typeof AnswerSchema>;
export type SolutionStep = z.infer<typeof SolutionStepSchema>;
export type CommonMistake = z.infer<typeof CommonMistakeSchema>;
export type Hint = z.infer<typeof HintSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
