import React from 'react'
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native'

type InputProps = TextInputProps & {
	label?: string
	value?: string
	error?: boolean
	errorText?: string
	containerStyle?: object
}

export function Input({
	label,
	value,
	error = false,
	errorText,
	placeholder,
	containerStyle,
	...props
}: InputProps) {
	return (
		<View style={[styles.container, containerStyle]}>
			{label && <Text style={styles.label}>{label}</Text>}
			<TextInput
				style={[styles.input, error && styles.errorInput]}
				value={value}
				placeholder={!value ? placeholder : undefined}
				placeholderTextColor="#999"
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
		fontSize: 16,
		backgroundColor: '#fff'
	},
	errorInput: {
		borderColor: '#ff3333'
	},
	errorText: {
		color: '#ff3333',
		fontSize: 14,
		marginTop: 4
	}
})
