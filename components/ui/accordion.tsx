import React, { useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	LayoutAnimation,
	Platform,
	UIManager
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// enable LayoutAnimation for Android
if (Platform.OS === 'android') {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true)
	}
}

interface AccordionProps {
	title: string
	children: React.ReactNode
	icon?: React.ReactNode
}

export const Accordion = ({ title, children, icon }: AccordionProps) => {
	const [expanded, setExpanded] = useState(false)

	const toggleExpand = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		setExpanded(!expanded)
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.header} onPress={toggleExpand}>
				<View style={styles.titleContainer}>
					{icon && <View style={styles.iconContainer}>{icon}</View>}
					<Text style={styles.title}>{title}</Text>
				</View>
				<Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color="#333" />
			</TouchableOpacity>
			{expanded && <View style={styles.content}>{children}</View>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		marginVertical: 8,
		borderRadius: 8,
		overflow: 'hidden'
	},
	header: {
		padding: 14,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8
	},
	title: {
		fontSize: 17,
		color: '#444'
	},
	content: {
		padding: 16,
		backgroundColor: '#fff'
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	iconContainer: {
		marginLeft: 5,
		marginRight: 15
	}
})
