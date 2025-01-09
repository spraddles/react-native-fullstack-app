import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'GlobalPay',
	slug: 'GlobalPay',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	scheme: 'myapp',
	userInterfaceStyle: 'automatic',
	newArchEnabled: true,
	ios: {
		supportsTablet: true,
		bundleIdentifier: 'com.anonymous.GlobalPay',
		infoPlist: {
			merchant_id: 'some_merchant_id'
		},
		entitlements: {
			'com.apple.developer.in-app-payments': 'some_merchant_id',
			'com.apple.developer.payment-pass-provisioning': true
		},
		config: {
			googleSignIn: {
				reservedClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_REVERSE
			}
		}
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#ffffff'
		},
		package: 'com.anonymous.GlobalPay'
	},
	web: {
		bundler: 'metro',
		output: 'static',
		favicon: './assets/images/favicon.png'
	},
	plugins: [
		'expo-router',
		'./node_modules/@rnw-community/react-native-payments/plugins/with-payments.js',
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
				iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID_REVERSE
			}
		]
	],
	experiments: {
		typedRoutes: true
	}
})
