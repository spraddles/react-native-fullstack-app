/*
 ** Note: this file is to encrypt data for storage within the database, and
 ** also for retrieval and decryption from the database
 */

import { supabase } from './supabase.js'
import forge from 'node-forge'

export const getSecretData = async () => {
	try {
		const secretName = process.env.SUPABASE_SECRET_NAME
		const { data, error } = await supabase.rpc('get_secret_data', {
			name_param: secretName
		})
		if (error) {
			throw new Error(error.message || 'Failed to retrieve secret')
		}
		return data
	} catch (error) {
		console.error('Error retrieving secret:', error)
	}
}

export const encryptData = (data, secretKey) => {
	if (!data) {
		console.log('encryptData error: No data provided')
		return null
	}
	try {
		const keyBytes = forge.util.decode64(secretKey)
		const md = forge.md.sha256.create()
		md.update(keyBytes)
		const derivedKey = md.digest().getBytes()
		// generate a random IV
		const iv = forge.random.getBytesSync(16)
		// create cipher
		const cipher = forge.cipher.createCipher('AES-CBC', derivedKey)
		cipher.start({ iv: iv })
		cipher.update(forge.util.createBuffer(data, 'utf8'))
		cipher.finish()
		// get encrypted output
		const encrypted = cipher.output.getBytes()
		// combine IV and encrypted data
		const combined = iv + encrypted
		// return as base64
		return forge.util.encode64(combined)
	} catch (error) {
		console.log('encryptData error: ', error)
		return null
	}
}

export const decryptData = (data, secretKey) => {
	if (!data) {
		console.log('decryptData error: No data provided')
		return null
	}
	try {
		// derive a proper length key from the Base64 secret
		const keyBytes = forge.util.decode64(secretKey)
		const md = forge.md.sha256.create()
		md.update(keyBytes)
		const derivedKey = md.digest().getBytes()
		// decode the encrypted data from Base64
		const encryptedBytes = forge.util.decode64(data)
		// extract IV (first 16 bytes)
		const iv = encryptedBytes.substring(0, 16)
		// extract the actual encrypted data (everything after the IV)
		const encryptedData = encryptedBytes.substring(16)
		// create decipher
		const decipher = forge.cipher.createDecipher('AES-CBC', derivedKey)
		decipher.start({ iv: iv })
		decipher.update(forge.util.createBuffer(encryptedData))
		// finish decryption
		const result = decipher.finish()
		if (result) {
			return decipher.output.toString('utf8')
		} else {
			throw new Error('Failed to decrypt data')
		}
	} catch (error) {
		console.log('decryptData error: ', error)
		return null
	}
}
