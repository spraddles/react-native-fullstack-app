import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { ApplePay } from '@/composables/applePay/index'

import { View } from '@/components/Themed'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useBaseStore } from '@/store/base'

export default function ConfirmPage() {
	const params = useLocalSearchParams()
	const transaction = JSON.parse(params.transaction as string)

	const createTransaction = useBaseStore((state) => state.createTransaction)
	const setTransactionStatus = useBaseStore((state) => state.setTransactionStatus)

	const [error, setError] = useState('')
	const [response, setResponse] = useState<PaymentResponse['details']>()

	const handleConfirm = async () => {
		let dbTransactionID = ''
		try {
			useBaseStore.getState().setLoading(true)
			const dbTransaction = await createTransaction(transaction)
			dbTransactionID = dbTransaction.data.data.id

			if (dbTransaction.status) {
				const { processPayment } = ApplePay()
				const paymentResult = await processPayment(setError, setResponse)

				// error
				if (paymentResult.error) {
					throw new Error('Payment failed: [unknown reason]')
				}
				// success
				else {
					await setTransactionStatus(dbTransactionID, 'success', null)
					useBaseStore.getState().setLoading(false)
					router.push('/(tabs)')
				}
			}
		} catch (err) {
			// payment fail
			console.log('Payment failed:', err)
			if (dbTransactionID) {
				await setTransactionStatus(dbTransactionID, 'fail', err)
			}
			await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
			useBaseStore.getState().setLoading(false)
			router.push('/(tabs)')
			useBaseStore.getState().setToast({
				visible: true,
				message: 'Sorry but your payment failed. Please try again'
			})
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.inputs}>
					<Input label={'Reciever'} value={transaction.receiver} disabled={true} />
				</View>
				<View style={styles.inputs}>
					<Input label={'Amount'} value={transaction.amount} disabled={true} />
				</View>
				<View style={styles.inputs}>
					<Input label={'Currency'} value={'Brazilian reals'} disabled={true} />
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
