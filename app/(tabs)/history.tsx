import React, { useEffect } from 'react'
import { StyleSheet, ScrollView } from 'react-native'

import { View, Text } from '@/components/Themed'
import { Transaction } from '@/components/ui/transaction'

import { useBaseStore } from '@/store/base'

export default function HistoryScreen() {
	const transactions = useBaseStore((state) => state.transactions)
	const fetchTransactions = useBaseStore((state) => state.fetchTransactions)

	useEffect(() => {
		;(async () => {
			await fetchTransactions()
		})()
	}, [])

	if (!transactions || transactions.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>No transactions yet</Text>
			</View>
		)
	}
	if (transactions || transactions.length > 0) {
		return (
			<View style={styles.container}>
				<ScrollView style={styles.list}>
					{transactions.map((transaction) => (
						<Transaction key={transaction.id} {...transaction} />
					))}
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 30
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyText: {
		fontSize: 16,
		color: '#666'
	},
	list: {
		width: '100%'
	}
})
