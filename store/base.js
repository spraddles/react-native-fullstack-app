import { create } from 'zustand'
import { supabase } from '@/supabase/connect'
import { FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js'

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
        last_4_digits: '',
        network: ''
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
    getUserProfile: async () => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/user/get'
            const response = await apiFetch(url, { method: 'GET' })
            return response.data
        } catch (error) {
            console.log('getUserProfile error: ', error)
        }
    },

    updateUserMeta: async (userID, userData) => {
        try {
            console.log('userID: ', userID)
            console.log('userData: ', userData)

            // const { data, error } = await supabase.functions.invoke('user_update_meta', {
            //     body: JSON.stringify({ id: userID, data: userData }),
            //     headers: { 'Content-Type': 'application/json' }
            // })

            const { data: sessionData } = await supabase.auth.getSession()
            const accessToken = sessionData?.session?.access_token

            console.log('sessionData: ', sessionData)
            console.log('accessToken: ', accessToken)

            const response = await fetch('https://euicrfygfarvoddgiwjd.supabase.co/functions/v1/user_update_meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ id: userID, data: userData })
            })

            const text = await response.text();
            console.log('Edge responded:', response.status, text);

            console.log('response: ', response)

            // /* ----------- Edge function returned 4xx / 5xx ----------- */
            // if (error) {
            //     // All non-2xx errors include 'response' + 'status'; do not rely on instanceof
            //     if (typeof error === 'object' && 'response' in error) {
            //         const res = (error).response
            //         const text = await res.text()
            //         console.warn('[Edge] non-2xx:', (error).status, text)
            //         return { data: null, error: text }
            //     }

            //     // Fallback: relay / fetch errors (network, CORS, etc.)
            //     if (
            //         error instanceof FunctionsRelayError ||
            //         error instanceof FunctionsFetchError
            //     ) {
            //         console.warn('[Edge] relay / fetch:', error.message)
            //         return { data: null, error: error.message }
            //     }

            //     // Unknown error shape
            //     console.warn('[Edge] unknown error object:', JSON.stringify(error))
            //     return { data: null, error: 'Edge Function failed' }
            // }

            // /* ----------------------- Success ------------------------ */
            // return { data, error: null }

        } catch (err) {
            // Only hits if invoke() itself throws (very rare in practice)
            console.error('[Edge] invoke() threw:', err)
            const message =
                err instanceof Error ? err.message : typeof err === 'string' ? err : 'network failure'
            return { data: null, error: message }
        }
    },

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

    updateTransaction: async (data: object) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/transactions/update'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ data }) })
            return (response.ok && response.status === 200) ? { status: true } : { status: false }
        } catch (error) {
            console.log('updateTransaction error: ', error)
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

    calculateFees: async (data) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/transactions/fees'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ data }) })
            return response.data.fees
        } catch (error) {
            console.log('calculateFees error: ', error)
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
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ data }) })
            return response.status
        } catch (error) {
            console.log('createCard error: ', error)
        }
    },

    chargeCard: async (cardID, transaction) => {
        try {
            const url = process.env.EXPO_PUBLIC_SERVER_URL + '/cards/charge'
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ cardID, transaction }) })
            return response
        }
        catch (error) {
            console.log('createCard error: ', error)
        }
    },

    // external API
    getCardBinData: async (cardNumber) => {
        try {
            const url = `https://data.handyapi.com/bin/${cardNumber}`
            const key = process.env.EXPO_PUBLIC_CARD_BIN_LOOKUP
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
            const response = await apiFetch(url, { method: 'POST', body: JSON.stringify({ transactionValue }) })
            return response.status
        }
        catch (error) {
            console.log('isEnoughFunds error: ', error)
        }
    }
}))
