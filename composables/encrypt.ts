import forge from 'node-forge'
import { useBaseStore } from '@/store/base'

const base64ToPem = (base64Key, type) => {
	const pemContent = forge.util.decode64(base64Key)
	if (!pemContent.includes('-----BEGIN')) {
		return `-----BEGIN ${type} KEY-----\n${base64Key}\n-----END ${type} KEY-----`
	}
	return pemContent
}

// encrypt data using AES-256
const aesEncrypt = (data, key) => {
	const cipher = forge.cipher.createCipher('AES-CBC', key)
	cipher.start({ iv: key }) // IV is same as key for simplicity
	cipher.update(forge.util.createBuffer(JSON.stringify(data)))
	cipher.finish()
	return cipher.output.getBytes()
}

// encrypt AES key using RSA
const rsaEncrypt = async (aesKey, publicKeyPem) => {
	const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
	return publicKey.encrypt(aesKey, 'RSA-OAEP', {
		md: forge.md.sha256.create(),
		mgf1: { md: forge.md.sha1.create() }
	})
}

export const encryptData = async (data) => {
	try {
		const publicKeyBase64 = await useBaseStore.getState().fetchPublicKey()
		const publicKeyPem = base64ToPem(publicKeyBase64, 'PUBLIC')
		const aesKey = forge.random.getBytesSync(32)
		const encryptedData = aesEncrypt(data, aesKey)
		const encryptedAESKey = await rsaEncrypt(aesKey, publicKeyPem)
		return {
			encryptedKey: forge.util.encode64(encryptedAESKey),
			encryptedData: forge.util.encode64(encryptedData)
		}
	} catch (error) {
		console.error('Encryption error:', error)
		return false
	}
}
