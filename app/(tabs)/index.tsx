import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import { View } from '@/components/Themed'
import { Tabs } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/numberInput'

import { formatCurrency } from '@/composables/formatCurrency'
import { formatCPF } from '@/composables/formatCPF'
import { formatPhone } from '@/composables/formatPhone'

export default function TabOneScreen() {
	const [currentTab, setCurrentTab] = useState('cpf')
	const [currencyInput, setCurrencyInput] = useState('')

	const [inputCPF, setInputCPF] = useState('')
	const [inputPhone, setInputPhone] = useState('')
	const [inputEmail, setInputEmail] = useState('')

	return (
		<View style={styles.container}>
			<View style={styles.inputs}>
				<NumberInput
					label={'R $'}
					value={currencyInput}
					placeholder={'0.00'}
					autoCorrect={false}
					autoComplete="off"
					autoCapitalize="none"
					keyboardType={'numeric'}
					returnKeyType="done"
					onChangeText={(text) => setCurrencyInput(formatCurrency(text))}
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
					onTabChange={setCurrentTab}
				/>
			</View>
			<View style={styles.inputs}>
				{currentTab === 'cpf' ? (
					<Input
						label={'CPF'}
						value={inputCPF}
						placeholder={'Enter CPF'}
						autoCorrect={false}
						autoComplete="off"
						keyboardType={'number-pad'}
						returnKeyType="done"
						onChangeText={(text) => setInputCPF(formatCPF(text))}
						error={false}
						errorText={'CPF is required'}
					/>
				) : currentTab === 'phone' ? (
					<Input
						label={'Phone'}
						value={inputPhone}
						placeholder={'Enter phone'}
						autoCorrect={false}
						autoComplete="off"
						keyboardType={'phone-pad'}
						returnKeyType="done"
						onChangeText={(text) => setInputPhone(formatPhone(text))}
						error={false}
						errorText={'Phone is required'}
					/>
				) : currentTab === 'email' ? (
					<Input
						label={'Email'}
						value={inputEmail}
						placeholder={'Enter email'}
						autoCorrect={false}
						autoComplete="off"
						autoCapitalize="none"
						keyboardType={'email-address'}
						returnKeyType="done"
						onChangeText={setInputEmail}
						error={false}
						errorText={'Email is required'}
					/>
				) : null}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		padding: 50
	},
	inputs: {
		width: '100%',
		marginBottom: 40
	}
})
