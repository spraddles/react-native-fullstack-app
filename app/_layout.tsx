import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useBaseStore } from '@/store/base'
import { dataStoreSeeder } from '@/scripts/seeder'
import Constants from 'expo-constants'

import { Loader } from '@/components/ui/loader'
import { Toast } from '@/components/ui/toast'
import { useColorScheme } from '@/components/useColorScheme'

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = {
	initialRouteName: '(tabs)'
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const seedData = Constants.expoConfig?.extra?.seedData
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font
	})

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) {
			throw error
		}
	}, [error])

	useEffect(() => {
		if (loaded) {
			setTimeout(SplashScreen.hideAsync, 3000)
		}
	}, [loaded])

	useEffect(() => {
		if (seedData) {
			dataStoreSeeder()
			useBaseStore.getState().setEmptyProfile(false)
		}
		console.log('seedData:', seedData)
	}, [seedData])

	if (!loaded) {
		return null
	}

	return <RootLayoutNav />
}

function RootLayoutNav() {
	const colorScheme = useColorScheme()

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Loader active={useBaseStore((state) => state.loading)} />
			<Toast
				visible={useBaseStore((state) => state.isToastVisible())}
				message={useBaseStore((state) => state.getToastMessage())}
				onHide={() => useBaseStore.getState().setToast({ visible: false, message: '' })}
			/>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
				<Stack.Screen
					name="pages/confirm"
					options={{
						headerShown: true,
						headerTitle: 'Confirm',
						headerBackVisible: false,
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen
					name="pages/success"
					options={{
						headerShown: true,
						headerTitle: 'Complete',
						headerBackVisible: false,
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen
					name="pages/emptyProfile"
					options={{
						headerShown: false,
						headerTitle: 'Complete',
						headerBackVisible: false,
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen
					name="pages/editProfile"
					options={{
						headerShown: false,
						headerTitle: 'Complete',
						headerBackVisible: false,
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
			</Stack>
		</ThemeProvider>
	)
}
