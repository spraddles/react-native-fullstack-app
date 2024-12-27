import { create } from 'zustand'

type State = {
  user: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    cpf: string;
  }
}

export const useBaseStore = create<State>()((set) => ({

  user: {
    name: '',
    surname: '',
    email: '',
    phone: '',
    cpf: ''
  },

  setUser: (field: keyof State['user'], value: string) => 
    set((state) => ({
      user: { ...state.user, [field]: value }
    }))
}))