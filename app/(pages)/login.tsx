import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from '@/components/Themed'

import { router } from 'expo-router'

import { useBaseStore } from '@/store/base'

import { SocialButton } from '@/components/ui/socialButton'

import { googleLogin } from '@/composables/googleLogin'
import { hasOnboarded } from '@/composables/authHelpers'
// import { appleLogin } from '@/composables/appleLogin'

export default function LoginPage() {

	const handleLogin = async (method: string) => {
		useBaseStore.getState().setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
		try {
			let authResponse = {}
			if (method === 'google') {
				authResponse = await googleLogin()
			}
			if (authResponse.status === true) {
				const has_been_onboarded = await hasOnboarded(authResponse.email)
				// user needs onboarding
				if (!has_been_onboarded) {
					console.log('handleLogin: user needs onboarding')
					useBaseStore.getState().setLoading(false)
					router.push('/(pages)/newUserEditProfile')
				}
				// user already onboarded
				else {
					console.log('handleLogin: user already onboarded')
					useBaseStore.getState().setLoading(false)
					router.push('/(tabs)')
				}
			} else {
				// auth error
				useBaseStore.getState().setLoading(false)
				useBaseStore.getState().setToast({ visible: true, message: authResponse.message })
			}
		} catch (error) {
			// other error
			useBaseStore.getState().setLoading(false)
			useBaseStore.getState().setToast({ visible: true, message: error })
		} finally {
			// in case spinner isn't already stopped
			useBaseStore.getState().setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Choose a login method:</Text>
			<SocialButton type={'google'} onPress={async () => await handleLogin('google')} />
			{/* <SocialButton type={'apple'} onPress={async () => await appleLogin()} /> */}
			<SocialButton type={'email'} onPress={() => router.push('/(pages)/emailLoginForm')} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	text: {
		fontSize: 16,
		color: '#666',
		marginBottom: 20
	}
})
