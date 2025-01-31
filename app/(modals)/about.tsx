import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet, Image, Linking } from 'react-native'
import { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import { Button } from '@/components/ui/button'

import { ExternalLink } from '@/components/ExternalLink'
import { Text, View } from '@/components/Themed'

import Colors from '@/constants/Colors'

export default function ModalScreen() {
	const navigation = useNavigation()

	useLayoutEffect(() => {
		navigation.setOptions({
			title: 'About'
		})
	}, [navigation])

	const handleClick = async () => {
		const email = 'example@email.com'
		try {
			if (Platform.OS === 'ios') {
				await Linking.openURL(`message:${email}`)
			} else {
				await Linking.openURL(`mailto:${email}`)
			}
		} catch (error) {
			console.error('Error opening email:', error)
		}
	}

	return (
		<View style={styles.container}>
			<Image style={styles.image} source={require('../../assets/images/logo.png')} />
			<Text style={styles.body}>
				GlobalPay ® is a simple but powerful app that allows instant funds transfers to
				more than 200 countries around the world. Visit our website for more information
				about
				<ExternalLink style={styles.helpLink} href="https://policies.google.com/privacy">
					<Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
						{' '}
						our legal{' '}
					</Text>
				</ExternalLink>
				policies.
			</Text>
			<Text style={styles.body}>
				Copyright © 2000–2024 GlobalPay Inc. All rights reserved.
			</Text>
			<Text style={styles.versionText}>Version 1.02.367B </Text>
			<Button text="Contact support" fill={false} onPress={handleClick} />
			<Text style={styles.buttonSubText}>
				or email: {process.env.EXPO_PUBLIC_SUPPORT_EMAIL}
			</Text>
			{/* Use a light status bar on iOS to account for the black space above the modal */}
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
		marginBottom: 15
	},
	image: {
		width: '300',
		height: '70',
		marginBottom: 20
	},
	versionText: {
		fontSize: 17,
		color: '#777',
		marginBottom: 70
	},
	buttonSubText: {
		marginTop: 20,
		color: '#888'
	}
})
