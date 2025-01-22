ALTER TABLE user_meta 
ADD COLUMN cpf VARCHAR(11) NULL CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$');