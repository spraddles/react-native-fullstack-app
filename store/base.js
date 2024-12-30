import { create } from 'zustand'

export const useBaseStore = create((set, get) => ({
	user: {
		name: '',
		surname: '',
		email: '',
		phone: '',
		cpf: ''
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

	// setters
	setUser: (field, value) =>
		set((state) => ({
			user: {
				...state.user,
				[field]: value
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
		}))
}))
