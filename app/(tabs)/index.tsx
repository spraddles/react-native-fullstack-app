import React, { useState } from 'react'
import { StyleSheet, Platform } from 'react-native'
import { router } from 'expo-router'

import { View } from '@/components/Themed'
import { Tabs } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/numberInput'
import { Button } from '@/components/ui/button'

import {
	formatCurrency,
	formatCPF,
	removeNonNumbers,
	formatPhone,
	formatAlphaNumeric
} from '@/composables/inputFormatter'

import { useBaseStore } from '@/store/base'

import { validateInput } from '@/composables/inputValidator'

export default function TabOneScreen() {
	const blankErrorText = 'Please enter a value'

	const initialState = (value: string) => ({
		value: value,
		error: false,
		errorMessage: ''
	})

	const [currentTab, setCurrentTab] = useState('cpf')

	const [inputCurrency, setInputCurrency] = useState(initialState('0.00'))
	const [inputCPF, setInputCPF] = useState(initialState(''))
	const [inputPhone, setInputPhone] = useState(initialState(''))
	const [inputEmail, setInputEmail] = useState(initialState(''))
	const [inputKey, setInputKey] = useState(initialState(''))

	const getCurrentTab = () => {
		if (currentTab === 'cpf') {
			return inputCPF
		}
		if (currentTab === 'phone') {
			return inputPhone
		}
		if (currentTab === 'email') {
			return inputEmail
		}
		if (currentTab === 'key') {
			return inputKey
		}
	}

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return !error.isValid
	}

	const getErrorMessage = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return error.message
	}

	const clearTabs = () => {
		setInputCPF({ value: '', error: true, errorMessage: blankErrorText })
		setInputPhone({ value: '', error: true, errorMessage: blankErrorText })
		setInputEmail({ value: '', error: true, errorMessage: blankErrorText })
		setInputKey({ value: '', error: true, errorMessage: blankErrorText })
	}

	const tabErrors = (tabErrorsObject) => {
		return tabErrorsObject[currentTab]
	}

	const checkForErrors = () => {
		const currencyError = hasError('number', Number(removeNonNumbers(inputCurrency.value)))
		const cpfError = hasError('number', removeNonNumbers(inputCPF.value), 11)
		const phoneError = hasError('number', removeNonNumbers(inputPhone.value), 11)
		const emailError = hasError('email', inputEmail.value)
		const keyError = hasError('alpha-numeric', inputKey.value)
		setInputCurrency((prev) => ({
			...prev,
			error: currencyError,
			errorMessage: getErrorMessage('number', Number(removeNonNumbers(inputCurrency.value)))
		}))
		setInputCPF((prev) => ({
			...prev,
			error: cpfError,
			errorMessage: getErrorMessage('number', removeNonNumbers(inputCPF.value), 11)
		}))
		setInputPhone((prev) => ({
			...prev,
			error: phoneError,
			errorMessage: getErrorMessage('number', removeNonNumbers(inputPhone.value), 11)
		}))
		setInputEmail((prev) => ({
			...prev,
			error: emailError,
			errorMessage: getErrorMessage('email', inputEmail.value)
		}))
		setInputKey((prev) => ({
			...prev,
			error: keyError,
			errorMessage: getErrorMessage('alpha-numeric', inputKey.value)
		}))
		const errorsObject = {
			cpf: cpfError,
			phone: phoneError,
			email: emailError,
			key: keyError
		}
		return !currencyError && !tabErrors(errorsObject)
	}

	const handleNext = async () => {
		if (checkForErrors()) {
			useBaseStore.getState().setLoading(true)
			try {
				const fakeReceiver = 'Frederico Jon da Silva' // update this for prod
				const transaction = {
					pix_method: currentTab,
					pix_method_value: getCurrentTab().value,
					receiver: fakeReceiver,
					digital_wallet: Platform.OS === 'ios' ? 'apple' : 'google',
					amount: inputCurrency.value
				}
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				useBaseStore.getState().setLoading(false)
				router.push({
					pathname: '/(pages)/confirmTransaction',
					params: {
						transaction: JSON.stringify(transaction)
					}
				})
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
				<View style={styles.inputs}>
					<NumberInput
						label={'Amount'}
						value={inputCurrency.value}
						placeholder={'0.00'}
						autoCorrect={false}
						autoComplete="off"
						autoCapitalize="none"
						keyboardType={'numeric'}
						returnKeyType="done"
						error={inputCurrency.error}
						errorText={inputCurrency.errorMessage}
						onChangeText={(text) => {
							setInputCurrency({
								value: formatCurrency(text),
								error: false,
								errorMessage: ''
							})
						}}
						onEndEditing={() => {
							setInputCurrency((prev) => ({
								...prev,
								error: hasError('number', removeNonNumbers(inputCurrency.value)),
								errorMessage: getErrorMessage(
									'number',
									removeNonNumbers(inputCurrency.value)
								)
							}))
						}}
					/>
				</View>
				<View style={styles.inputs}>
					<Tabs
						label={'Pix method'}
						tabs={[
							{ id: 'cpf', name: 'CPF' },
							{ id: 'phone', name: 'Phone' },
							{ id: 'email', name: 'Email' },
							{ id: 'key', name: 'Key' }
						]}
						activeTab={currentTab}
						onTabChange={(newTab) => {
							setCurrentTab(newTab)
							clearTabs()
						}}
					/>
				</View>
				<View style={styles.inputs}>
					{currentTab === 'cpf' ? (
						<Input
							label={'CPF'}
							value={inputCPF.value}
							placeholder={'Recipient CPF'}
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
					) : currentTab === 'phone' ? (
						<Input
							label={'Phone'}
							value={inputPhone.value}
							placeholder={'Recipient phone'}
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
									error: hasError(
										'number',
										removeNonNumbers(inputPhone.value),
										11
									),
									errorMessage: getErrorMessage(
										'number',
										Number(removeNonNumbers(inputPhone.value)),
										11
									)
								}))
							}}
						/>
					) : currentTab === 'email' ? (
						<Input
							label={'Email'}
							value={inputEmail.value}
							placeholder={'Recipient email'}
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
					) : currentTab === 'key' ? (
						<Input
							label={'Key'}
							value={inputKey.value}
							placeholder={'Recipient key'}
							autoCorrect={false}
							autoComplete="off"
							autoCapitalize="none"
							keyboardType={'default'}
							returnKeyType="done"
							error={inputKey.error}
							errorText={inputKey.errorMessage}
							onChangeText={(text) => {
								setInputKey({
									value: formatAlphaNumeric(text),
									error: false,
									errorMessage: ''
								})
							}}
							onSubmitEditing={() => {
								setInputKey((prev) => ({
									...prev,
									error: hasError('alpha-numeric', inputKey.value),
									errorMessage: getErrorMessage('alpha-numeric', inputKey.value)
								}))
							}}
						/>
					) : null}
				</View>
			</View>
			<View style={styles.footer}>
				<Button text={'Next'} onPress={async () => await handleNext()} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 50,
		paddingTop: 100
	},
	content: {
		flex: 1,
		alignItems: 'center'
	},
	inputs: {
		width: '100%',
		marginBottom: 40
	},
	footer: {
		width: '100%'
	}
})
