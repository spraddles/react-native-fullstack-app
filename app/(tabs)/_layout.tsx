import React from 'react'
import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'

import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import Octicons from '@expo/vector-icons/Octicons'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'

function TabBarIcon(props: { name: string; color: string }) {
	if (props.name === 'dollar-sign') {
		return (
			<Feather
				name={props.name}
				size={32}
				style={{ marginBottom: -3 }}
				color={props.color}
			/>
		)
	}
	if (props.name === 'history') {
		return (
			<Octicons
                name={props.name}
				size={26}
				style={{ marginBottom: -3 }}
				color={props.color}
			/>
		)
	}
	if (props.name === 'user') {
		return (
			<Feather
                name={props.name}
				size={30}
				style={{ marginBottom: 0 }}
				color={props.color}
			/>
		)
	}
	return null
}

function ModalTriggerButton(props: { colorScheme: string }) {
	return (
		<Link href="/(modals)/about" asChild>
			<Pressable>
				{({ pressed }) => (
					<Ionicons
						name="information-circle-outline"
						size={25}
						color={Colors[props.colorScheme ?? 'light'].text}
						style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
					/>
				)}
			</Pressable>
		</Link>
	)
}

export default function TabLayout() {
	const colorScheme = useColorScheme()

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
				tabBarStyle: { height: 80, padding: 20 },
				tabBarLabelStyle: { fontSize: 12, marginTop: 0 },
				tabBarIconStyle: { marginTop: 5, marginBottom: 7 },
				headerShown: useClientOnlyValue(false, true),
				headerTitleStyle: { fontSize: 25 }
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Transfer',
					tabBarIcon: ({ color }) => <TabBarIcon name="dollar-sign" color={color} />,
					headerRight: () => <ModalTriggerButton colorScheme={colorScheme} />
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: 'History',
					tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
					headerRight: () => <ModalTriggerButton colorScheme={colorScheme} />
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
					headerRight: () => <ModalTriggerButton colorScheme={colorScheme} />
				}}
			/>
		</Tabs>
	)
}
