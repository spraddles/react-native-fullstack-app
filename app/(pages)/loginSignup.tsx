/* eslint-disable prettier/prettier */
import React, { useLayoutEffect } from 'react'
import { StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { View, Text } from '@/components/Themed'
import { router, useLocalSearchParams } from 'expo-router'

import Ionicons from '@expo/vector-icons/Ionicons'

import { useBaseStore } from '@/store/base'

import { SocialButton } from '@/components/ui/socialButton'
import { ExternalLink } from '@/components/ExternalLink'

import { googleLogin } from '@/composables/googleLogin'
import { hasOnboarded } from '@/composables/userMethods'

export default function LoginPage() {
	const { loginType } = useLocalSearchParams()

    const navigation = useNavigation()

	useLayoutEffect(() => {
		navigation.setOptions({
			title: loginType === 'login' ? 'Login' : 'Sign up'
		})
	}, [navigation, loginType])

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
			<View style={styles.contentContainer}>
				{loginType === 'login' && <Text style={styles.text}>Choose a login method:</Text>}
				{loginType === 'signup' && (
					<Text style={styles.text}>Choose a sign up method:</Text>
				)}
				<SocialButton
					type={'google'}
					onPress={async () => await handleSocialAccess('google')}
				/>
				<SocialButton type={'email'} onPress={() => handleEmailAccess()} />
			</View>

			{loginType === 'signup' && (
				<View style={styles.legalContainer}>
					<View style={styles.legalRow}>
						<Ionicons
							name="information-circle-outline"
							size={25}
							color={'#666'}
							style={styles.icon}
						/>
						<Text style={styles.legal}>
							Note: by signing up you are agreeing to our 				<ExternalLink href={process.env.EXPO_PUBLIC_WEBSITE_URL + '/terms-of-service'}>
								<Text>Terms of Service</Text>
							</ExternalLink> and are
							acknowledging our{' '}
							<ExternalLink href={process.env.EXPO_PUBLIC_WEBSITE_URL + '/privacy-policy'}>
								<Text>Privacy Policy</Text>
							</ExternalLink>
						</Text>
					</View>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 16,
		color: '#666',
		marginBottom: 20
	},
	legalContainer: {
		position: 'absolute',
		bottom: 30,
		left: 20,
		right: 20,
		padding: 20,
		alignItems: 'center'
	},
	legalRow: {
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	icon: {
		marginTop: -2
	},
	legal: {
		fontSize: 15,
		color: '#666',
		flex: 1,
		textAlign: 'center'
	}
})
