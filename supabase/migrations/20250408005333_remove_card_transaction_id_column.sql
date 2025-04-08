-- Drop the column directly since there's no foreign key constraint
ALTER TABLE transactions
DROP COLUMN card_transaction_id;