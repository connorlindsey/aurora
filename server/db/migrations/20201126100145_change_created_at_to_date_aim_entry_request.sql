-- migrate:up
ALTER TABLE aim_entry_request ADD COLUMN IF NOT EXISTS date DATE 

-- migrate:down

