import React from 'react'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'

import { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import { Text, View } from '@/components/Themed'

import { Button } from '@/components/ui/button'

export default function NewUserAddCard() {
	const navigation = useNavigation()

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerBackVisible: false
		})
	}, [navigation])

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.text}>
					Ok great, now lets add your credit card for payments...
				</Text>
			</View>
			<View style={styles.footer}>
				<Button
					text="Add card"
					fill={true}
					onPress={() => router.push('/(pages)/addCard')}
				/>
				<Button
					text="Setup later"
					fill={false}
					onPress={() => router.push('/(pages)/newUserProfileComplete')}
				/>
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
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center'
	},
	footer: {
		width: '100%',
		paddingBottom: 10
	}
})
