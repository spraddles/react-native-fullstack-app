import React, { useEffect } from 'react'
import { StyleSheet, Image, View } from 'react-native'

import { router } from 'expo-router'

import { useBaseStore } from '@/store/base'

import { Text } from '@/components/Themed'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ProfileScreen() {
	const getEmptyProfileState = useBaseStore((state) => state.getEmptyProfileState())
	const user = useBaseStore((state) => state.getUser())

	const handleClose = async () => {
		useBaseStore.getState().setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 2000)) // for demo purposes
		useBaseStore.getState().setLoading(false)
		router.push('/pages/editProfile')
	}

	useEffect(() => {
		if (getEmptyProfileState === true) {
			router.push('/pages/emptyProfile')
		}
	}, [getEmptyProfileState])

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<View style={styles.top}>
					<Image
						style={styles.image}
						source={require('../../assets/images/profile.png')}
					/>
					<Text style={styles.title}>
						{user.name.value} {user.surname.value}
					</Text>
				</View>
				<View style={styles.bottom}>
					<Input label={'Email'} value={user.email.value} disabled />
					<Input label={'Phone'} value={user.phone.value} disabled />
					<Input label={'CPF'} value={user.cpf.value} disabled />
				</View>
			</View>
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
	content: {
		flex: 1,
		alignItems: 'center'
	},
	image: {
		padding: 10,
		width: '150',
		height: '150',
		textAlign: 'center'
	},
	top: {
		backgroundColor: '#fff',
		width: '100%',
		alignItems: 'center'
	},
	title: {
		marginTop: 15,
		marginBottom: 25,
		fontSize: 25
	},
	bottom: {
		width: '100%',
		backgroundColor: '#fff'
	},
	footer: {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto'
	}
})
