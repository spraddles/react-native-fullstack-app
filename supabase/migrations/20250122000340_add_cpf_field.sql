ALTER TABLE user_meta 
ADD COLUMN cpf VARCHAR(11) CHECK (cpf ~ '^[0-9]+$');