import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	extra: {
		seedData: process.env.SEED_DATA === 'true'
	}
})
