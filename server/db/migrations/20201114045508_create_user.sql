-- migrate:up

CREATE TABLE IF NOT EXISTS aim (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP,
  account_id BIGINT REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS aim_entry (
  id SERIAL PRIMARY KEY,
  date DATE, 
  status BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP,
  aim_id BIGINT REFERENCES aim(id)
);

-- migrate:down

