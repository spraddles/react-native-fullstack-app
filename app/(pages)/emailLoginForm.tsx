import React, { useState } from 'react'
import { StyleSheet, View, AppState } from 'react-native'
import { supabase } from '@/supabase/connect'

import { router } from 'expo-router'

import { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import { useBaseStore } from '@/store/base'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { hasOnboarded } from '@/composables/authHelpers'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
	if (state === 'active') {
		supabase.auth.startAutoRefresh()
	} else {
		supabase.auth.stopAutoRefresh()
	}
})

export default function EmailLoginForm() {
	const navigation = useNavigation()

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Email login'
		})
	}, [navigation])

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleEmailLogin = async () => {
		useBaseStore.getState().setLoading(true)
		try {
			const response = await supabase.auth.signInWithPassword({
				email: email,
				password: password
			})
			// authenticated
			if (response.data?.user?.aud === 'authenticated') {
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				useBaseStore.getState().setLoading(false)
				const has_been_onboarded = await hasOnboarded(email)
				// user needs onboarding
				if (!has_been_onboarded) {
					useBaseStore.getState().setLoading(false)
					router.push('/(pages)/completeProfile')
				}
				// user already onboarded
				else {
					useBaseStore.getState().setLoading(false)
					router.push('/(tabs)')
				}
			}
			// not authenticated
			else {
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				useBaseStore.getState().setLoading(false)
				useBaseStore.getState().setToast({ visible: true, message: response.error.message })
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
			<View style={styles.content}>
				<Input
					label={'Email'}
					placeholder={'email@address.com'}
					value={email}
					onChangeText={(text) => setEmail(text)}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={'none'}
					keyboardType={'default'}
					returnKeyType="done"
				/>
				<Input
					label={'Password'}
					placeholder={'Password'}
					value={password}
					onChangeText={(text) => setPassword(text)}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={'none'}
					keyboardType={'default'}
					returnKeyType="done"
				/>
			</View>
			<View style={styles.footer}>
				<Button
					text="Login"
					fill={true}
					onPress={async () => {
						await handleEmailLogin()
					}}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 50,
		paddingTop: 100,
		backgroundColor: '#fff'
	},
	text: {
		fontSize: 16,
		color: '#666',
		width: '80%',
		textAlign: 'center'
	},
	marginTop: {
		marginTop: 20
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%'
	},
	footer: {
		width: '100%',
		paddingBottom: 10
	}
})
