/*
 ** Note: this file is to encrypt data only for frontend to backend
 ** transmission and not for any database storage
 */

import forge from 'node-forge'

const base64ToPem = (base64Key, type) => {
	const pemContent = forge.util.decode64(base64Key)
	if (!pemContent.includes('-----BEGIN')) {
		return `-----BEGIN ${type} KEY-----\n${base64Key}\n-----END ${type} KEY-----`
	}
	return pemContent
}

// decrypt AES-encrypted data
const aesDecrypt = (encryptedData, key) => {
	try {
		const decipher = forge.cipher.createDecipher('AES-CBC', key)
		decipher.start({ iv: key })
		const buffer = forge.util.createBuffer(encryptedData)
		decipher.update(buffer)
		const result = decipher.finish()
		if (!result) {
			throw new Error('Failed to decrypt data')
		}
		return JSON.parse(decipher.output.toString())
	} catch (error) {
		console.error('AES Decryption error:', error)
		throw error
	}
}

// decrypt AES key using RSA
const rsaDecrypt = async (encryptedAESKey, privateKeyPem) => {
	try {
		const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
		const decodedKey = forge.util.decode64(encryptedAESKey)
		return privateKey.decrypt(decodedKey, 'RSA-OAEP', {
			md: forge.md.sha256.create(),
			mgf1: { md: forge.md.sha1.create() }
		})
	} catch (error) {
		console.error('RSA Decryption error:', error)
		throw error
	}
}

export const decryptData = async (encryptedKey, encryptedData) => {
	try {
		const privateKeyPem = base64ToPem(process.env.PRIVATE_KEY_BASE64, 'PRIVATE')
		const aesKey = await rsaDecrypt(encryptedKey, privateKeyPem)
		const encryptedBytes = forge.util.decode64(encryptedData)
		return aesDecrypt(encryptedBytes, aesKey)
	} catch (error) {
		console.error('Decryption error:', error)
		return false
	}
}
