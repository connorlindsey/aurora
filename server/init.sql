-- TODO: Figue out how to run these on deploy in heroku

CREATE TABLE IF NOT EXISTS earlyaccess (
  ID SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT
);

CREATE TABLE IF NOT EXISTS account (
  ID SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password TEXT,
  created_at TIMESTAMP,
  role TEXT
);

CREATE TABLE IF NOT EXISTS session (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES account (ID),
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL
);