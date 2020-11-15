-- migrate:up
ALTER TABLE aim ADD COLUMN IF NOT EXISTS description TEXT
-- migrate:down

