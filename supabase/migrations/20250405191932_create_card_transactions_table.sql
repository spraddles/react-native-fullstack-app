CREATE TABLE public.card_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_external_id VARCHAR(255) DEFAULT NULL,
    fee DECIMAL(15,2) DEFAULT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'fail')),
    message VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);