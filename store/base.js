import { create } from 'zustand'

export const useBaseStore = create((set, get) => ({
	user: {
		name: '',
		surname: '',
		email: '',
		phone: '',
		cpf: ''
	},

	emptyProfile: true,

	loading: false,

	toast: {
		visible: false,
		message: ''
	},

	transactions: [],

	// getters
	isToastVisible: () => get().toast.visible,
	getToastMessage: () => get().toast.message,
	getEmptyProfileState: () => get().emptyProfile,
	getUser: () => get().user,

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
		})),

	setEmptyProfile: (value) =>
		set(() => ({
			emptyProfile: value
		}))
}))
