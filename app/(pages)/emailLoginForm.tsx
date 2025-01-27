import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, View, AppState } from 'react-native'
import { supabase } from '@/supabase/connect'

import { useNavigation } from '@react-navigation/native'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { validateInput } from '@/composables/inputValidator'
import { validatePassword } from '@/composables/passwordValidator'
import { hasOnboarded } from '@/composables/userMethods'

import { useBaseStore } from '@/store/base'

import { router } from 'expo-router'

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

	const initialState = (value: string) => ({
		value: value,
		error: false,
		errorMessage: ''
	})

	const [inputEmail, setInputEmail] = useState(initialState(''))
	const [inputPassword, setInputPassword] = useState(initialState(''))

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return !error.isValid
	}

	const hasPasswordError = (type: string, minLength: number) => {
		const error = validatePassword(type, minLength)
		return !error.isValid
	}

	const getPasswordErrorMessage = (type: string, minLength: number) => {
		const error = validatePassword(type, minLength)
		return error.message
	}

	const getErrorMessage = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return error.message
	}

	const checkForErrors = () => {
		const emailError = hasError('email', inputEmail.value)
		const passwordError = hasPasswordError(inputPassword.value, 6)
		setInputEmail((prev) => ({
			...prev,
			error: emailError,
			errorMessage: getErrorMessage('email', inputEmail.value)
		}))
		setInputPassword((prev) => ({
			...prev,
			error: passwordError,
			errorMessage: getPasswordErrorMessage(inputPassword.value, 6)
		}))
		return !emailError && !passwordError
	}

	const handleSubmit = async () => {
		if (checkForErrors()) {
			useBaseStore.getState().setLoading(true)
			try {
				const response = await supabase.auth.signInWithPassword({
					email: inputEmail.value,
					password: inputPassword.value
				})
				// authenticated
				if (response.data?.user?.aud === 'authenticated') {
					await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
					useBaseStore.getState().setLoading(false)
					const has_been_onboarded = await hasOnboarded(inputEmail.value)
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
					useBaseStore
						.getState()
						.setToast({ visible: true, message: response.error.message })
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
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Input
					label={'Email'}
					placeholder={'email@address.com'}
					value={inputEmail.value}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={'none'}
					keyboardType={'email-address'}
					returnKeyType="done"
					error={inputEmail.error}
					errorText={inputEmail.errorMessage}
					onChangeText={(text) => {
						setInputEmail({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setInputEmail((prev) => ({
							...prev,
							error: hasError('email', inputEmail.value),
							errorMessage: getErrorMessage('email', inputEmail.value)
						}))
					}}
				/>
				<Input
					label={'Password'}
					placeholder={'Password'}
					value={inputPassword.value}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={'none'}
					keyboardType={'default'}
					returnKeyType="done"
					error={inputPassword.error}
					errorText={inputPassword.errorMessage}
					secureTextEntry={true}
					onChangeText={(text) => {
						setInputPassword({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setInputPassword((prev) => ({
							...prev,
							error: hasPasswordError(inputPassword.value, 6),
							errorMessage: getPasswordErrorMessage(inputPassword.value, 6)
						}))
					}}
				/>
			</View>
			<View style={styles.footer}>
				<Button
					text="Login"
					fill={true}
					onPress={async () => {
						await handleSubmit()
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
