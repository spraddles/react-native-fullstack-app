import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { formatCurrency, formatCPF, formatPhone } from '@/composables/inputFormatter'

type TransactionProps = {
	amount: number
	created_at: string
	pix_method: string
	pix_method_value: string
	receiver: string
}

export function Transaction({
	amount,
	created_at,
	pix_method,
	pix_method_value,
	receiver
}: TransactionProps) {
	const date = new Date(created_at).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})
	const time = new Date(created_at).toLocaleTimeString()

	const formatPixMethodValue = (method: string, value: any) => {
		if (method === 'cpf') {
			return formatCPF(value)
		}
		if (method === 'phone') {
			return formatPhone(value)
		}
		return value
	}

	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Text style={styles.receiver}>{receiver}</Text>
				<Text style={styles.amount}>R$ {formatCurrency(Number(amount).toFixed(2))}</Text>
			</View>

			<View style={styles.pixInfo}>
				<Text style={styles.method}>Pix key:</Text>
				<Text style={styles.value}>
					{formatPixMethodValue(pix_method, pix_method_value)}
				</Text>
			</View>

			<Text style={styles.date}>{date}</Text>
			<Text style={styles.time}>{time}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
        paddingTop: 25,
        paddingBottom: 30,
		backgroundColor: '#fff',

		borderBottomWidth: 1,
		borderBottomColor: '#ccc'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	amount: {
		fontSize: 18
	},
	date: {
        marginTop: 5,
		color: '#666'
	},
	receiver: {
		fontSize: 16,
		marginBottom: 5
	},
	pixInfo: {
		flexDirection: 'row',
		gap: 5
	},
	method: {
		color: '#666'
	},
	value: {
		color: '#666'
	},
	time: {
		color: '#999',
		fontSize: 12,
		marginTop: 5
	}
})
