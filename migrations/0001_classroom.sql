-- Classroom / teacher mode (M15). SQLite on Cloudflare D1.
-- Privacy: students are identified only by a display name chosen by the student and a random
-- secret token (stored hashed). No student email or account data is collected.

CREATE TABLE IF NOT EXISTS teachers (
  id          TEXT PRIMARY KEY,          -- Google "sub"
  email       TEXT NOT NULL,
  name        TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS teacher_sessions (
  token_hash  TEXT PRIMARY KEY,          -- sha256(session token)
  teacher_id  TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  expires_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS classes (
  id          TEXT PRIMARY KEY,
  teacher_id  TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  grade       INTEGER NOT NULL CHECK (grade BETWEEN 6 AND 9),
  code        TEXT NOT NULL UNIQUE,      -- 6-char join code shown to students
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);

CREATE TABLE IF NOT EXISTS students (
  id            TEXT PRIMARY KEY,
  class_id      TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  token_hash    TEXT NOT NULL UNIQUE,    -- sha256(student secret token)
  created_at    INTEGER NOT NULL,
  last_seen_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);

CREATE TABLE IF NOT EXISTS assignments (
  id          TEXT PRIMARY KEY,
  class_id    TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  lesson_id   TEXT NOT NULL,
  due_at      INTEGER,                   -- ms timestamp, NULL = no deadline
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);

-- One row per finished node (lesson step) reported by a student.
CREATE TABLE IF NOT EXISTS node_results (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id     TEXT NOT NULL UNIQUE,    -- client-generated, makes retries idempotent
  student_id    TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id      TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  lesson_id     TEXT NOT NULL,
  node_id       TEXT NOT NULL,
  is_practice   INTEGER NOT NULL DEFAULT 0,
  accuracy      REAL NOT NULL,
  xp            INTEGER NOT NULL DEFAULT 0,
  completed_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_node_results_class ON node_results(class_id);

-- One row per question answered in a reported node.
CREATE TABLE IF NOT EXISTS question_results (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id          TEXT NOT NULL,
  student_id         TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id           TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  lesson_id          TEXT NOT NULL,
  exercise_id        TEXT NOT NULL,
  skill_ids          TEXT NOT NULL DEFAULT '[]',   -- JSON array
  correct_first_try  INTEGER NOT NULL,
  attempts           INTEGER NOT NULL,
  created_at         INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_question_results_class ON question_results(class_id);
