import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'

import { router } from 'expo-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { validateInput } from '@/composables/inputValidator'
import { formatCPF, removeNonNumbers, formatPhone } from '@/composables/inputFormatter'

import { useBaseStore } from '@/store/base'

export default function EditProfileScreen() {
	const blankErrorText = 'Please enter a value'

	const initialState = (value: string) => ({
		value: value,
		error: !value,
		errorMessage: value ? '' : blankErrorText
	})

	const user = useBaseStore((state) => state.user)
	const emptyProfile = useBaseStore((state) => state.emptyProfile)

	const [inputName, setInputName] = useState(initialState(emptyProfile ? '' : user.name.value))
	const [inputSurname, setInputSurname] = useState(initialState(emptyProfile ? '' : user.surname.value))
	const [inputEmail, setInputEmail] = useState(initialState(emptyProfile ? '' : user.email.value))
	const [inputPhone, setInputPhone] = useState(initialState(emptyProfile ? '' : user.phone.value))
	const [inputCPF, setInputCPF] = useState(initialState(emptyProfile ? '' : user.cpf.value))

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return !error.isValid
	}

	const getErrorMessage = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return error.message
	}

	// @TODO: update this to handle DB requests
	const handleSubmit = async () => {
		useBaseStore.getState().setLoading(true)
		console.log('handleSubmit')
		// update user fields in store
		useBaseStore.getState().setUser('name', inputName)
		useBaseStore.getState().setUser('surname', inputSurname)
		useBaseStore.getState().setUser('email', inputEmail)
		useBaseStore.getState().setUser('phone', inputPhone)
		useBaseStore.getState().setUser('cpf', inputCPF)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
		useBaseStore.getState().setLoading(false)
		useBaseStore.getState().setEmptyProfile(false)
		router.push('/(tabs)/profile')
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
					label={'Email'}
					value={inputEmail.value}
					placeholder={'Enter email'}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize="none"
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
							error: hasError('number', removeNonNumbers(inputPhone.value), 11),
							errorMessage: getErrorMessage(
								'number',
								Number(removeNonNumbers(inputPhone.value)),
								11
							)
						}))
					}}
				/>
				<Input
					label={'CPF'}
					value={inputCPF.value}
					placeholder={'Enter CPF'}
					autoCorrect={false}
					autoComplete="off"
					keyboardType={'number-pad'}
					returnKeyType="done"
					error={inputCPF.error}
					errorText={inputCPF.errorMessage}
					onChangeText={(text) => {
						setInputCPF({
							value: formatCPF(text),
							error: false,
							errorMessage: ''
						})
					}}
					onEndEditing={() => {
						setInputCPF((prev) => ({
							...prev,
							error: hasError('number', removeNonNumbers(inputCPF.value), 11),
							errorMessage: getErrorMessage(
								'number',
								Number(removeNonNumbers(inputCPF.value)),
								11
							)
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
						inputEmail.error ||
						inputPhone.error ||
						inputCPF.error
					}
					onPress={async () => {
						await handleSubmit()
					}}
				/>
				<Button
					text="Cancel"
					fill={false}
					onPress={async () => {
						await router.back()
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
