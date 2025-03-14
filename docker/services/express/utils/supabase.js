import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
	process.env.EXPO_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false // disable session persistence for server
		}
	}
)
