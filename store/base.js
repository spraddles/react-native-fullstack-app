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

	// api methods
	fetchTransactions: async () => {
		try {
			set({ loading: true })
			await new Promise((resolve) => setTimeout(resolve, 2000)) // for smoothness
			const url = process.env.EXPO_PUBLIC_SERVER_URL + '/api/transactions/all'
			const response = await apiFetch(url, { method: 'GET' })
			const data = await response.json()
			set({ transactions: data.data, loading: false, error: null })
			set({ loading: false })
		} catch (error) {
			console.log('fetchTransactions error: ', error)
			set({ error: error.message, loading: false })
		}
	},

	createTransaction: async (transaction: object) => {
		try {
			const url = process.env.EXPO_PUBLIC_SERVER_URL + '/api/transactions/create'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify(transaction) })
			const data = await response.json()
            const isSuccess = response.ok && response.status === 200 && data.status
            return {
                status: isSuccess,
                ...(isSuccess && { data })
            }
		} catch (error) {
			console.log('createTransaction error: ', error)
		}
	},

    setTransactionStatus: async (id: string, status: string, message: string) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/api/transactions/set-status'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ id, status, message })})
            return (response.ok && response.status === 200) ? { status: true } : { status: false }
        } catch (error) {
            console.log('setTransactionStatus error: ', error)
        }
    }
}))
