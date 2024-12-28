import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

type Tab = {
	id: string
	label: string
}

type TabsProps = {
	tabs: Tab[]
	activeTab: string
	onTabChange: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
	return (
		<View style={styles.container}>
			{tabs.map((tab) => (
				<TouchableOpacity
					key={tab.id}
					style={[styles.tab, activeTab === tab.id && styles.activeTab]}
					onPress={() => onTabChange(tab.id)}
				>
					<Text style={[styles.label, activeTab === tab.id && styles.activeLabel]}>
						{tab.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	tab: {
		paddingTop: '15',
		paddingBottom: '15',
		paddingLeft: '20',
		paddingRight: '20',
		marginLeft: 5,
		marginRight: 5
	},
	activeTab: {
		borderStyle: 'solid',
		borderWidth: '2',
		borderColor: '#007AFF',
		borderRadius: 5
	},
	label: {
		fontSize: 16,
		color: '#666'
	},
	activeLabel: {
		color: '#007AFF'
	}
})
