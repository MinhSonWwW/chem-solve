import { z } from 'zod';

export const TheoryCardSchema = z.object({
  id: z.string(),
  badge: z.string(), // e.g. "Quy tắc vàng", "Hiện tượng thí nghiệm", "Bẫy thường gặp"
  badgeColor: z.enum(['purple', 'amber', 'emerald', 'cyan']).default('purple'),
  title: z.string(),
  content: z.string(),
  bulletPoints: z.array(z.string()).optional(),
  callout: z.string().optional(),
  formulaExample: z.string().optional(),
});

export const QuickCheckOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  correct: z.boolean(),
});

export const QuickCheckSchema = z.object({
  prompt: z.string(),
  options: z.array(QuickCheckOptionSchema).min(2),
  explanation: z.string(),
});

export const TheoryContentSchema = z.object({
  lessonId: z.string(),
  nodeId: z.string(),
  title: z.string(),
  subtitle: z.string(),
  estimatedMinutes: z.number().default(2),
  cards: z.array(TheoryCardSchema).min(1),
  quickCheck: QuickCheckSchema.optional(),
});

export type TheoryCard = z.infer<typeof TheoryCardSchema>;
export type QuickCheckOption = z.infer<typeof QuickCheckOptionSchema>;
export type QuickCheck = z.infer<typeof QuickCheckSchema>;
export type TheoryContent = z.infer<typeof TheoryContentSchema>;
