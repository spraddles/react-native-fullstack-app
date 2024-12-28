import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type ButtonProps = {
	onPress: () => void
	text: string
	fill?: boolean
	disabled?: boolean
}

export function Button({ onPress, text, fill = true, disabled }: ButtonProps) {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				fill === false && styles.buttonFilled,
				disabled && styles.buttonDisabled
			]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text
				style={[
					styles.text,
					fill === false && styles.textFilled,
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
		alignItems: 'center',
		marginTop: 20
	},
	buttonFilled: {
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
	textFilled: {
		color: '#007AFF'
	},
	textDisabled: {
		color: '#999'
	}
})
