import { Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'

import { View } from '@/components/Themed'
import { Button } from '@/components/ui/button'

export default function ConfirmPage() {
	return (
		<View style={styles.container}>
			<Text>Summary Screen</Text>
			<Button text="Back" onPress={() => router.back()} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 50,
		paddingTop: 100
	}
})
