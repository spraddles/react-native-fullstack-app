import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'

import { View } from '@/components/Themed'
import { Tabs } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/numberInput'
import { Button } from '@/components/ui/button'

import { formatCurrency } from '@/composables/formatCurrency'
import { formatCPF, removeNonNumbers } from '@/composables/formatCPF'
import { formatPhone } from '@/composables/formatPhone'

import { useBaseStore } from '@/store/base'

import { validateInput } from '@/composables/inputValidator'

export default function TabOneScreen() {
	const [currentTab, setCurrentTab] = useState('cpf')

	const blankErrorText = 'Please enter a value'

	// number input
	const [inputCurrency, setInputCurrency] = useState({
		value: '0.00',
		error: true,
		errorMessage: blankErrorText
	})

	// cpf input
	const [inputCPF, setInputCPF] = useState({
		value: '',
		error: true,
		errorMessage: blankErrorText
	})

	// phone input
	const [inputPhone, setInputPhone] = useState({
		value: '',
		error: true,
		errorMessage: blankErrorText
	})

	// email input
	const [inputEmail, setInputEmail] = useState({
		value: '',
		error: true,
		errorMessage: blankErrorText
	})

	const getCurrentMethod = () => {
		if (currentTab === 'cpf') {
			return inputCPF
		}
		if (currentTab === 'phone') {
			return inputPhone
		}
		if (currentTab === 'email') {
			return inputEmail
		}
	}

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		console.log('hasError: ', {
			type: type,
			value: value,
			isValid: error.isValid,
			message: error.message
		})
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
	}

	const handleNext = async () => {
		console.log('handleNext')
		// valid
		if (hasError('number', inputCurrency)) {
			useBaseStore.getState().setLoading(true)
			await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
			useBaseStore.getState().setLoading(false)

			router.push({
				pathname: '/pages/confirm',
				params: {
					amount: inputCurrency.value,
					paymentType: 'pix',
					pixMethod: currentTab,
					pixMethodValue: getCurrentMethod().value
				}
			})
		}

		// invalid
		else {
			console.log('invalid: ', currencyInputValidation.message)
			// set component message
			// trigger toast
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.inputs}>
					<NumberInput
						label={'R $'}
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
								error: hasError('number', Number(inputCurrency.value)),
								errorMessage: getErrorMessage('number', Number(inputCurrency.value))
							}))
						}}
					/>
				</View>
				<View style={styles.inputs}>
					<Tabs
						label={'PIX'}
						tabs={[
							{ id: 'cpf', name: 'CPF' },
							{ id: 'phone', name: 'Phone' },
							{ id: 'email', name: 'Email' }
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
					) : currentTab === 'phone' ? (
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
					) : null}
				</View>
			</View>
			<View style={styles.footer}>
				<Button
					text={'Next'}
					disabled={inputCurrency.error || getCurrentMethod().error}
					onPress={async () => await handleNext()}
				/>
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
		width: '100%',
		paddingBottom: 10
	}
})
