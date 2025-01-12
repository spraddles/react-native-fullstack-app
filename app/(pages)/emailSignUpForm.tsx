import React, { useState } from 'react'
import { StyleSheet, View, AppState } from 'react-native'
import { supabase } from '@/supabase/connect'

import { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { validateInput } from '@/composables/inputValidator'
import { validatePassword, comparePassword } from '@/composables/passwordValidator'

import { useBaseStore } from '@/store/base'

import { router } from 'expo-router'

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

export default function EmailSignUoForm() {
	const navigation = useNavigation()

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'Email sign up'
		})
	}, [navigation])

	const blankErrorText = 'Please enter a value'

	const stateObject = (value: string) => ({
		value: value,
		error: !value,
		errorMessage: value ? '' : blankErrorText
	})

	const [email, setEmail] = useState(stateObject(''))
	const [password, setPassword] = useState(stateObject(''))
	const [confirmPassword, setConfirmPassword] = useState(stateObject(''))

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return !error.isValid
	}

	const getErrorMessage = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return error.message
	}

	const hasPasswordError = (type: string, minLength: number) => {
		const error = validatePassword(type, minLength)
		return !error.isValid
	}

	const getPasswordErrorMessage = (type: string, minLength: number) => {
		const error = validatePassword(type, minLength)
		return error.message
	}

	const hasConfirmPasswordError = (value: any, confirmValue: any) => {
		const error = comparePassword(value, confirmValue)
		return !error.isValid
	}

	const getConfirmPasswordErrorMessage = (value: any, confirmValue: any) => {
		const error = comparePassword(value, confirmValue)
		return error.message
	}

	const handleSignUpWithEmail = async () => {
		useBaseStore.getState().setLoading(true)
		try {
			// note: this rpc function needs to be predefined in supabase
			const response = await supabase.rpc('get_user_by_email', {
				email_param: email.value
			})
			const userExists = response.data[0]?.created_at
			// user already exists
			if (userExists) {
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				useBaseStore.getState().setLoading(false)
				useBaseStore.getState().setToast({
					visible: true,
					message:
						"It looks like you've already signed up. Please use the login form instead!"
				})
				router.push('/(pages)')
			}
			// no user exists: create account
			else {
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				useBaseStore.getState().setUserField('email', email.value) // save user email
				useBaseStore.getState().setLoading(false)
				router.push({
					pathname: '/(pages)/newUser',
					params: {
						password: password.value
					}
				})
			}
		} catch (error) {
			console.log('error: ', error)
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
					value={email.value}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={'none'}
					keyboardType={'email-address'}
					returnKeyType="done"
					error={email.error}
					errorText={email.errorMessage}
					onChangeText={(text) => {
						setEmail({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setEmail((prev) => ({
							...prev,
							error: hasError('email', email.value),
							errorMessage: getErrorMessage('email', email.value)
						}))
					}}
				/>
				<Input
					label={'Create a password'}
					placeholder={'at least 6 characters required'}
					value={password.value}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={'none'}
					keyboardType={'default'}
					returnKeyType="done"
					error={password.error}
					errorText={password.errorMessage}
					onChangeText={(text) => {
						setPassword({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setPassword((prev) => ({
							...prev,
							error: hasPasswordError(password.value, 6),
							errorMessage: getPasswordErrorMessage(password.value, 6)
						}))
					}}
				/>
				<Input
					label={'Confirm password'}
					placeholder={'Password'}
					value={confirmPassword.value}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={'none'}
					keyboardType={'default'}
					returnKeyType="done"
					error={confirmPassword.error}
					errorText={confirmPassword.errorMessage}
					onChangeText={(text) => {
						setConfirmPassword({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setConfirmPassword((prev) => ({
							...prev,
							error: hasConfirmPasswordError(password.value, confirmPassword.value),
							errorMessage: getConfirmPasswordErrorMessage(
								password.value,
								confirmPassword.value
							)
						}))
					}}
				/>
			</View>
			<View style={styles.footer}>
				<Button
					text="Continue"
					fill={true}
					disabled={email.error || password.error || confirmPassword.error}
					onPress={async () => {
						await handleSignUpWithEmail()
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
