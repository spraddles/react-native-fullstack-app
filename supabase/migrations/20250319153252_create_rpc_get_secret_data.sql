create or replace function public.internal_get_secret_data(name_param text)
returns json
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  secret text;
begin
  -- use the official helper instead of touching vault.secrets directly
  secret := supabase_vault.get_secret(name_param);  -- returns text

  if secret is null then
    return json_build_object('error', 'Secret not found');
  end if;

  return json_build_object('secret', secret);
end;
$$;

grant execute on function public.internal_get_secret_data(text) to authenticated, anon;
