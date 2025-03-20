import express from 'express'
import { supabase } from './../../utils/supabase.js'
import { getSecretData, decryptData } from './../../utils/secrets.js'

export default function () {
	const router = express.Router()

	router.get('/get', async (req, res, next) => {
		try {
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			const userProfile = await supabase
				.from('user_meta')
				.select()
				.eq('user_id', supabaseUserID)
				.single()

			const object = {
				...userProfile?.data,
				email: supabaseUser?.data?.user?.email
			}

			// decrypt
			const secretData = await getSecretData(process.env.SUPABASE_SECRET_NAME)
			const decryptedPassport = decryptData(object.passport, secretData.secret)
			const decryptedCpf = decryptData(object.cpf, secretData.secret)
			object.passport = decryptedPassport
			object.cpf = decryptedCpf

			return res.status(200).json({
				status: true,
				data: object
			})
		} catch (error) {
			console.log('Fetch user profile error:', error)
			return res.status(500).json({
				status: false,
				message: 'Could not fetch user profile'
			})
		}
	})

	return router
}
