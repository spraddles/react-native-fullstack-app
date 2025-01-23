import { create } from 'zustand'

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
		}))
}))
