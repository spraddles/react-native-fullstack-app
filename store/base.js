import { create } from 'zustand'
import { apiFetch } from '@/composables/api'

export const useBaseStore = create((set, get) => ({
	user: {
		id: '',
		name: '',
		surname: '',
		country: {
			code: '',
			name: '',
			flag: '',
			demonym: ''
		},
		dob: {
			year: '',
			month: '',
			day: ''
		},
		email: '',
		phone: '',
		passport: '',
		cpf: '',
		has_onboarded: ''
	},

	loading: false,

	toast: {
		visible: false,
		message: ''
	},

	transactions: [],

	// getters
	isToastVisible: () => get().toast.visible,
	getToastMessage: () => get().toast.message,
	getUser: () => get().user,
	getTransactions: () => get().transactions,

	// setters
	resetUser: () =>
		set(() => ({
			user: {}
		})),

	setUser: (value) =>
		set(() => ({
			user: value
		})),

	setUserField: (field, value) =>
		set((state) => ({
			user: {
				...state.user,
				[field]: value
			}
		})),

	setDOB: (data) =>
		set((state) => ({
			user: {
				...state.user,
				dob: {
					...state.user.dob,
					...data
				}
			}
		})),

	setLoading: (value) =>
		set(() => ({
			loading: value
		})),

	setToast: (value) =>
		set(() => ({
			toast: value
		})),

	addTransaction: (transaction) =>
		set((state) => ({
			transactions: [...state.transactions, transaction]
		})),

	setTransactions: (value) =>
		set(() => ({
			transactions: value
		})),

	// fetchers
	fetchTransactions: async () => {
		try {
			set({ loading: true })
			await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
			const url = process.env.EXPO_PUBLIC_SERVER_URL + '/api/transactions/all'
			const apiFetchResponse = await apiFetch(url, { method: 'GET' })
			const data = await apiFetchResponse.json()
			set({ transactions: data.data, loading: false, error: null })
			set({ loading: false })
		} catch (error) {
			console.log('fetchTransactions error: ', error)
			set({ error: error.message, loading: false })
		}
	}
}))
