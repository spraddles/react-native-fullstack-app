import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { router } from 'expo-router'

import { Text, View } from '@/components/Themed'

export default function SuccessPage() {
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.text}>SIGN UP</Text>
			</View>
			<View style={styles.footer} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 50,
		paddingTop: 100
	},
	text: {
		fontSize: 16,
		color: '#666',
		width: '80%',
		textAlign: 'center'
	},
	image: {
		marginTop: 10,
		marginBottom: 30,
		width: '100%',
		height: 120,
		resizeMode: 'contain'
	},
	content: {
		flex: 1,
		alignItems: 'center'
	},
	footer: {
		width: '100%',
		paddingBottom: 10
	}
})
