import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Fontisto from '@expo/vector-icons/Fontisto'
import { View } from '@/components/Themed'

type SocialButtonProps = {
	onPress: () => void
	type: string
}

export const SocialButton = ({ onPress, type }: SocialButtonProps) => {
	let icon = ''
	let text = ''
	let textColor = ''
	let backgroundColor = ''
	let borderColor = ''

	if (type === 'google') {
		icon = 'google'
		text = 'Google'
		textColor = '#fff'
		backgroundColor = '#DB4437'
		borderColor = '#DB4437'
	}

	if (type === 'apple') {
		icon = 'apple'
		text = 'Apple'
		textColor = '#fff'
		backgroundColor = '#000'
		borderColor = '#000'
	}

	if (type === 'email') {
		icon = 'email'
		text = 'Email'
		textColor = '#000'
		backgroundColor = '#fff'
		borderColor = '#000'
	}

	const styles = StyleSheet.create({
		button: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: backgroundColor,
			paddingTop: 15,
			paddingBottom: 15,
			paddingLeft: 20,
			paddingRight: 20,
			width: '75%',
			marginTop: 15,
			marginBottom: 15,
			borderRadius: 5,
			borderWidth: 2,
			borderStyle: 'solid',
			borderColor: borderColor
		},
		icon: {
			position: 'absolute',
			left: 20,
			backgroundColor: backgroundColor
		},
		text: {
			flex: 1,
			textAlign: 'center',
			color: textColor,
			fontSize: 16,
			fontWeight: '600'
		}
	})

	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<View style={styles.icon}>
				{(type === 'apple' || type === 'google') && (
					<FontAwesome name={icon} size={25} color={textColor} />
				)}
				{type === 'email' && <Fontisto name={icon} size={25} color={textColor} />}
			</View>
			<Text style={styles.text}>{text}</Text>
		</TouchableOpacity>
	)
}
