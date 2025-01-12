import React from 'react'
import { StyleSheet } from 'react-native'

import { router, useLocalSearchParams } from 'expo-router'

import { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import { Text } from '@/components/Themed'

import { View } from '@/components/Themed'
import { Button } from '@/components/ui/button'

export default function NewUserPage() {
	const { password } = useLocalSearchParams()
	const navigation = useNavigation()

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerBackVisible: false
		})
	}, [navigation])

	const handleNext = () => {
		router.push({
			pathname: '/(pages)/newUserEditProfile',
			params: {
				password: password
			}
		})
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.text}>
					To get started, we need some more information from you to complete your
					profile...
				</Text>
			</View>
			<View style={styles.footer}>
				<Button text="Next" fill={true} onPress={() => handleNext()} />
				<Button text="Cancel" fill={false} onPress={() => router.push('/(pages)')} />
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
