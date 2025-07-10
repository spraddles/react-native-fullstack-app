import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet, Image } from 'react-native'
import * as WebBrowser from 'expo-web-browser'

import { Button } from '@/components/ui/button'

import { ExternalLink } from '@/components/ExternalLink'
import { Text, View } from '@/components/Themed'

import Colors from '@/constants/Colors'

export default function ModalScreen() {
	const handleClick = async () => {
		const url = 'https://gringopay.app/contact'
		try {
			if (Platform.OS !== 'web') {
				await WebBrowser.openBrowserAsync(url)
			} else {
				window.open(url, '_blank', 'noopener,noreferrer')
			}
		} catch (error) {
			console.error('Error opening support page:', error)
		}
	}

	return (
		<View style={styles.container}>
			<Image style={styles.image} source={require('../../assets/images/logo-light.png')} />

			<Text style={styles.body}>
				{process.env.EXPO_PUBLIC_APP_NAME} ® is a simple but powerful app that allows
				instant Pix transfers from abroad into Brazil. Now you can truly pay like a local!
				Visit our website for more information about
				<ExternalLink href="https://gringopay.app/user-agreement">
					<Text lightColor={Colors.light.tint}> our legal </Text>
				</ExternalLink>
				policies.
			</Text>

			<Text style={styles.body}>
				Copyright © 2000–2025 {process.env.EXPO_PUBLIC_APP_NAME} Inc. All rights reserved.
			</Text>

			<Button text="Contact support" color="black" fill={false} onPress={handleClick} />

			{/* Use a light status bar on iOS to account for the black space above the modal */}
			<Text style={styles.versionText}>Version 1.02.367B </Text>
			<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	body: {
		fontSize: 20,
		textAlign: 'center',
		marginBottom: 30
	},
	image: {
		width: 300,
		height: 70,
		marginBottom: 20
	},
	versionText: {
		fontSize: 17,
		color: '#777',
		marginTop: 20,
		marginBottom: 70
	}
})
