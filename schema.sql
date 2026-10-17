CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  mistake_ids_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(created_at_ms DESC);
CREATE INDEX IF NOT EXISTS idx_results_name ON results(name);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);

INSERT INTO settings (key, value)
VALUES ('cert_threshold', 95)
ON CONFLICT(key) DO NOTHING;
