import React, { useLayoutEffect } from 'react'
import { StyleSheet } from 'react-native'

import { router, useLocalSearchParams } from 'expo-router'

import { useNavigation } from '@react-navigation/native'

import { Text, View } from '@/components/Themed'
import { Button } from '@/components/ui/button'

import { useBaseStore } from '@/store/base'

export default function NewUserPage() {
	const { password, method } = useLocalSearchParams()
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
				password: password,
				method: method
			}
		})
	}

	const handleCancel = () => {
		useBaseStore.getState().resetUser()
		router.push('/(pages)')
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.text}>
					We need some more information from you to complete your profile...
				</Text>
			</View>
			<View style={styles.footer}>
				<Button text="Next" fill={true} onPress={() => handleNext()} />
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
