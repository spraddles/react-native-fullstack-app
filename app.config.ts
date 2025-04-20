import { ExpoConfig, ConfigContext } from 'expo/config'
import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: '.env.prod' })
}
if (process.env.NODE_ENV === 'development') {
	dotenv.config({ path: '.env.dev' })
}
if (process.env.NODE_ENV === 'test') {
	dotenv.config({ path: '.env.test' })
}

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: process.env.EXPO_PUBLIC_APP_NAME,
	slug: process.env.EXPO_PROJECT_SLUG,
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	userInterfaceStyle: 'automatic',
	newArchEnabled: true,
	ios: {
		// usesAppleSignIn: true,
		supportsTablet: true,
		bundleIdentifier: process.env.EXPO_BUNDLE_ID,
		infoPlist: {
			ITSAppUsesNonExemptEncryption: false,
			merchant_id: process.env.MERCHANT_ID,
			CFBundleURLTypes: [
				{
					CFBundleURLSchemes: [process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_URL_SCHEME]
				}
			]
		},
		config: {
			googleSignIn: {
				reservedClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_URL_SCHEME
			}
		}
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#ffffff'
		},
		package: process.env.EXPO_BUNDLE_ID
	},
	web: {
		bundler: 'metro',
		output: 'static',
		favicon: './assets/images/favicon.png'
	},
	plugins: [
		'expo-router',
		'expo-font',
		// 'expo-apple-authentication',
		[
			'expo-splash-screen',
			{
				backgroundColor: '#000000',
				image: './assets/images/logo-dark.png',
				dark: {
					image: './assets/images/logo.png',
					backgroundColor: '#000000'
				},
				imageWidth: 350
			}
		],
		[
			'@react-native-google-signin/google-signin',
			{
				iosUrlScheme:
					'com.googleusercontent.apps.392001664057-17c8g5m4kga63ol8a8q441s77v7q84i1'
			}
		]
	],
	experiments: {
		typedRoutes: true
	},
	extra: {
		eas: {
			projectId: process.env.EXPO_PROJECT_ID
		}
	}
})
