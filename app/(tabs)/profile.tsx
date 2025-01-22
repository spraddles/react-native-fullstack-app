import React, { useEffect } from 'react'
import { StyleSheet, Image, ScrollView, View } from 'react-native'

import { router } from 'expo-router'

import { useBaseStore } from '@/store/base'

import { fetchUserProfile } from '@/composables/userMethods'

import { Text } from '@/components/Themed'
import { Button } from '@/components/ui/button'

export default function ProfileScreen() {
	const user = useBaseStore((state) => state.getUser())

	const handleClose = async () => {
		useBaseStore.getState().setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
		useBaseStore.getState().setLoading(false)
		router.push('/(pages)/editProfile')
	}

	useEffect(() => {
		const getProfileData = async () => {
			try {
				const profileData = await fetchUserProfile()
				useBaseStore.getState().setUser(profileData)
			} catch (error) {
				console.error('Error fetching profile:', error)
			}
		}
		getProfileData()
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Image style={styles.image} source={require('../../assets/images/profile.png')} />
				<Text style={styles.title}>
					{user.name} {user.surname}
				</Text>
			</View>

			<ScrollView style={styles.scrollView}>
				<View style={styles.bottom}>
					<Text style={styles.label}>{'Email'}</Text>
					<Text style={styles.text}>{user.email}</Text>
					<Text style={styles.label}>{'Phone'}</Text>
					<Text style={styles.text}>{user.phone}</Text>
					<Text style={styles.label}>{'Passport'}</Text>
					<Text style={styles.text}>{user.passport}</Text>
					<Text style={styles.label}>{'CPF'}</Text>
					<Text style={styles.text}>{user.cpf}</Text>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Button text="Edit" fill={true} onPress={async () => await handleClose()} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 50
	},
	top: {
		backgroundColor: '#fff',
		width: '100%',
		alignItems: 'center'
	},
	image: {
		padding: 10,
		width: 150,
		height: 150,
		textAlign: 'center'
	},
	title: {
		marginTop: 15,
		marginBottom: 25,
		fontSize: 25
	},
	scrollView: {
		flex: 1,
		width: '100%'
	},
	label: {
		fontSize: 13,
		marginTop: 10,
		marginBottom: 8,
		color: '#333'
	},
	text: {
		fontSize: 17,
		marginBottom: 20,
		color: '#000'
	},
	bottom: {
		width: '100%',
		backgroundColor: '#fff',
		paddingHorizontal: 20
	},
	footer: {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})
