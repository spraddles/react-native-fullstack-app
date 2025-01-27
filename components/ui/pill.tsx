import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function Pill({ text }) {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{text}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 0,
		padding: 0,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 5
	},
	text: {
		fontSize: 11,
		borderRadius: 50,
		color: '#fff',
		backgroundColor: '#ccc',
		paddingLeft: 6,
		paddingRight: 6,
		paddingTop: 0.3,
		paddingBottom: 0.3
	}
})
