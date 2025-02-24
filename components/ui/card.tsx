import React from 'react'
import { Image, StyleSheet, Dimensions } from 'react-native'
import { View, Text } from '@/components/Themed'

type CardProps = {
	fullName: string
	cardType: string
	lastFourDigits: string
}

export function Card({ fullName, cardType, lastFourDigits }: CardProps) {
	return (
		<View style={styles.card}>
			<View style={styles.contentContainer}>
				<Text style={styles.cardNumber}>
					<Text style={styles.stars}>•••• •••• ••••</Text>
					<Text style={styles.digits}> {lastFourDigits}</Text>
				</Text>
			</View>

			<View style={styles.bottomContainer}>
				<Text style={styles.name}>{fullName.toUpperCase()}</Text>
				{(cardType === 'mastercard' || cardType === 'Mastercard') && (
					<Image
						style={styles.image}
						source={require('../../assets/images/mastercard.png')}
						resizeMode="contain"
					/>
				)}
				{(cardType === 'visa' || cardType === 'Visa') && (
					<Image
						style={styles.image}
						source={require('../../assets/images/visa.png')}
						resizeMode="contain"
					/>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 20,
		paddingTop: 35,
		paddingBottom: 25,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: '#25282b'
	},
	contentContainer: {
		width: '100%',
		backgroundColor: '#25282b'
	},
	bottomContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#25282b'
	},
	cardNumber: {
		width: '100%',
		backgroundColor: '#25282b',
		color: '#fff',
		paddingBottom: 20,
		textAlign: 'center'
	},
	stars: {
		fontSize: 32,
		color: '#fff',
		backgroundColor: '#25282b',
		letterSpacing: 2
	},
	digits: {
		fontSize: 23,
		color: '#fff',
		backgroundColor: '#25282b'
	},
	name: {
		backgroundColor: '#25282b',
		color: '#fff'
	},
	image: {
		width: 60,
		height: 40,
		backgroundColor: '#25282b'
	}
})
