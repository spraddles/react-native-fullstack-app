import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from '@/components/Themed'

import { router, useLocalSearchParams } from 'expo-router'

import { useBaseStore } from '@/store/base'

import { SocialButton } from '@/components/ui/socialButton'

import { googleLogin } from '@/composables/googleLogin'
import { hasOnboarded } from '@/composables/authHelpers'
// import { appleLogin } from '@/composables/appleLogin'

export default function LoginPage() {
	const { loginType } = useLocalSearchParams()

	const handleSocialAccess = async (method: string) => {
		useBaseStore.getState().setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
		try {
			let authResponse = {}
			if (method === 'google') {
				authResponse = await googleLogin()
			}
			if (authResponse.status === true) {
				// set state
				useBaseStore.getState().setUserField('id', authResponse.id)
				useBaseStore.getState().setUserField('email', authResponse.email)
				const has_been_onboarded = await hasOnboarded(authResponse.email)
				// user needs onboarding
				if (!has_been_onboarded) {
					useBaseStore.getState().setLoading(false)
					router.push({
						pathname: '/(pages)/completeProfile',
						params: {
							method: 'social' // for all social auth methods
						}
					})
				}
				// user already onboarded
				else {
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
			console.log('handleSocialAccess: user cancelled social login/signin', error)
			useBaseStore.getState().setLoading(false)
		} finally {
			// in case spinner isn't already stopped
			useBaseStore.getState().setLoading(false)
		}
	}

	const handleEmailAccess = () => {
		if (loginType === 'login') {
			router.push('/(pages)/emailLoginForm')
		}
		if (loginType === 'signup') {
			router.push('/(pages)/emailSignUpForm')
		}
	}

	return (
		<View style={styles.container}>
			{loginType === 'login' && <Text style={styles.text}>Choose a login method:</Text>}
			{loginType === 'signup' && <Text style={styles.text}>Choose a sign up method:</Text>}
			<SocialButton
				type={'google'}
				onPress={async () => await handleSocialAccess('google')}
			/>
			{/* <SocialButton type={'apple'} onPress={async () => await appleLogin()} /> */}
			<SocialButton type={'email'} onPress={() => handleEmailAccess()} />
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
