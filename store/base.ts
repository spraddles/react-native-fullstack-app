import { create } from 'zustand'

type Transaction = {
	id: string
	dateTime: string
	amount: number
	paymentType: string
	pixMethod: string
	pixMethodValue: string
}

type State = {
	user: {
		name: string
		surname: string
		email: string
		phone: string
		cpf: string
	}

	loading: boolean

	transactions: Transaction[]

	setUser: (field: keyof State['user'], value: string) => void
	setLoading: (value: boolean) => void
	addTransaction: (transaction: Transaction) => void
}

export const useBaseStore = create<State>()((set) => ({
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
