import { supabase } from './supabase.js'

export const validateToken = async (req, res, next) => {
	try {
		const accessToken = req.headers.authorization?.split(' ')[1]
		// check token
		if (accessToken) {
			const {
				data: { user },
				error
			} = await supabase.auth.getUser(accessToken)
			// invalid token
			if (error || !user) {
				console.log('token invalid')
				res.status(401).json({ error: 'Invalid or expired token' })
				return false
			}
			// valid token
			if (!error || user) {
				console.log('token valid')
				res.status(200)
				return true
			}
		}
		// no token
		else {
			console.log('no token found')
			return res.status(401).json({ error: 'No token found' })
		}
		next()
	} catch (error) {
		res.status(401).json({ error: 'Token validation error' })
		console.log('Token validation error: ', error)
	}
}
