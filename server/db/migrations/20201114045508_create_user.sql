-- migrate:up

CREATE TABLE IF NOT EXISTS aim (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP,
  last_completed DATE DEFAULT NULL,
  account_id BIGINT REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS aim_entry (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE, 
  status TEXT NOT NULL DEFAULT 'COMPLETE',
  aim_id BIGINT NOT NULL REFERENCES aim(id)
);

-- migrate:down

