import { StyleSheet, ScrollView } from 'react-native'
import { View } from '@/components/Themed'
import { Transaction } from '@/components/ui/transaction'
import { useBaseStore } from '@/store/base'

export default function HistoryScreen() {
	const transactions = useBaseStore((state) => state.transactions)

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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20
	},
	list: {
		width: '100%'
	}
})
