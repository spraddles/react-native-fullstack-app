// base.ts
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
    name: 'John',
    surname: 'Smith',
    email: 'john.smith@gmail.com',
    phone: '+55 21 90909-9090',
    cpf: '123.456.789-00'
  }
}))