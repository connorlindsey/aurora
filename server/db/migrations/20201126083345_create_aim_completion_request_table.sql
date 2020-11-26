-- migrate:up
CREATE TABLE IF NOT EXISTS aim_entry_request (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP,
  message json,
  account_id BIGINT REFERENCES account(id)
);




-- migrate:down

