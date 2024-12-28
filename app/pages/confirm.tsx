import { StyleSheet } from 'react-native'
import { router } from 'expo-router'

import { View } from '@/components/Themed'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useBaseStore } from '@/store/base'

export default function ConfirmPage() {
	const handleConfirm = async () => {
		useBaseStore.getState().setLoading(true)
		console.log('Confirm')
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
		useBaseStore.getState().setLoading(false)
		router.push('/pages/success')
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.inputs}>
					<Input label={'Reciever'} value={'Frederico Jon da Silva'} disabled={true} />
				</View>
				<View style={styles.inputs}>
					<Input label={'Amount'} value={'2,550.12'} disabled={true} />
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
