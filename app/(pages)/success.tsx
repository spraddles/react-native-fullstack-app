import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { router } from 'expo-router'

import { Text, View } from '@/components/Themed'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
	const handleClose = async () => {
		router.push('/(tabs)')
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Image style={styles.image} source={require('../../assets/images/success.png')} />
				<Text style={styles.text}>Success!</Text>
				<Text style={styles.text}>Your payment has been made.</Text>
			</View>
			<View style={styles.footer}>
				<Button text="Close" fill={true} onPress={async () => await handleClose()} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 50
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
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 50
	},
	footer: {
		width: '100%',
		paddingBottom: 10
	}
})
