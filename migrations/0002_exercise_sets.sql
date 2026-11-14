-- Teacher-authored question sets. Assignments point at a set with lesson_id = 'set-' || id.
CREATE TABLE IF NOT EXISTS exercise_sets (
  id          TEXT PRIMARY KEY,           -- 10 chars [a-z0-9]
  teacher_id  TEXT NOT NULL REFERENCES teachers(id),
  title       TEXT NOT NULL,
  subject     TEXT NOT NULL CHECK (subject IN ('chem', 'physics', 'bio')),
  grade       INTEGER NOT NULL CHECK (grade BETWEEN 6 AND 9),
  questions   TEXT NOT NULL,              -- JSON array validated by ExerciseSetInputSchema
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_teacher ON exercise_sets(teacher_id, updated_at);
