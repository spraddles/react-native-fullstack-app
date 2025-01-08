import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { ApplePay } from '@/composables/applePay/index'

import { View } from '@/components/Themed'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useBaseStore } from '@/store/base'

export default function ConfirmPage() {
	const { amount, paymentType, pixMethod, pixMethodValue } = useLocalSearchParams()

	const [error, setError] = useState('')
	const [response, setResponse] = useState<PaymentResponse['details']>()

	useEffect(() => {
		setError('')
		setResponse(undefined)
	}, [setError, setResponse])

	const receiver = 'Frederico Jon da Silva'

	const handleConfirm = async () => {
		console.log('handleConfirm')

		const { processPayment } = ApplePay()

		try {
			const paymentDetails = await processPayment(setError, setResponse)
			// payment error (dev testing)
			if (paymentDetails.error === true) {
				console.log('payment error')
				await new Promise((resolve) => setTimeout(resolve, 1000))
				useBaseStore
					.getState()
					.setToast({ visible: true, message: 'Sorry, but your payment failed' })
			}
			// payment success
			else {
				console.log('Payment successful:', paymentDetails)
				// save details to server
				useBaseStore.getState().setLoading(true)
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
				useBaseStore.getState().addTransaction({
					id: Math.random().toString(36).substr(2, 9),
					dateTime: new Date().toISOString(),
					amount: parseFloat(amount),
					receiver: receiver,
					paymentType,
					pixMethod,
					pixMethodValue
				})
				useBaseStore.getState().setLoading(false)
				router.push('/(pages)/success')
			}
		} catch (error) {
			// payment fail
			console.log('Payment failed:', error)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.inputs}>
					<Input label={'Reciever'} value={receiver} disabled={true} />
				</View>
				<View style={styles.inputs}>
					<Input label={'Amount'} value={amount} disabled={true} />
				</View>
				<View style={styles.inputs}>
					<Input label={'Currency'} value={'Brazillian reals'} disabled={true} />
				</View>
			</View>
			<View style={styles.footer}>
				<Button text="Confirm" onPress={async () => await handleConfirm()} />
				<Button text="Back" fill={false} onPress={() => router.back()} />
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
		marginBottom: 10
	},
	footer: {
		width: '100%',
		paddingBottom: 10
	}
})
