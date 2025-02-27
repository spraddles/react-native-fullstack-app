import { useBaseStore } from '@/store/base'
import { supabase } from '@/supabase/connect'
import { router } from 'expo-router'

export const logout = async (message: string) => {
	try {
		await supabase.auth.signOut()
		useBaseStore.getState().resetState()
		router.push('/(pages)')
		if (message) {
			useBaseStore.getState().setToast({
				visible: true,
				message: message
			})
		}
	} catch (error) {
		console.error('Logout error:', error)
	}
}
