-- migrate:up
ALTER TABLE account ADD COLUMN IF NOT EXISTS phone TEXT

-- migrate:down

