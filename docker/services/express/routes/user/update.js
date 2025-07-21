import express from 'express'
import { supabase } from './../../utils/supabase.js'
import { getSecretData, encryptData } from './../../utils/secrets.js'

export default function () {
	const router = express.Router()

	router.post('/update', async (req, res) => {
		try {
			const userID = req.body.id
			const data = req.body.data

			// encrypt
			const secretData = await getSecretData(process.env.SUPABASE_SECRET_NAME)
			const encryptedCpf = !data.cpf ? null : encryptData(data.cpf, secretData.secret) // cpf is optional
			const encryptedPassport = encryptData(data.passport, secretData.secret)

			const cleanData = {
				country: data.country,
				cpf: encryptedCpf, // encrypted
				cpf_key_id: !data.cpf ? null : secretData.key_id, // key ID field for decryption
				dob_day: data.dob_day,
				dob_month: data.dob_month,
				dob_year: data.dob_year,
				has_onboarded: data.has_onboarded,
				name: data.name,
				passport: encryptedPassport, // encrypted
				passport_key_id: secretData.key_id, // key ID field for decryption
				phone: data.phone,
				surname: data.surname,
				user_id: data.user_id
			}

			const checkUser = await supabase
				.from('user_meta')
				.select()
				.eq('user_id', userID)
				.single()

			// no user data exists: create entry
			if (checkUser.data === null) {
				const insertCommand = await supabase
					.from('user_meta')
					.insert(cleanData)
					.eq('user_id', userID)
					.select()
					.single()

				// error
				if (insertCommand.data === null && insertCommand.error?.code) {
					console.log('insertCommand error: ', insertCommand.error)
					return res
						.status(400)
						.json({ status: false, error: 'There is an error creating your profile' })
				}
				// success
				if (insertCommand.error === null) {
					return res.status(201).json({ status: true })
				}
			}

			// data exists: update it
			if (checkUser.data !== null) {
				const updateCommand = await supabase
					.from('user_meta')
					.update(cleanData)
					.eq('user_id', userID)
					.select()
					.single()

				// error
				if (updateCommand.data === null && updateCommand.error?.code) {
					console.log('updateCommand error:', updateCommand.error)
					return res
						.status(400)
						.json({ status: false, error: 'There is an error updating your profile' })
				}
				// success
				if (updateCommand.error === null) {
					return res.status(200).json({ status: true })
				}
			} else {
				return res.status(404).json({ status: false, error: 'User not found' })
			}
		} catch (error) {
			console.error('Error updating the user:', error)
			return res.status(500).json({ status: false, error: error.message })
		}
	})

	return router
}
