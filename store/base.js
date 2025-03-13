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

    card: {
        id: '',
        last4digits: '',
        flag: ''
    },

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

	setDOB: (value) =>
		set((state) => ({
			user: {
				...state.user,
				dob: {
					...state.user.dob,
					...value
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

    setCard: (value) =>
		set(() => ({
			card: value
		})),

    resetCard: () =>
        set(() => ({
            card: {}
        })),

    resetState: () => {
		set(() => ({
			user: {}
		}))
		set(() => ({
			loading: false
		}))
        set(() => ({
			transactions: []
		}))
        set(() => ({
			card: {}
		}))
    },

	// api methods
	fetchTransactions: async () => {
		try {
			const url = process.env.EXPO_PUBLIC_SERVER_URL + '/transactions/all'
			const response = await apiFetch(url, { method: 'GET' })
            return response.data
		} catch (error) {
			console.log('fetchTransactions error: ', error)
		}
	},

	createTransaction: async (transaction: object) => {
		try {
			const url = process.env.EXPO_PUBLIC_SERVER_URL + '/transactions/create'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify(transaction) })
            return (response.status) ? response.data : { status: false }
		} catch (error) {
			console.log('createTransaction error: ', error)
		}
	},

    setTransactionStatus: async (id: string, status: string, message: string) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/transactions/set-status'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ id, status, message })})
            return (response.ok && response.status === 200) ? { status: true } : { status: false }
        } catch (error) {
            console.log('setTransactionStatus error: ', error)
        }
    },

    fetchPublicKey: async () => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/auth/publickey'
            const response = await apiFetch(url, { method: 'GET' })
            return response.data
        } catch (error) {
            console.log('fetchPublicKey error: ', error)
        }
    },

    fetchCard: async () => {
		try {
			const url = process.env.EXPO_PUBLIC_SERVER_URL + '/cards/get'
			const response = await apiFetch(url, { method: 'GET' })
            return response
		} catch (error) {
			console.log('fetchCards error: ', error)
		}
	},

    createCard: async (data) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/cards/create'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ data })})
            return response.status
        } catch (error) {
            console.log('createCard error: ', error)
        }
    },

    chargeCard: async (cardID, transaction) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/cards/charge'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ cardID, transaction })})
            return response.status
        }
        catch (error) {
            console.log('createCard error: ', error)
        }
    },

    // external API
    getCardCountry: async (cardNumber) => {
        try {
            const url = `https://data.handyapi.com/bin/${cardNumber}`
            const key =  process.env.EXPO_PUBLIC_CARD_BIN_LOOKUP
            const response = await fetch(url, {
                headers: { 'x-api-key': key }
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    },

    isEnoughFunds: async (transactionValue) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/account/is-enough-funds'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ transactionValue })})
            return response.status
        }
        catch (error) {
            console.log('isEnoughFunds error: ', error)
        }
    }
}))
