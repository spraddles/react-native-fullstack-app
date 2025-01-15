import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { supabase } from '@/supabase/connect'

export const googleLogin = async () => {
	GoogleSignin.configure({
		scopes: [],
		iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
	})

	/*  Note: all social auth methods should return an object
	 **  like this { status: true/ false, message: 'Example auth message' }
	 **  so that social auth can be reused in all login or signup
	 **  screens
	 */

	try {
		await GoogleSignin.hasPlayServices()
		const userInfo = await GoogleSignin.signIn()
		if (userInfo?.data?.idToken) {
			const response = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: userInfo?.data?.idToken
			})
			// authenticated
			if (response.data?.user?.aud === 'authenticated') {
				return {
					status: true,
					email: response?.data?.user?.email,
					id: response?.data?.user?.id
				}
			}
			// not authenticated
			else {
				return { status: false, message: response.message }
			}
		}
	} catch (error: any) {
		if (error.code === statusCodes.SIGN_IN_CANCELLED) {
			// user cancelled the login flow
			console.log('googleSignIn: SIGN_IN_CANCELLED', error)
			return { status: false, message: error }
		} else if (error.code === statusCodes.IN_PROGRESS) {
			// operation (e.g. sign in) is in progress already
			console.log('googleSignIn: IN_PROGRESS', error)
			return { status: false, message: error }
		} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
			// play services not available or outdated
			console.log('googleSignIn: PLAY_SERVICES_NOT_AVAILABLE', error)
			return { status: false, message: error }
		} else {
			// some other error happened
			console.log('googleSignIn: unknown error', error)
			return { status: false, message: error }
		}
	}
}
