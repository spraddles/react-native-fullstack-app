import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(
	Deno.env.get('SUPABASE_URL')!,
	Deno.env.get('SUPABASE_ANON_KEY')!
)
