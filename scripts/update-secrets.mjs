import fs from 'fs'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import _sodium from 'libsodium-wrappers'

async function encryptSecret(secret, key) {
	await _sodium.ready
	const sodium = _sodium

	const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL)
	const binsec = sodium.from_string(secret)

	const encBytes = sodium.crypto_box_seal(binsec, binkey)
	return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
}

async function run() {
	const env = process.argv[2]
	if (!['production', 'development'].includes(env)) {
		console.error('Usage: node update-secrets.js [production|development]')
		process.exit(1)
	}

	const envFile = `./.env.${env}`
	console.log(`Using ${env} environment file: ${envFile}`)

	const envConfig = dotenv.parse(fs.readFileSync(envFile))
	const { GITHUB_PAT, GITHUB_OWNER, GITHUB_REPO } = envConfig

	if (!GITHUB_PAT || !GITHUB_OWNER || !GITHUB_REPO) {
		console.error('Missing required GitHub configuration')
		process.exit(1)
	}

	const secrets = [
		'GCP_PROJECT_ID',
		'GCP_REGION',
		'GCP_PROJECT_NUMBER',
		'GCP_SERVICE_ACCOUNT',
		'GCP_WORKLOAD_IDENTITY_PROVIDER',
		'GCP_WORKLOAD_IDENTITY_POOL_PROVIDER',
		'GCP_WORKLOAD_IDENTITY_POOL',
		'GCP_ARTIFACT_REPO_NAME'
	]

	// Get public key
	const keyResponse = await fetch(
		`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/secrets/public-key`,
		{
			headers: {
				Authorization: `token ${GITHUB_PAT}`,
				Accept: 'application/vnd.github.v3+json'
			}
		}
	)
	const { key, key_id } = await keyResponse.json()

	// Create/update secrets
	for (const secretName of secrets) {
		const secretValue = envConfig[secretName]
		if (!secretValue) {
			continue
		}

		try {
			const encrypted = await encryptSecret(secretValue, key)

			const response = await fetch(
				`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/secrets/${secretName}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `token ${GITHUB_PAT}`,
						Accept: 'application/vnd.github.v3+json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						encrypted_value: encrypted,
						key_id: key_id
					})
				}
			)

			if (response.ok) {
				console.log(`Successfully updated secret: ${secretName}`)
			} else {
				console.error(`Failed to update secret ${secretName}:`, await response.text())
			}
		} catch (error) {
			console.error(`Error processing secret ${secretName}:`, error)
		}
	}

	// Get existing secrets
	const existingResponse = await fetch(
		`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/secrets`,
		{
			headers: {
				Authorization: `token ${GITHUB_PAT}`,
				Accept: 'application/vnd.github.v3+json'
			}
		}
	)
	const existingSecrets = await existingResponse.json()

	// Delete secrets not in array
	for (const secret of existingSecrets.secrets) {
		if (!secrets.includes(secret.name)) {
			const deleteResponse = await fetch(
				`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/secrets/${secret.name}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `token ${GITHUB_PAT}`
					}
				}
			)
			if (deleteResponse.ok) {
				console.log(`Deleted secret: ${secret.name}`)
			}
		}
	}
}

run().catch(console.error)
