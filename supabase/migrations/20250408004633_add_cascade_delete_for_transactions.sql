-- Add transaction_id column to card_transactions with foreign key and CASCADE
ALTER TABLE card_transactions 
ADD COLUMN transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE;

-- Update existing data to establish the relationship
UPDATE card_transactions ct
SET transaction_id = t.id
FROM transactions t
WHERE ct.id = t.card_transaction_id;