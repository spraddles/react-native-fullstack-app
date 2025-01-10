import React from 'react'
import { View, TextInput, Text, StyleSheet, NumberInputProps } from 'react-native'

type InputProps = NumberInputProps & {
	label?: string
	value: string
	error?: boolean
	errorText?: string
	placeholder?: string
	onChangeText?: (text: string) => void
}

export function NumberInput({
	label,
	value,
	error,
	errorText,
	placeholder,
	onChangeText,
	...props
}: InputProps) {
	const handleChangeText = (text: string) => {
		const cleanedText = text.replace(/[^0-9.]/g, '')
		if (onChangeText) {
			onChangeText(cleanedText)
		}
	}

	return (
		<View style={[styles.container]}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View style={styles.inputContainer}>
				<View style={styles.inputWrapper}>
					<Text style={styles.currencySymbol}>R$</Text>
					<TextInput
						{...props}
						style={[styles.input, error && styles.inputError]}
						value={value}
						placeholder={placeholder}
						placeholderTextColor="#999"
						onChangeText={handleChangeText}
					/>
				</View>
				<Text style={styles.flag}>🇧🇷</Text>
			</View>
			{error && errorText && <Text style={styles.errorMessage}>{errorText}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%'
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative'
	},
	inputWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		backgroundColor: '#fff'
	},
	label: {
		fontSize: 13,
		marginBottom: 8,
		color: '#333'
	},
	currencySymbol: {
		fontSize: 24,
		color: '#999',
		paddingLeft: 10,
		paddingRight: 10
	},
	input: {
		flex: 1,
		padding: 20,
		fontSize: 30,
		letterSpacing: 3,
		paddingLeft: 0
	},
	inputError: {
		borderColor: '#ff3333'
	},
	errorMessage: {
		color: '#ff3333',
		fontSize: 14,
		marginTop: 4
	},
	flag: {
		position: 'absolute',
		right: 18,
		fontSize: 24
	}
})
