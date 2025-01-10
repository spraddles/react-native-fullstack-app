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
				fill === false && styles.noFillButton,
				disabled && styles.buttonDisabled
			]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text
				style={[
					styles.text,
					fill === false && styles.noFillText,
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
		borderWidth: 2,
		borderColor: '#209ff7',
		width: '100%',
		alignItems: 'center',
		marginTop: 20
	},
	noFillButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: '#209ff7'
	},
	buttonDisabled: {
		borderColor: '#ccc',
		backgroundColor: '#ccc'
	},
	text: {
		color: '#fff',
		fontSize: 20,
		fontWeight: '600'
	},
	noFillText: {
		color: '#209ff7'
	},
	textDisabled: {
		color: '#999'
	}
})
