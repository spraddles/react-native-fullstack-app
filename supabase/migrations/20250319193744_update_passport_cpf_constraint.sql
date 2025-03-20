-- Drop existing constraints
ALTER TABLE user_meta DROP CONSTRAINT IF EXISTS user_meta_passport_check;
ALTER TABLE user_meta DROP CONSTRAINT IF EXISTS user_meta_cpf_check;

-- Modify columns to VARCHAR(255) with no other constraints
ALTER TABLE user_meta ALTER COLUMN passport TYPE VARCHAR(255);
ALTER TABLE user_meta ALTER COLUMN cpf TYPE VARCHAR(255);