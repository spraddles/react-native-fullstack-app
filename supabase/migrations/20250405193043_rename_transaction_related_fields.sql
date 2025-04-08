-- First, drop the default constraint
ALTER TABLE transactions 
ALTER COLUMN card_transaction_external_id DROP DEFAULT;

-- Now rename the columns
ALTER TABLE transactions 
RENAME COLUMN card_transaction_external_id TO card_transaction_id;

ALTER TABLE card_transactions 
RENAME COLUMN card_external_id TO external_id;

-- Change the data type of card_transaction_id from varchar to UUID
ALTER TABLE transactions
ALTER COLUMN card_transaction_id TYPE UUID USING 
  CASE 
    WHEN card_transaction_id IS NULL THEN NULL
    ELSE card_transaction_id::UUID
  END;

-- Set the default back, but now as a UUID NULL
ALTER TABLE transactions
ALTER COLUMN card_transaction_id SET DEFAULT NULL;

-- Add the foreign key constraint
ALTER TABLE public.transactions
ADD CONSTRAINT fk_card_transaction
FOREIGN KEY (card_transaction_id)
REFERENCES public.card_transactions (id);