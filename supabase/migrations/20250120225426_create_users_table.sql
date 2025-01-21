CREATE TABLE public.user_meta (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    has_onboarded BOOLEAN DEFAULT false,
    name VARCHAR(255),
    surname VARCHAR(255),
    phone VARCHAR(50) CHECK (phone ~ '^[0-9]+$'),
    passport VARCHAR(50) CHECK (passport ~ '^[A-Z0-9]+$'),
    PRIMARY KEY (user_id)
);