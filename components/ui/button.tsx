import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type ButtonColor = 'green' | 'black'
type TextColor = 'green' | 'white' | 'black'

type ButtonProps = {
	onPress: () => void
	text: string
	fill?: boolean
	disabled?: boolean
	color?: ButtonColor
	textColor?: TextColor
}

const COLOR_MAP = {
	green: {
		fillBg: '#54d629',
		border: '#54d629',
		textFill: '#000000',
		textNoFill: '#000000'
	},
	black: {
		fillBg: '#000000',
		border: '#000000',
		textFill: '#ffffff',
		textNoFill: '#000000'
	}
} as const

const TEXT_COLOR_MAP: Record<TextColor, string> = {
	green: '#54d629',
	white: '#ffffff',
	black: '#000000'
}

export function Button({
	onPress,
	text,
	fill = true,
	disabled = false,
	color = 'green',
	textColor
}: ButtonProps) {
	const palette = COLOR_MAP[color]

	const buttonStyle = [
		styles.buttonBase,
		{
			backgroundColor: fill ? palette.fillBg : 'transparent',
			borderColor: palette.border
		},
		disabled && styles.buttonDisabled
	]

	const computedTextColor = disabled
		? '#999'
		: textColor
			? TEXT_COLOR_MAP[textColor]
			: fill
				? palette.textFill
				: palette.textNoFill

	const textStyle = [styles.textBase, { color: computedTextColor }]

	return (
		<TouchableOpacity
			style={buttonStyle}
			onPress={onPress}
			disabled={disabled}
			activeOpacity={0.8}
		>
			<Text style={textStyle}>{text}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	buttonBase: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 15,
		borderWidth: 2,
		width: '100%',
		alignItems: 'center',
		marginTop: 20
	},
	buttonDisabled: {
		borderColor: '#ccc',
		backgroundColor: '#ccc'
	},
	textBase: {
		fontSize: 20,
		fontWeight: '600'
	}
})

export default Button
