import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'

import { router, useLocalSearchParams } from 'expo-router'
import { useNavigation } from '@react-navigation/native'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CountryPicker } from '@/components/ui/countryPicker'

import { updateUserMeta } from '@/composables/userMethods'
import { validateInput } from '@/composables/inputValidator'
import {
	stripSpaces,
	formatPhoneInternational,
	formatPassport,
	formatCPF,
	formatDOB
} from '@/composables/inputFormatter'

import { useBaseStore } from '@/store/base'

import { supabase } from '@/supabase/connect'

export default function NewUserEditProfileScreen() {
	const { password, method } = useLocalSearchParams()
	const navigation = useNavigation()

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerBackVisible: false
		})
	}, [navigation])

	const user = useBaseStore((state) => state.user)
	const setUser = useBaseStore((state) => state.setUser)

	const initialState = (value: string) => ({
		value: value,
		error: false,
		errorMessage: ''
	})

	const [inputName, setInputName] = useState(initialState())
	const [inputSurname, setInputSurname] = useState(initialState())
	const [inputDOByear, setInputDOByear] = useState(initialState())
	const [inputDOBmonth, setInputDOBmonth] = useState(initialState())
	const [inputDOBday, setInputDOBday] = useState(initialState())

	const [selectedCountry, setSelectedCountry] = useState({
		value: null,
		error: false,
		errorMessage: ''
	})

	const [inputPhone, setInputPhone] = useState(initialState())
	const [inputPassport, setInputPassport] = useState(initialState())
	const [inputCPF, setInputCPF] = useState(initialState())

	const hasError = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return !error.isValid
	}

	const getErrorMessage = (type: string, value: string | number, length: number) => {
		const error = validateInput(type, value, length)
		return error.message
	}

	const checkForErrors = () => {
		const inputNameError = hasError('text', inputName.value)
		const inputSurnameError = hasError('text', inputSurname.value)
		const inputDOByearError = hasError('year', inputDOByear.value)
		const inputDOBmonthError = hasError('month', inputDOBmonth.value)
		const inputDOBdayError = hasError('day', inputDOBday.value)
		const selectedCountryError = !selectedCountry.value ? true : false
		const inputPhoneError = hasError('international-number', stripSpaces(inputPhone.value))
		const inputPassportError = hasError('generic', inputPassport.value)
		const inputCPFError = hasError('text', inputCPF.value)
		setInputName((prev) => ({
			...prev,
			error: inputNameError,
			errorMessage: getErrorMessage('text', inputName.value)
		}))
		setInputSurname((prev) => ({
			...prev,
			error: inputSurnameError,
			errorMessage: getErrorMessage('text', inputSurname.value)
		}))
		setInputDOByear((prev) => ({
			...prev,
			error: inputDOByearError,
			errorMessage: getErrorMessage('year', inputDOByear.value)
		}))
		setInputDOBmonth((prev) => ({
			...prev,
			error: inputDOBmonthError,
			errorMessage: getErrorMessage('month', inputDOBmonth.value)
		}))
		setInputDOBday((prev) => ({
			...prev,
			error: inputDOBdayError,
			errorMessage: getErrorMessage('day', inputDOBday.value)
		}))
		setSelectedCountry((prev) => ({
			...prev,
			error: selectedCountryError,
			errorMessage: 'Please select a country',
			value: selectedCountry.value
		}))
		setInputPhone((prev) => ({
			...prev,
			error: inputPhoneError,
			errorMessage: getErrorMessage('international-number', stripSpaces(inputPhone.value))
		}))
		setInputPassport((prev) => ({
			...prev,
			error: inputPassportError,
			errorMessage: getErrorMessage('generic', inputPassport.value)
		}))
		setInputCPF((prev) => ({
			...prev,
			error: inputCPFError,
			errorMessage: getErrorMessage('cpf', inputCPF.value)
		}))
		return (
			!inputNameError &&
			!inputSurnameError &&
			!inputDOByearError &&
			!inputDOBmonthError &&
			!inputDOBdayError &&
			!selectedCountryError &&
			!inputPhoneError &&
			!inputCPFError
		)
	}

	const handleSubmit = async () => {
		if (checkForErrors()) {
			useBaseStore.getState().setLoading(true)
			try {
				// update user fields in store
				const updatedUser = {
					...user,
					name: inputName.value,
					surname: inputSurname.value,
					phone: inputPhone.value,
					passport: inputPassport.value,
					cpf: inputCPF.value,
					country: selectedCountry.value.code,
					dob: {
						...user.dob,
						year: inputDOByear.value,
						month: inputDOBmonth.value,
						day: inputDOBday.value
					}
				}
				setUser(updatedUser)
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
					country: selectedCountry.value.code,
					dob_year: inputDOByear.value,
					dob_month: inputDOBmonth.value,
					dob_day: inputDOBday.value,
					phone: inputPhone.value,
					passport: inputPassport.value,
					cpf: inputCPF.value,
					has_onboarded: true
				})
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				if (!updateUserMetaResponse.status) {
					useBaseStore.getState().setLoading(false)
					useBaseStore.getState().setToast({
						visible: true,
						message:
							"We can't create your account now sorry, please check all the fields below"
					})
				} else {
					useBaseStore.getState().setLoading(false)
					router.push('/(pages)/newUserProfileComplete')
				}
			} catch (error) {
				console.log('NewUserEditProfileScreen unknown error: ', error)
				useBaseStore.getState().setLoading(false)
				useBaseStore.getState().setToast({
					visible: true,
					message:
						"We can't create your account now sorry, please check all the fields below"
				})
			} finally {
				// in case spinner isn't already stopped
				useBaseStore.getState().setLoading(false)
			}
		}
	}

	const handleCancel = () => {
		useBaseStore.getState().resetUser()
		router.push('/(pages)')
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
				<View style={styles.row}>
					<View style={styles.item}>
						<Input
							label={'Year of birth'}
							value={inputDOByear.value}
							placeholder={'YYYY'}
							autoCorrect={false}
							autoComplete="off"
							keyboardType={'phone-pad'}
							returnKeyType="done"
							error={inputDOByear.error}
							errorText={inputDOByear.errorMessage}
							onChangeText={(text) => {
								setInputDOByear({
									value: formatDOB(text),
									error: false,
									errorMessage: ''
								})
							}}
							onEndEditing={() => {
								setInputDOByear((prev) => ({
									...prev,
									error: hasError('year', inputDOByear.value),
									errorMessage: getErrorMessage('year', inputDOByear.value)
								}))
							}}
						/>
					</View>
					<View style={styles.item}>
						<Input
							label={'Month'}
							value={inputDOBmonth.value}
							placeholder={'MM'}
							autoCorrect={false}
							autoComplete="off"
							keyboardType={'phone-pad'}
							returnKeyType="done"
							error={inputDOBmonth.error}
							errorText={inputDOBmonth.errorMessage}
							onChangeText={(text) => {
								setInputDOBmonth({
									value: formatDOB(text),
									error: false,
									errorMessage: ''
								})
							}}
							onEndEditing={() => {
								setInputDOBmonth((prev) => ({
									...prev,
									error: hasError('month', inputDOBmonth.value),
									errorMessage: getErrorMessage('month', inputDOBmonth.value)
								}))
							}}
						/>
					</View>
					<View style={styles.item}>
						<Input
							label={'Day'}
							value={inputDOBday.value}
							placeholder={'DD'}
							autoCorrect={false}
							autoComplete="off"
							keyboardType={'phone-pad'}
							returnKeyType="done"
							error={inputDOBday.error}
							errorText={inputDOBday.errorMessage}
							onChangeText={(text) => {
								setInputDOBday({
									value: formatDOB(text),
									error: false,
									errorMessage: ''
								})
							}}
							onEndEditing={() => {
								setInputDOBday((prev) => ({
									...prev,
									error: hasError('day', inputDOBday.value),
									errorMessage: getErrorMessage('day', inputDOBday.value)
								}))
							}}
						/>
					</View>
				</View>
				<CountryPicker
					selectedCountry={selectedCountry.value}
					onSelect={(value) => {
						setSelectedCountry({
							value: value,
							error: false,
							errorMessage: ''
						})
					}}
					error={selectedCountry.error}
					errorText={'Please select a country'}
				/>
				<Input
					label={'Phone (incl. country code)'}
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
							value: formatPhoneInternational(text),
							error: false,
							errorMessage: ''
						})
					}}
					onEndEditing={() => {
						setInputPhone((prev) => ({
							...prev,
							error: hasError('international-number', stripSpaces(inputPhone.value)),
							errorMessage: getErrorMessage(
								'international-number',
								stripSpaces(inputPhone.value)
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
				<Input
					label={'CPF (optional)'}
					value={inputCPF.value}
					placeholder={'If you have a CPF'}
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
							error: hasError('cpf', inputCPF.value),
							errorMessage: getErrorMessage('cpf', inputCPF.value)
						}))
					}}
				/>
			</ScrollView>
			<View style={styles.footer}>
				<Button
					text="Save"
					fill={true}
					onPress={async () => {
						await handleSubmit()
					}}
				/>
				<Button
					text="Cancel"
					fill={false}
					onPress={() => {
						handleCancel()
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
	footer: {
		width: '100%',
		paddingBottom: 10
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%'
	},
	item: {
		width: '31%'
	}
})
