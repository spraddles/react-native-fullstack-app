import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'

import { router, useLocalSearchParams } from 'expo-router'

import { useBaseStore } from '@/store/base'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { formatCreditCardNumber, allowNumeric } from '@/composables/inputFormatter'
import { validateInput } from '@/composables/inputValidator'
import { encryptData } from '@/composables/encrypt'

export default function AddCardScreen() {
	const params = useLocalSearchParams()
	const transaction = params.transaction ? JSON.parse(params.transaction as string) : ''

	const navigationState = useNavigationState((state) => state)
	const createCard = useBaseStore((state) => state.createCard)
	const setLoading = useBaseStore((state) => state.setLoading)
	const setToast = useBaseStore((state) => state.setToast)

	const getPreviousRoute = () => {
		if (!navigationState) {
			return null
		}
		const routes = navigationState.routes
		const currentIndex = navigationState.index
		return currentIndex > 0 ? routes[currentIndex - 1].name : null
	}

	const whereDidIComeFrom = () => {
		// we came from newUserAddCard
		if (getPreviousRoute() === '(pages)/newUserAddCard') {
			return 'newUserAddCard'
		}
		// we came from initiate transaction
		else if (params.transaction) {
			return 'index'
		}
		// we came directly here
		else {
			return 'direct'
		}
	}

	const initialState = (value: string) => ({
		value: value,
		error: false,
		errorMessage: ''
	})

	const [inputNumber, setInputNumber] = useState(initialState())
	const [inputHolder, setInputHolder] = useState(initialState())
	const [inputExpiryMonth, setInputExpiryMonth] = useState(initialState())
	const [inputExpiryYear, setInputExpiryYear] = useState(initialState())
	const [inputCVV, setInputCVV] = useState(initialState())

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return !error.isValid
	}

	const getErrorMessage = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return error.message
	}

	const checkForErrors = () => {
		const inputNumberError = hasError('credit-card-number', inputNumber.value)
		const inputHolderError = hasError('text', inputHolder.value)
		const inputExpiryMonthError = hasError('month', inputExpiryMonth.value)
		const inputExpiryYearError = hasError('year-short', inputExpiryYear.value)
		const inputCVVError = hasError('cvv', inputCVV.value)
		setInputNumber((prev) => ({
			...prev,
			error: hasError('credit-card-number', inputNumber.value),
			errorMessage: getErrorMessage('credit-card-number', inputNumber.value)
		}))
		setInputHolder((prev) => ({
			...prev,
			error: hasError('text', inputHolder.value),
			errorMessage: getErrorMessage('text', inputHolder.value)
		}))
		setInputExpiryMonth((prev) => ({
			...prev,
			error: hasError('month', inputExpiryMonth.value),
			errorMessage: getErrorMessage('month', inputExpiryMonth.value)
		}))
		setInputExpiryYear((prev) => ({
			...prev,
			error: hasError('year-short', inputExpiryYear.value),
			errorMessage: getErrorMessage('year-short', inputExpiryYear.value)
		}))
		setInputCVV((prev) => ({
			...prev,
			error: hasError('cvv', inputCVV.value),
			errorMessage: getErrorMessage('cvv', inputCVV.value)
		}))

		return (
			!inputNumberError &&
			!inputHolderError &&
			!inputExpiryMonthError &&
			!inputExpiryYearError &&
			!inputCVVError
		)
	}

	const handleSave = async () => {
		if (!checkForErrors()) {
			return
		}
		try {
			setLoading(true)
			await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
			const data = {
				number: inputNumber.value,
				holder: inputHolder.value,
				expiry: `${inputExpiryMonth.value}/${inputExpiryYear.value}`,
				cvv: inputCVV.value
			}
			// encrypt card data
			const encryptedData = await encryptData(data)
			if (!encryptedData) {
				throw new Error('Failed to encrypt card details')
			}
			// create card
			const newCardResponse = await createCard(encryptedData)
			if (!newCardResponse) {
				throw new Error('Failed to create new card')
			}
			const source = whereDidIComeFrom()
			if (source === 'newUserAddCard') {
				router.push('/(pages)/newUserProfileComplete')
			} else if (source === 'direct') {
				await router.back()
			} else if (source === 'index') {
				router.push({
					pathname: '/(pages)/confirmTransaction',
					params: {
						transaction: JSON.stringify(transaction)
					}
				})
			}
			setToast({
				visible: true,
				message: 'Card has been added'
			})
		} catch (error) {
			console.error('Error saving card:', error)
			setToast({
				visible: true,
				message: `Failed to add card: ${error.message}`,
				type: 'error'
			})
		} finally {
			setLoading(false)
		}
	}

	const handleCancel = async () => {
		// reset the state (if something has been set)
		await router.back()
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<Input
					label={'Number'}
					value={inputNumber.value}
					placeholder={'1234 1234 1234 1234'}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={true}
					keyboardType={'phone-pad'}
					returnKeyType="done"
					error={inputNumber.error}
					errorText={inputNumber.errorMessage}
					onChangeText={(text) => {
						setInputNumber({
							value: formatCreditCardNumber(text),
							error: false,
							errorMessage: ''
						})
					}}
					onEndEditing={() => {
						setInputNumber((prev) => ({
							...prev,
							error: hasError('credit-card-number', inputNumber.value),
							errorMessage: getErrorMessage('credit-card-number', inputNumber.value)
						}))
					}}
				/>
				<Input
					label={'Cardholder'}
					value={inputHolder.value}
					placeholder={'John Smith'}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize={true}
					keyboardType={'default'}
					returnKeyType="done"
					error={inputHolder.error}
					errorText={inputHolder.errorMessage}
					onChangeText={(text) => {
						setInputHolder({
							value: text,
							error: false,
							errorMessage: ''
						})
					}}
					onSubmitEditing={() => {
						setInputHolder((prev) => ({
							...prev,
							error: hasError('text', inputHolder.value),
							errorMessage: getErrorMessage('text', inputHolder.value)
						}))
					}}
				/>
				<View style={styles.row}>
					<View style={styles.item}>
						<Input
							label={'Expiry month'}
							value={inputExpiryMonth.value}
							placeholder={'01'}
							autoCorrect={false}
							autoComplete="off"
							keyboardType={'phone-pad'}
							returnKeyType="done"
							error={inputExpiryMonth.error}
							errorText={inputExpiryMonth.errorMessage}
							onChangeText={(text) => {
								setInputExpiryMonth({
									value: allowNumeric(text),
									error: false,
									errorMessage: ''
								})
							}}
							onEndEditing={() => {
								setInputExpiryMonth((prev) => ({
									...prev,
									error: hasError('month', inputExpiryMonth.value),
									errorMessage: getErrorMessage('month', inputExpiryMonth.value)
								}))
							}}
						/>
					</View>
					<View style={styles.item}>
						<Input
							label={'Expiry year'}
							value={inputExpiryYear.value}
							placeholder={'27'}
							autoCorrect={false}
							autoComplete="off"
							autoCapitalize={true}
							keyboardType={'phone-pad'}
							returnKeyType="done"
							error={inputExpiryYear.error}
							errorText={inputExpiryYear.errorMessage}
							onChangeText={(text) => {
								setInputExpiryYear({
									value: allowNumeric(text),
									error: false,
									errorMessage: ''
								})
							}}
							onEndEditing={() => {
								setInputExpiryYear((prev) => ({
									...prev,
									error: hasError('year-short', inputExpiryYear.value),
									errorMessage: getErrorMessage(
										'year-short',
										inputExpiryYear.value
									)
								}))
							}}
						/>
					</View>
				</View>
				<View style={styles.row}>
					<View style={styles.item}>
						<Input
							label={'CVV'}
							value={inputCVV.value}
							placeholder={'123'}
							autoCorrect={false}
							autoComplete="off"
							autoCapitalize={true}
							keyboardType={'phone-pad'}
							returnKeyType="done"
							error={inputCVV.error}
							errorText={inputCVV.errorMessage}
							onChangeText={(text) => {
								setInputCVV({
									value: allowNumeric(text),
									error: false,
									errorMessage: ''
								})
							}}
							onEndEditing={() => {
								setInputCVV((prev) => ({
									...prev,
									error: hasError('cvv', inputCVV.value),
									errorMessage: getErrorMessage('cvv', inputCVV.value)
								}))
							}}
						/>
					</View>
				</View>
			</ScrollView>
			<View style={styles.footer}>
				<Button
					text="Save"
					fill={true}
					onPress={async () => {
						await handleSave()
					}}
				/>
				<Button
					text="Cancel"
					fill={false}
					onPress={async () => {
						await handleCancel()
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
		alignItems: 'center',
		paddingBottom: 170
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%'
	},
	item: {
		width: '48%'
	},
	footer: {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})
