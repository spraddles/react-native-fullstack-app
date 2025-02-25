import React, { useEffect } from 'react'
import { StyleSheet, ScrollView } from 'react-native'

import { View, Text } from '@/components/Themed'
import { Transaction } from '@/components/ui/transaction'

import { useBaseStore } from '@/store/base'

export default function HistoryScreen() {
	const setTransactions = useBaseStore((state) => state.setTransactions)
	const fetchTransactions = useBaseStore((state) => state.fetchTransactions)
	const transactions = useBaseStore((state) => state.transactions)

	useEffect(() => {
		const getTransactionData = async () => {
			try {
				useBaseStore.getState().setLoading(true)
				const transactionData = await fetchTransactions()
				await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
				setTransactions(transactionData)
				useBaseStore.getState().setLoading(false)
			} catch (error) {
				console.log('getTransactionData error: ', error)
				useBaseStore.getState().setLoading(false)
			}
		}
		getTransactionData()
	}, [])

	if (!transactions || transactions.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>No transactions yet</Text>
			</View>
		)
	}
	if (transactions || transactions.length > 0) {
		const sortTransactions = [...transactions].sort((a, b) => {
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		})
		return (
			<View style={styles.container}>
				<ScrollView style={styles.list}>
					{sortTransactions.map((transaction) => (
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
