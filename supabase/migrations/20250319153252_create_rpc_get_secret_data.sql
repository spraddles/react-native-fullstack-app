create or replace function internal_get_secret_data(name_param text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  val text;
begin
  select decrypted_secret
    into val
  from vault.decrypted_secrets
  where name = name_param
  limit 1;

  if val is null then
    return json_build_object('error', 'Secret not found');
  end if;

  return json_build_object('secret', val);
end;
$$;

grant execute on function internal_get_secret_data(text) to authenticated;
