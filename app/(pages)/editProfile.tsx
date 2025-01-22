import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'

import { router } from 'expo-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { validateInput } from '@/composables/inputValidator'
import {
	stripSpaces,
	formatPhoneInternational,
	formatPassport,
	formatCPF,
	formatDOB
} from '@/composables/inputFormatter'
import { updateUserMeta } from '@/composables/userMethods'

import { useBaseStore } from '@/store/base'

import { supabase } from '@/supabase/connect'

export default function EditProfileScreen() {
	const blankErrorText = 'Please enter a value'

	const user = useBaseStore((state) => state.user)
	const setUser = useBaseStore((state) => state.setUser)

	const initialState = (value: string) => ({
		value: value,
		error: !value,
		errorMessage: value ? '' : blankErrorText
	})

	const [inputName, setInputName] = useState(initialState(user.name))
	const [inputSurname, setInputSurname] = useState(initialState(user.surname))
	const [inputDOByear, setInputDOByear] = useState(initialState(user.dob.year))
	const [inputDOBmonth, setInputDOBmonth] = useState(initialState(user.dob.month))
	const [inputDOBday, setInputDOBday] = useState(initialState(user.dob.day))
	const [inputPhone, setInputPhone] = useState(initialState(user.phone))
	const [inputPassport, setInputPassport] = useState(initialState(user.passport))
	const [inputCPF, setInputCPF] = useState(initialState(user.cpf))

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
			const updatedUser = {
				...user,
				name: inputName.value,
				surname: inputSurname.value,
				phone: inputPhone.value,
				passport: inputPassport.value,
				cpf: inputCPF.value,
				dob: {
					...user.dob,
					year: inputDOByear.value,
					month: inputDOBmonth.value,
					day: inputDOBday.value
				}
			}
			setUser(updatedUser)
			// database: update user meta
			const supabaseUser = await supabase.auth.getUser()
			const supabaseUserID = supabaseUser?.data?.user?.id
			const updateUserMetaResponse = await updateUserMeta(supabaseUserID, {
				user_id: supabaseUserID,
				name: inputName.value,
				surname: inputSurname.value,
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
					message: "We can't update your account now sorry"
				})
			} else {
				useBaseStore.getState().setLoading(false)
				router.push('/(tabs)/profile')
			}
		} catch (error) {
			console.log('editProfileScreen unknown error: ', error)
			useBaseStore.getState().setLoading(false)
			useBaseStore.getState().setToast({
				visible: true,
				message: "We can't update your account now sorry"
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
					value={inputCPF.value ? formatCPF(inputCPF.value) : inputCPF.value}
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
					disabled={
						inputName.error ||
						inputSurname.error ||
						inputPhone.error ||
						inputPassport.error ||
						inputDOByear.error ||
						inputDOBmonth.error ||
						inputDOBday.error
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
