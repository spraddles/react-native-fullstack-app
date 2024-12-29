import { create } from 'zustand'

export const useBaseStore = create((set) => ({
	user: {
		name: '',
		surname: '',
		email: '',
		phone: '',
		cpf: ''
	},

	loading: false,

	transactions: [],

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

	addTransaction: (transaction) =>
		set((state) => ({
			transactions: [...state.transactions, transaction]
		}))
}))
