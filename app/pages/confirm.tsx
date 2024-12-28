import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'

import { View } from '@/components/Themed'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ConfirmPage() {
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
				<Button text="Confirm" onPress={() => router.back()} />
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
