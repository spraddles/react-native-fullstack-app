import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type ButtonProps = {
	onPress: () => void
	text: string
	variant?: 'primary' | 'secondary'
	disabled?: boolean
}

export function Button({ onPress, text, variant = 'primary', disabled }: ButtonProps) {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				variant === 'secondary' && styles.buttonSecondary,
				disabled && styles.buttonDisabled
			]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text
				style={[
					styles.text,
					variant === 'secondary' && styles.textSecondary,
					disabled && styles.textDisabled
				]}
			>
				{text}
			</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#209ff7',
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 15,
		width: '100%',
		alignItems: 'center'
	},
	buttonSecondary: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#007AFF'
	},
	buttonDisabled: {
		backgroundColor: '#ccc'
	},
	text: {
		color: '#fff',
		fontSize: 20,
		fontWeight: '600'
	},
	textSecondary: {
		color: '#007AFF'
	},
	textDisabled: {
		color: '#999'
	}
})
