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

GRANT EXECUTE ON FUNCTION get_user_by_email TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_by_email TO service_role;
