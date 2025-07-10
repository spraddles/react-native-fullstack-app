import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

type Tab = {
	id: string
	name: string
}

type TabsProps = {
	tabs: Tab[]
	activeTab: string
	label?: string
	onTabChange: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, label, onTabChange }: TabsProps) {
	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<View style={styles.tabGroup}>
				{tabs.map((tab) => (
					<TouchableOpacity
						key={tab.id}
						style={[styles.tab, activeTab === tab.id && styles.activeTab]}
						onPress={() => onTabChange(tab.id)}
					>
						<Text style={[styles.name, activeTab === tab.id && styles.activeName]}>
							{tab.name}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		widith: '100%'
	},
	tabGroup: {
		flexDirection: 'row',
		borderStyle: 'solid',
		borderWidth: '1',
		borderColor: '#ddd',
		borderRadius: 8
	},
	label: {
		fontSize: 13,
		marginBottom: 8,
		color: '#333',
		display: 'block'
	},
	tab: {
		paddingTop: '15',
		paddingBottom: '15',
		paddingLeft: '21',
		paddingRight: '21',
		marginLeft: 0,
		marginRight: 0
	},
	activeTab: {
		borderStyle: 'solid',
		borderWidth: '2.5',
		borderColor: '#54d629',
		borderRadius: 5
	},
	name: {
		fontSize: 16,
		color: '#666'
	},
	activeName: {
		color: '#000000'
	}
})
