import React from 'react'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'

import { Button } from '@/components/ui/button'
import { View, Text } from '@/components/Themed'

export default function EmptyProfileScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Please setup your user profile before using this app</Text>
			<View style={styles.button}>
				<Button
					text="Next"
					fill={true}
					onPress={() => {
						router.push('/pages/editProfile')
					}}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 50,
		paddingTop: 100
	},
	text: {
		fontSize: 16,
		color: '#666',
		width: '80%',
		textAlign: 'center'
	},
	button: {
		width: '100%',
		marginTop: 20
	}
})
