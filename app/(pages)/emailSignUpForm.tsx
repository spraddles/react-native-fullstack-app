import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, View, AppState, TextInput } from 'react-native'
import { supabase } from '@/supabase/connect'

import { useNavigation } from '@react-navigation/native'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { validateInput } from '@/composables/inputValidator'
import { validatePassword, comparePassword } from '@/composables/passwordValidator'

import { useBaseStore } from '@/store/base'

import { router } from 'expo-router'

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

	const stateObject = (value: string) => ({
		value: value,
		error: false,
		errorMessage: ''
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

	const checkForErrors = () => {
		const emailError = hasError('email', email.value)
		const passwordError = hasPasswordError(password.value, 6)
		const confirmError = hasConfirmPasswordError(password.value, confirmPassword.value)
		setEmail((prev) => ({
			...prev,
			error: emailError,
			errorMessage: getErrorMessage('email', email.value)
		}))
		setPassword((prev) => ({
			...prev,
			error: passwordError,
			errorMessage: getPasswordErrorMessage(password.value, 6)
		}))
		setConfirmPassword((prev) => ({
			...prev,
			error: confirmError,
			errorMessage: getConfirmPasswordErrorMessage(password.value, confirmPassword.value)
		}))
		return !emailError && !passwordError && !confirmError
	}

	const handleSignUpWithEmail = async () => {
		if (checkForErrors()) {
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
					useBaseStore.getState().resetUser()
					router.push('/(pages)')
				}
				// no user exists: create account
				else {
					await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
					useBaseStore.getState().setUserField('email', email.value) // save user email
					useBaseStore.getState().setLoading(false)
					router.push({
						pathname: '/(pages)/completeProfile',
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
					secureTextEntry={true}
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
				<TextInput style={{ height: 0.1 }} />
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
					secureTextEntry={true}
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
