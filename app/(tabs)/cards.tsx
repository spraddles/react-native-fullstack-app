import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'

import { useBaseStore } from '@/store/base'

import { View, Text } from '@/components/Themed'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CardsScreen() {
	const setCard = useBaseStore((state) => state.setCard)
	const fetchCard = useBaseStore((state) => state.fetchCard)
	const card = useBaseStore((state) => state.card)
	const user = useBaseStore((state) => state.user)

	useEffect(() => {
		const getCard = async () => {
			try {
				const cardData = await fetchCard()
				setCard(cardData)
			} catch (error) {
				console.log('getCard error: ', error)
			}
		}
		getCard()
	}, [])

	const handleAddCard = async () => {
		useBaseStore.getState().setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
		useBaseStore.getState().setLoading(false)
		router.push('/(pages)/addCard')
	}

	if (!card) {
		return (
			<View style={styles.container}>
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No cards have been added</Text>
				</View>
				<View style={styles.footer}>
					<Button
						text="Add card"
						fill={true}
						onPress={async () => await handleAddCard()}
					/>
				</View>
			</View>
		)
	}
	if (card) {
		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<Card
						fullName={user.name + ' ' + user.surname}
						cardType={'Visa'}
						lastFourDigits={'5678'}
					/>
				</View>
				<View style={styles.footer}>
					<Button
						text="Change card"
						fill={true}
						onPress={async () => await handleAddCard()}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 50
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyText: {
		fontSize: 16,
		color: '#666'
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'top',
		marginBottom: 50
	},
	footer: {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})
