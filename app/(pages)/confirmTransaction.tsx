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
	const fees = JSON.parse(params.fees as string)

	const createTransaction = useBaseStore((state) => state.createTransaction)
	const updateTransaction = useBaseStore((state) => state.updateTransaction)
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
				if (!paymentResult.status) {
					throw new Error('Payment failed: [unknown reason]')
				}
				// success
				else {
					const updateTransactionObject = {
						id: dbTransactionID,
						status: 'success',
						message: null,
						card_transaction_id: paymentResult.data.card_transaction_id,
						our_fee: fees.our_fee,
						total_fees: fees.total_fee
					}
					await updateTransaction(updateTransactionObject)
					await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
					router.push('/(pages)/success')
					useBaseStore.getState().setLoading(false)
				}
			}
		} catch (error) {
			// payment fail
			console.log('Payment failed:', error)
			if (dbTransactionID) {
				await updateTransaction(dbTransactionID, 'fail', error, null)
				await updateTransaction({
					id: dbTransactionID,
					status: 'fail',
					message: error,
					card_transaction_id: null,
					our_fee: null,
					total_fees: null
				})
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
					<Input label={'Transfer'} value={transaction.amount} disabled={true} />
				</View>
				<View style={styles.inputs}>
					<Input
						label={'Fees'}
						value={Number(fees.total_fee).toFixed(2)}
						disabled={true}
					/>
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
