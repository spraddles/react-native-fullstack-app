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

import { Loader } from '@/components/ui/loader'
import { Toast } from '@/components/ui/toast'
import { useColorScheme } from '@/components/useColorScheme'

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = {
	initialRouteName: '(pages)'
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
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

	// development ENV
	useEffect(() => {
		if (process.env.EXPO_PUBLIC_SEED_DATA === 'true') {
			dataStoreSeeder()
		}
		console.log('__DEV__:', __DEV__)
		console.log('EXPO_PUBLIC_SEED_DATA:', process.env.EXPO_PUBLIC_SEED_DATA)
		console.log('EXPO_PUBLIC_FORCE_FAIL_PAYMENT:', process.env.EXPO_PUBLIC_FORCE_FAIL_PAYMENT)
	}, [])

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
				<Stack.Screen name="(pages)/index" options={{ headerShown: false }} />
				<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
				<Stack.Screen
					name="(pages)/confirm"
					options={{
						headerShown: true,
						headerTitle: 'Confirm',
						headerBackVisible: false,
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen
					name="(pages)/success"
					options={{
						headerShown: true,
						headerTitle: 'Complete',
						headerBackVisible: false,
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen
					name="(pages)/editProfile"
					options={{
						headerShown: false,
						headerTitle: 'Complete',
						headerBackVisible: false,
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen
					name="(pages)/login"
					options={{
						headerShown: true,
						headerTitle: 'Login',
						headerBackVisible: true,
						headerBackTitle: 'Home',
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen
					name="(pages)/signUp"
					options={{
						headerShown: true,
						headerTitle: 'Sign up',
						headerBackVisible: true,
						headerBackTitle: 'Home',
						headerTitleStyle: { fontSize: 25 }
					}}
				/>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</ThemeProvider>
	)
}
