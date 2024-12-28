import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import { View } from '@/components/Themed'
import { Tabs } from '@/components/ui/tabs'

export default function TabOneScreen() {
	const [currentTab, setCurrentTab] = useState('cpf')

	return (
		<View style={styles.container}>
			<Tabs
				tabs={[
					{ id: 'cpf', label: 'CPF' },
					{ id: 'phone', label: 'Phone' },
					{ id: 'email', label: 'Email' }
				]}
				activeTab={currentTab}
				onTabChange={setCurrentTab}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	}
})
