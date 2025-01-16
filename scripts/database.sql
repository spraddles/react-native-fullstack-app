-- user_meta table
CREATE TABLE user_meta (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    has_onboarded BOOLEAN DEFAULT false,
    name VARCHAR(255),
    surname VARCHAR(255),
    phone VARCHAR(50),
    passport VARCHAR(100),
    PRIMARY KEY (user_id)
)

-- transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    pix_method VARCHAR(10) NOT NULL CHECK (pix_method IN ('cpf', 'email', 'phone', 'key')),
    pix_method_value VARCHAR(255) NOT NULL,
    receiver VARCHAR(255) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'brl',
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    digital_wallet VARCHAR(20) NOT NULL CHECK (digital_wallet IN ('apple', 'google')),
    FOREIGN KEY (sender_id) REFERENCES auth.users(id)
);

-- rpc function: get_user_by_email
CREATE OR REPLACE FUNCTION get_user_by_email(email_param TEXT)
RETURNS TABLE (id uuid, email text, created_at timestamptz) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id, email, created_at 
    FROM auth.users 
    WHERE email = email_param;
$$;

