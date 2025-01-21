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