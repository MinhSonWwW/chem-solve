import { describe, it, expect } from 'vitest';
import { validateContent } from '../../../scripts/validate-content';
import path from 'node:path';

describe('validate-content', () => {
  it('validates genuine content directory successfully', () => {
    const dir = path.resolve(process.cwd(), 'src/content/exercises');
    const report = validateContent(dir);
    expect(report.totalExercises).toBeGreaterThanOrEqual(1);
    expect(report.errors).toHaveLength(0);
  });

  it('reports errors for non-existent directory', () => {
    const report = validateContent('/invalid/path/that/does/not/exist');
    expect(report.errors.length).toBeGreaterThan(0);
  });
});
