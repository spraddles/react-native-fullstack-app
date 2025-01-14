import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'

import { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import { router, useLocalSearchParams } from 'expo-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { validateInput } from '@/composables/inputValidator'
import { removeNonNumbers, formatPhone, formatPassport } from '@/composables/inputFormatter'
import { updateUserMeta } from '@/composables/updateUserMeta'

import { useBaseStore } from '@/store/base'

import { supabase } from '@/supabase/connect'

export default function NewUserEditProfileScreen() {
	const { password, method } = useLocalSearchParams()
	const navigation = useNavigation()
	const user = useBaseStore((state) => state.user)

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerBackVisible: false
		})
	}, [navigation])

	const blankErrorText = 'Please enter a value'

	const initialState = (value: string) => ({
		value: value,
		error: !value,
		errorMessage: value ? '' : blankErrorText
	})

	const [inputName, setInputName] = useState(initialState(user.name))
	const [inputSurname, setInputSurname] = useState(initialState(user.surname))
	const [inputPhone, setInputPhone] = useState(initialState(user.phone))
	const [inputPassport, setInputPassport] = useState(initialState(user.passport))

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return !error.isValid
	}

	const getErrorMessage = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return error.message
	}

	const handleSubmit = async () => {
		try {
			useBaseStore.getState().setLoading(true)
			// update user fields in store
			useBaseStore.getState().setUserField('name', inputName.value)
			useBaseStore.getState().setUserField('surname', inputSurname.value)
			useBaseStore.getState().setUserField('phone', inputPhone.value)
			useBaseStore.getState().setUserField('passport', inputPassport.value)
			await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
			// for email accounts
			if (method !== 'social') {
				const signUpUserResponse = await supabase.auth.signUp(
					{
						email: user.email,
						password: password
					},
					// don't send confirmation email
					{ disableEmailConfirmation: true }
				)
			}
			// for all accounts (email + social)
			const supabaseUser = await supabase.auth.getUser()
			const supabaseUserID = supabaseUser?.data?.user?.id
			const updateUserMetaResponse = await updateUserMeta(supabaseUserID, {
				user_id: supabaseUserID,
				name: inputName.value,
				surname: inputSurname.value,
				phone: inputPhone.value,
				passport: inputPassport.value,
				has_onboarded: true
			})
			useBaseStore.getState().setLoading(false)
			router.push('/(pages)/newUserProfileComplete')
		} catch (error) {
			console.log('NewUserEditProfileScreen unknown error: ', error)
			useBaseStore.getState().setLoading(false)
			useBaseStore.getState().setToast({
				visible: true,
				message: `We can't create your account now sorry: ${error}`
			})
		} finally {
			// in case spinner isn't already stopped
			useBaseStore.getState().setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Input
					label={'Name'}
					value={inputName.value}
					placeholder={'Enter name'}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={true}
					keyboardType={'default'}
					returnKeyType="done"
					error={inputName.error}
					errorText={inputName.errorMessage}
					onChangeText={(text) => {
						setInputName({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setInputName((prev) => ({
							...prev,
							error: hasError('text', inputName.value),
							errorMessage: getErrorMessage('text', inputName.value)
						}))
					}}
				/>
				<Input
					label={'Surname'}
					value={inputSurname.value}
					placeholder={'Enter surname'}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={true}
					keyboardType={'default'}
					returnKeyType="done"
					error={inputSurname.error}
					errorText={inputSurname.errorMessage}
					onChangeText={(text) => {
						setInputSurname({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setInputSurname((prev) => ({
							...prev,
							error: hasError('text', inputSurname.value),
							errorMessage: getErrorMessage('text', inputSurname.value)
						}))
					}}
				/>
				<Input
					label={'Phone'}
					value={inputPhone.value}
					placeholder={'Enter phone'}
					autoCorrect={false}
					autoComplete="off"
					keyboardType={'phone-pad'}
					returnKeyType="done"
					error={inputPhone.error}
					errorText={inputPhone.errorMessage}
					onChangeText={(text) => {
						setInputPhone({
							value: formatPhone(text),
							error: false,
							errorMessage: ''
						})
					}}
					onEndEditing={() => {
						setInputPhone((prev) => ({
							...prev,
							error: hasError('number', removeNonNumbers(inputPhone.value)),
							errorMessage: getErrorMessage(
								'number',
								Number(removeNonNumbers(inputPhone.value))
							)
						}))
					}}
				/>
				<Input
					label={'Passport'}
					value={inputPassport.value}
					placeholder={'Passport number'}
					autoCorrect={false}
					autoComplete="off"
					keyboardType={'default'}
					returnKeyType="done"
					error={inputPassport.error}
					errorText={inputPassport.errorMessage}
					onChangeText={(text) => {
						setInputPassport({
							value: formatPassport(text),
							error: false,
							errorMessage: ''
						})
					}}
					onEndEditing={() => {
						setInputPassport((prev) => ({
							...prev,
							error: hasError('generic', inputPassport.value),
							errorMessage: getErrorMessage('generic', inputPassport.value)
						}))
					}}
				/>
			</ScrollView>
			<View style={styles.footer}>
				<Button
					text="Save"
					fill={true}
					disabled={
						inputName.error ||
						inputSurname.error ||
						inputPhone.error ||
						inputPassport.error
					}
					onPress={async () => {
						await handleSubmit()
					}}
				/>
				<Button
					text="Cancel"
					fill={false}
					onPress={() => {
						router.push('/(pages)')
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
	content: {
		flex: 1,
		alignItems: 'center'
	},
	footer: {
		width: '100%',
		paddingBottom: 10
	}
})
