-- remove column
ALTER TABLE card_transactions
DROP COLUMN transaction_id;

-- add column
ALTER TABLE transactions
ADD COLUMN card_transaction_id UUID REFERENCES card_transactions(id) ON DELETE CASCADE;