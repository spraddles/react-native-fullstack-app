-- Create the internal function in the vault schema
create or replace function vault.internal_get_secret_data(name_param text)
returns json
language plpgsql security definer
as $$
declare
  secret_value text;
  key_id_value uuid;
  result_json json;
begin
  -- Use the exact query pattern shown in your screenshot
  select secret, key_id
  into secret_value, key_id_value
  from vault.secrets
  where name = name_param
  limit 1;
  
  -- Check if we found a record
  if secret_value is null then
    return json_build_object('error', 'Secret not found');
  end if;
  
  -- Format the result as requested
  result_json := json_build_object(
    'key_id', key_id_value::text,
    'secret', secret_value
  );
  
  return result_json;
end;
$$;

-- Create the public wrapper function that calls the internal vault function
CREATE OR REPLACE FUNCTION public.get_secret_data(name_param TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN vault.internal_get_secret_data(name_param);
END;
$$;