import React from 'react'
import { StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { View } from '@/components/Themed'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useBaseStore } from '@/store/base'

export default function ConfirmPage() {
	const params = useLocalSearchParams()
	const transaction = JSON.parse(params.transaction as string)

	const createTransaction = useBaseStore((state) => state.createTransaction)
	const setTransactionStatus = useBaseStore((state) => state.setTransactionStatus)
	const card = useBaseStore((state) => state.card)
	const chargeCard = useBaseStore((state) => state.chargeCard)

	const handleConfirm = async () => {
		let dbTransactionID = ''
		try {
			// create DB entry first
			useBaseStore.getState().setLoading(true)
			const dbTransaction = await createTransaction(transaction)
			dbTransactionID = dbTransaction.id
			// now process payment
			if (dbTransaction.status) {
				const paymentResult = await chargeCard(card.id, transaction)
				// error
				if (paymentResult.error) {
					throw new Error('Payment failed: [unknown reason]')
				}
				// success
				else {
					await setTransactionStatus(dbTransactionID, 'success', null)
					await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
					router.push('/(pages)/success')
					useBaseStore.getState().setLoading(false)
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
			useBaseStore.getState().setToast({
				visible: true,
				message: 'Sorry but your payment failed. Please try again'
			})
		}
	}

	const handleCancel = () => {
		router.push('/(tabs)')
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.inputs}>
					<Input label={'Receiver'} value={transaction.receiver} disabled={true} />
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
				<Button text="Cancel" fill={false} onPress={() => handleCancel()} />
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
