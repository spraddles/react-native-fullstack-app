import { create } from 'zustand'

type State = {
    user: {
        name: string;
        surname: string;
        email: string;
        phone: string;
        cpf: string;
    }
    loading: boolean;
    setUser: (field: keyof State['user'], value: string) => void;
    setLoading: (value: boolean) => void;
}

export const useBaseStore = create < State > ()((set) => ({

    user: {
        name: '',
        surname: '',
        email: '',
        phone: '',
        cpf: ''
    },

    loading: false,
    
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
        }))
}))