import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { supabase } from '@/supabase/connect'

import { useBaseStore } from '@/store/base'

import { router } from 'expo-router'

export const googleLogin = async () => {
	GoogleSignin.configure({
		scopes: [],
		iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
	})

	try {
		useBaseStore.getState().setLoading(true)
		await GoogleSignin.hasPlayServices()
		const userInfo = await GoogleSignin.signIn()
		if (userInfo.data.idToken) {
			const response = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: userInfo.data.idToken
			})
			// authenticated
			if (response.data?.user?.aud === 'authenticated') {
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				useBaseStore.getState().setLoading(false)
				router.push('/(tabs)')
			}
			// not authenticated
			else {
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				useBaseStore.getState().setLoading(false)
				useBaseStore.getState().setToast({ visible: true, message: response.error.message })
			}
		} else {
			throw new Error('no ID token present!')
		}
	} catch (error: any) {
		if (error.code === statusCodes.SIGN_IN_CANCELLED) {
			// user cancelled the login flow
			console.log('googleSignIn: SIGN_IN_CANCELLED', error)
		} else if (error.code === statusCodes.IN_PROGRESS) {
			// operation (e.g. sign in) is in progress already
			console.log('googleSignIn: IN_PROGRESS', error)
		} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
			// play services not available or outdated
			console.log('googleSignIn: PLAY_SERVICES_NOT_AVAILABLE', error)
		} else {
			// some other error happened
			console.log('googleSignIn: unknown error', error)
		}
	} finally {
		// in case spinner isn't already stopped
		useBaseStore.getState().setLoading(false)
	}
}
