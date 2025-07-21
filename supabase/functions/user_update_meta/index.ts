import { supabaseClient as supabase } from '~_shared/supabaseClient.ts'
import { serve } from 'https://deno.land/std@0.201.0/http/server.ts'
import { getSecretPassword, encryptData } from '~_shared/secrets.ts'
import { corsHeaders } from '~_shared/cors.ts'

serve(async (req: Request) => {
	// ---- 1. Handle CORS / pre-flight ---------------------------------------
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}
	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ status: false, error: 'Method Not Allowed' }), {
			status: 405,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		})
	}

	// ---- 2. Parse body & basic validation ----------------------------------
	let body: { id?: string; data?: Record<string, unknown> }
	try {
		body = await req.json()
	} catch {
		return new Response(JSON.stringify({ status: false, error: 'Invalid JSON body' }), {
			status: 400,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		})
	}

	const userID = body.id
	const data = body.data
	if (!userID || !data) {
		return new Response(
			JSON.stringify({ status: false, error: '`id` and `data` are required' }),
			{ status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
		)
	}

	// ---- 3. Encrypt sensitive fields ---------------------------------------
	const secretName = Deno.env.get('SECRET_NAME')!
	const secretPassword = await getSecretPassword(secretName)

	const encryptedCpf = data.cpf ? encryptData(data.cpf as string, secretPassword.secret) : null
	const encryptedPassport = data.passport ? encryptData(data.passport as string, secretPassword.secret) : null

	const cpfKeyID = data.cpf ? secretName : null
	const passportKeyID = data.passport ? secretName : null

	const cleanData = {
		country: data.country,
		cpf: encryptedCpf,
		cpf_key_id: cpfKeyID,
		dob_day: data.dob_day,
		dob_month: data.dob_month,
		dob_year: data.dob_year,
		has_onboarded: data.has_onboarded,
		name: data.name,
		passport: encryptedPassport,
		passport_key_id: passportKeyID,
		phone: data.phone,
		surname: data.surname,
		user_id: userID
	}

	console.log('cleanData: ', cleanData)

	// ---- 4. Upsert logic ----------------------------------------------------
	const { data: existing, error: fetchErr } = await supabase
		.from('user_meta')
		.select('user_id')
		.eq('user_id', userID)
		.maybeSingle()

	if (fetchErr) {
		return new Response(JSON.stringify({ status: false, error: fetchErr.message }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		})
	}

	const result = existing
		? await supabase // UPDATE path
				.from('user_meta')
				.update(cleanData)
				.eq('user_id', userID)
				.single()
		: await supabase // INSERT path
				.from('user_meta')
				.insert(cleanData)
				.single()

	if (result.error) {
		console.error('[Edge] Supabase DB error:', result.error)
		return new Response(JSON.stringify({ status: false, error: result.error.message }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' }
		})
	}

	return new Response(JSON.stringify({ status: true }), {
		status: existing ? 200 : 201,
		headers: { ...corsHeaders, 'Content-Type': 'application/json' }
	})
})
