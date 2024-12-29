import { StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { View } from '@/components/Themed'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useBaseStore } from '@/store/base'

export default function ConfirmPage() {
	const { amount, paymentType, pixMethod, pixMethodValue } = useLocalSearchParams()

	const receiver = 'Frederico Jon da Silva'

	const handleConfirm = async () => {
		useBaseStore.getState().setLoading(true)
		console.log('Confirm: ', { amount, paymentType, pixMethod, pixMethodValue })
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
		useBaseStore.getState().setLoading(false)
		useBaseStore.getState().addTransaction({
			id: Math.random().toString(36).substr(2, 9),
			dateTime: new Date().toISOString(),
			amount: parseFloat(amount),
			receiver: receiver,
			paymentType,
			pixMethod,
			pixMethodValue
		})
		router.push('/pages/success')
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
				<Button text="Back" fill={false} onPress={() => router.back()} />
				<Button text="Confirm" onPress={async () => await handleConfirm()} />
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
