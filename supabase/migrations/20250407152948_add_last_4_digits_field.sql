ALTER TABLE cards
ADD COLUMN last_4_digits CHAR(4) DEFAULT NULL
CHECK (last_4_digits ~ '^[0-9]{4}$');