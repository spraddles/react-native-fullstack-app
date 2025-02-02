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
				return res.status(401).json({
					status: false,
					error: 'Invalid or expired token'
				})
			}
			// valid token
			if (!error || user) {
				req.token = accessToken
				// don't return a server status here
				next()
			}
		}
		// no token
		else {
			console.log('no token found')
			return res.status(401).json({ error: 'No token found' })
		}
	} catch (error) {
		res.status(401).json({ error: 'Token validation error' })
		console.log('Token validation error: ', error)
	}
}
