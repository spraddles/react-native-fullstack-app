import React, { useEffect } from 'react'
import { StyleSheet, Image, ScrollView, View } from 'react-native'

import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { useBaseStore } from '@/store/base'

import { Text } from '@/components/Themed'
import { Button } from '@/components/ui/button'
import { Accordion } from '@/components/ui/accordion'

import { formatCPF } from '@/composables/inputFormatter'
import { fetchUserProfile, getCountry } from '@/composables/userMethods'
import { logout } from '@/composables/auth'

export default function ProfileScreen() {
	const user = useBaseStore((state) => state.getUser())
	const setUser = useBaseStore((state) => state.setUser)

	const handleClose = async () => {
		useBaseStore.getState().setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
		useBaseStore.getState().setLoading(false)
		router.push('/(pages)/editProfile')
	}

	const handleLogout = async () => {
		return await logout('You have now logged out')
	}

	useEffect(() => {
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
		getProfileData()
	}, [])

	return (
		<View style={styles.container}>
			<ScrollView style={styles.content}>
				<View style={styles.top}>
					<Image
						style={styles.image}
						source={require('../../assets/images/profile.png')}
					/>
					<Text style={styles.title}>
						{user?.name} {user?.surname}
					</Text>
				</View>
				<View style={styles.bottom}>
					<Accordion
						title="Personal"
						icon={<Ionicons name="person-outline" size={20} color="#666" />}
					>
						<View>
							<Text style={styles.text}>
								<Text style={styles.label}>Name:</Text>{' '}
								<Text style={styles.value}>{user?.name}</Text>
							</Text>
							<Text style={styles.text}>
								<Text style={styles.label}>Surname:</Text>{' '}
								<Text style={styles.value}>{user?.surname}</Text>
							</Text>
							<Text style={styles.text}>
								<Text style={styles.label}>Date of Birth:</Text>{' '}
								<Text style={styles.value}>
									{user?.dob?.year}/{user?.dob?.month}/{user?.dob?.day}
								</Text>
							</Text>
							<Text style={styles.text}>
								<Text style={styles.label}>Nationality:</Text>{' '}
								<Text style={styles.value}>{user?.country?.demonym}</Text>
							</Text>
						</View>
					</Accordion>
					<Accordion
						title="Contact"
						icon={<Ionicons name="call-outline" size={20} color="#666" />}
					>
						<View>
							<Text style={styles.text}>
								<Text style={styles.label}>Email:</Text>{' '}
								<Text style={styles.value}>{user?.email}</Text>
							</Text>
							<Text style={styles.text}>
								<Text style={styles.label}>Phone:</Text>{' '}
								<Text style={styles.value}>{user?.phone}</Text>
							</Text>
						</View>
					</Accordion>
					<Accordion
						title="Identification"
						icon={<Ionicons name="card-outline" size={20} color="#666" />}
					>
						<View>
							<Text style={styles.text}>
								<Text style={styles.label}>CPF:</Text>{' '}
								<Text style={styles.value}>
									{user?.cpf ? formatCPF(user?.cpf) : '(none)'}
								</Text>
							</Text>
							<Text style={styles.text}>
								<Text style={styles.label}>Passport:</Text>{' '}
								<Text style={styles.value}>{user?.passport}</Text>
							</Text>
						</View>
					</Accordion>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Button text="Edit" fill={true} onPress={async () => await handleClose()} />
				<Button text="Logout" fill={false} onPress={async () => await handleLogout()} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 20,
		paddingBottom: 50,
		paddingLeft: 50,
		paddingRight: 50
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
		marginTop: 10,
		marginBottom: 10,
		fontSize: 25
	},
	content: {
		flex: 1,
		width: '100%'
	},
	text: {
		fontSize: 16,
		marginBottom: 10
	},
	label: {
		color: '#666',
		fontWeight: '700',
		fontSize: 14
	},
	value: {
		color: '#000'
	},
	bottom: {
		width: '100%',
		marginTop: 20,
		backgroundColor: '#fff'
	},
	footer: {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})
