import React from 'react'
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native'

type InputProps = TextInputProps & {
	label?: string
	value?: string
	error?: boolean
	errorText?: string
	containerStyle?: object
	disabled?: boolean
}

export function Input({
	label,
	value,
	error = false,
	errorText,
	placeholder,
	containerStyle,
	disabled = false,
	...props
}: InputProps) {
	return (
		<View style={[styles.container, containerStyle]}>
			{label && <Text style={styles.label}>{label}</Text>}
			<TextInput
				style={[styles.input, error && styles.errorInput, disabled && styles.disabledInput]}
				value={value}
				placeholder={!value ? placeholder : undefined}
				placeholderTextColor="#aaa"
				editable={!disabled}
				{...props}
			/>
			{error && errorText && <Text style={styles.errorText}>{errorText}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBottom: 16
	},
	label: {
		fontSize: 13,
		marginBottom: 8,
		color: '#333'
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 12,
		fontSize: 18,
		backgroundColor: '#fff'
	},
	errorInput: {
		borderColor: '#ff3333'
	},
	errorText: {
		color: '#ff3333',
		fontSize: 14,
		marginTop: 4
	},
	disabledInput: {
		backgroundColor: '#fff',
		color: '#999'
	}
})
