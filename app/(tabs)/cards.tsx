import React, { useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet } from 'react-native'

import { router } from 'expo-router'

import { useBaseStore } from '@/store/base'

import { fetchUserProfile, getCountry } from '@/composables/userMethods'

import { View, Text } from '@/components/Themed'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CardsScreen() {
	const setCard = useBaseStore((state) => state.setCard)
	const resetCard = useBaseStore((state) => state.resetCard)
	const fetchCard = useBaseStore((state) => state.fetchCard)
	const card = useBaseStore((state) => state.card)
	const setUser = useBaseStore((state) => state.setUser)

	const getProfileData = async () => {
		try {
			const profileData = await fetchUserProfile()
			if (profileData) {
				const updatedUser = {
					id: profileData.user_id,
					name: profileData.name,
					surname: profileData.surname,
					country: getCountry(profileData.country),
					email: profileData.email,
					phone: profileData.phone,
					passport: profileData.passport,
					cpf: profileData.cpf,
					has_onboarded: profileData.has_onboarded,
					dob: {
						year: profileData.dob_year,
						month: profileData.dob_month,
						day: profileData.dob_day
					}
				}
				setUser(updatedUser)
			}
		} catch (error) {
			console.error('getProfileData error:', error)
		}
	}

	useFocusEffect(
		useCallback(() => {
			const getCard = async () => {
				try {
					useBaseStore.getState().setLoading(true)
					await getProfileData()
					await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
					const cardData = await fetchCard()
					// card found
					if (cardData.data) {
						setCard(cardData.data)
						// reset state if existing card was removed
					} else {
						resetCard()
					}
					useBaseStore.getState().setLoading(false)
				} catch (error) {
					console.log('getCard error: ', error)
				} finally {
					useBaseStore.getState().setLoading(false)
				}
			}
			getCard()
		}, [])
	)

	const handleAddCard = async () => {
		useBaseStore.getState().setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
		useBaseStore.getState().setLoading(false)
		router.push('/(pages)/addCard')
	}

	if (!card.last4digits) {
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
	if (card.last4digits) {
		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<Card cardType={card.flag} lastFourDigits={card.last4digits} />
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
