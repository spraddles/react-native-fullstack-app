import { supabaseAdmin as supabase } from '~_shared/supabaseAdmin.ts'
import { encodeBase64 as b64enc, decodeBase64 as b64dec } from 'std/encoding/base64.ts'

/*
 ** Supabase pre-defined secrets:
 ** https://supabase.com/docs/guides/functions/secrets
 */

export async function getSecretPassword(secretName: string) {
	const { data, error } = await supabase.rpc('internal_get_secret_data', {
		name_param: secretName
	})
	if (error) {
		throw new Error(error.message)
	}
	return data as { secret: string }
}

async function importKey(b64: string) {
	const raw = b64dec(b64)
	return crypto.subtle.importKey('raw', raw, 'AES-CBC', false, ['encrypt', 'decrypt'])
}

export async function encryptData(plain: string, b64Key: string) {
	if (!plain) {
		return null
	}
	const key = await importKey(b64Key)
	const iv = crypto.getRandomValues(new Uint8Array(16))
	const cipher = await crypto.subtle.encrypt(
		{ name: 'AES-CBC', iv },
		key,
		new TextEncoder().encode(plain)
	)
	return b64enc(new Uint8Array([...iv, ...new Uint8Array(cipher)]))
}

export async function decryptData(b64Cipher: string, b64Key: string) {
	if (!b64Cipher) {
		return null
	}
	const bytes = b64dec(b64Cipher)
	const iv = bytes.slice(0, 16)
	const data = bytes.slice(16)
	const key = await importKey(b64Key)
	const plainBuf = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, data)
	return new TextDecoder().decode(plainBuf)
}
