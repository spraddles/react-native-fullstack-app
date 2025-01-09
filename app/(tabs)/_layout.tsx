import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs } from 'expo-router'
import { Pressable } from 'react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name']
	color: string
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

function ModalTriggerButton(props: { colorScheme: string }) {
	return (
		<Link href="/(modals)/about" asChild>
			<Pressable>
				{({ pressed }) => (
					<FontAwesome
						name="info-circle"
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
					tabBarIcon: ({ color }) => <TabBarIcon name="dollar" color={color} />,
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
					tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
					headerRight: () => <ModalTriggerButton colorScheme={colorScheme} />
				}}
			/>
		</Tabs>
	)
}
