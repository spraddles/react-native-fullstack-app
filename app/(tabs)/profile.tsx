import { useState } from 'react'
import { StyleSheet, Image, ScrollView } from 'react-native'

import { Input } from '@/components/ui/input'

import { formatCPF } from '@/composables/formatCPF'
import { formatPhone } from '@/composables/formatPhone'

import { useBaseStore, State } from '@/store/base'

export default function ProfileScreen() {
	const user = useBaseStore((state) => state.user)
	const [inputName, setInputName] = useState(user.name)
	const [inputSurname, setInputSurname] = useState(user.surname)
	const [inputEmail, setInputEmail] = useState(user.email)
	const [inputPhone, setInputPhone] = useState(user.phone)
	const [inputCPF, setInputCPF] = useState(user.cpf)

	// @TODO: update this to handle DB requests
	const handleSubmit = async (field: keyof State['user'], value: string) => {
		useBaseStore.getState().setLoading(true)
		console.log(`saving user ${field}...`)
		useBaseStore.getState().setUser(field, value)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
		useBaseStore.getState().setLoading(false)
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Image style={styles.image} source={require('../../assets/images/profile.png')} />
			<Input
				label={'Name'}
				value={inputName}
				placeholder={'Enter your name'}
				autoCorrect={false}
				autoComplete="off"
				autoCapitalize="words"
				keyboardType={'default'}
				returnKeyType="done"
				onChangeText={setInputName}
				onSubmitEditing={async () => {
					await handleSubmit('name', inputName)
				}}
				error={false}
				errorText={'Name is required'}
			/>
			<Input
				label={'Surname'}
				value={inputSurname}
				placeholder={'Enter your surname'}
				autoCorrect={false}
				autoComplete="off"
				autoCapitalize="words"
				keyboardType={'default'}
				returnKeyType="done"
				onChangeText={setInputSurname}
				onSubmitEditing={async () => {
					await handleSubmit('surname', inputSurname)
				}}
				error={false}
				errorText={'Surname is required'}
			/>
			<Input
				label={'Email'}
				value={inputEmail}
				placeholder={'Enter your email'}
				autoCorrect={false}
				autoComplete="off"
				autoCapitalize="none"
				keyboardType={'email-address'}
				returnKeyType="done"
				onChangeText={setInputEmail}
				onSubmitEditing={async () => {
					await handleSubmit('email', inputEmail)
				}}
				error={false}
				errorText={'Email is required'}
			/>
			<Input
				label={'Phone'}
				value={formatPhone(inputPhone)}
				placeholder={'Enter your phone'}
				autoCorrect={false}
				autoComplete="off"
				keyboardType={'phone-pad'}
				returnKeyType="done"
				onChangeText={(text) => setInputPhone(formatPhone(text))}
				// note: onEndEditing vs. onSubmitEditing for numpad
				onEndEditing={async () => {
					await handleSubmit('phone', inputPhone)
				}}
				error={false}
				errorText={'Phone is required'}
			/>
			<Input
				label={'CPF'}
				value={formatCPF(inputCPF)}
				placeholder={'Enter your CPF'}
				autoCorrect={false}
				autoComplete="off"
				keyboardType={'number-pad'}
				returnKeyType="done"
				onChangeText={(text) => setInputCPF(formatCPF(text))}
				// note: onEndEditing vs. onSubmitEditing for numpad
				onEndEditing={async () => {
					await handleSubmit('cpf', inputCPF)
				}}
				error={false}
				errorText={'CPF is required'}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
		padding: 35
	},
	image: {
		padding: 20,
		width: '200',
		height: '200',
		textAlign: 'center'
	}
})
