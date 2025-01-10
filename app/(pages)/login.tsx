import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from '@/components/Themed'

import { router } from 'expo-router'

import { SocialButton } from '@/components/ui/socialButton'

import { googleLogin } from '@/composables/googleLogin'
import { appleLogin } from '@/composables/appleLogin'

export default function LoginPage() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Choose a login method:</Text>
			<SocialButton type={'google'} onPress={async () => await googleLogin()} />
			<SocialButton type={'apple'} onPress={async () => await appleLogin()} />
			<SocialButton type={'email'} onPress={() => router.push('/(pages)/emailLoginForm')} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20
	},
	text: {
		fontSize: 16,
		color: '#666',
		marginBottom: 20
	}
})
