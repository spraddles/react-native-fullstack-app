import { stripFormat } from '@/composables/inputFormatter'

export const validateInput = (type: string, value: string | number, length?: number) => {

	// cpf check
	if (type === 'cpf') {
		const newValue = String(stripFormat(value))
		if (newValue.length === 0 || newValue.length === 11) {
			return { isValid: true }
		} else {
			return { isValid: false, message: 'Invalid CPF length or instead make this blank' }
		}
	}

	// empty check
	if (
		!value ||
		value === '0.00' ||
		value === '00' ||
		value === '0' ||
		value === 0 ||
		value === 0.0 ||
		value === '' ||
		value === '+' ||
		value === null ||
		value === undefined
	) {
		return { isValid: false, message: 'Please enter a value' }
	}

	// length check
	if (length && value.length !== length) {
		return { isValid: false, message: 'Invalid number length' }
	}

	// email check
	if (type === 'email') {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (pattern.test(value) === false) {
			return { isValid: false, message: 'Invalid email address' }
		}
	}

	// international number check
	if (type === 'international-number') {
		const pattern = /^\+\d+$/
		if (pattern.test(value) === false) {
			return { isValid: false, message: 'Invalid phone number' }
		}
	}

	// number check
	if (type === 'number') {
		const numValue = Number(value)
		if (isNaN(numValue)) {
			return { isValid: false, message: 'Field only accepts numbers' }
		}
		if (numValue === 0) {
			return { isValid: false, message: 'Amount must be greater than zero' }
		}
	}

	// credit card number check
	if (type === 'credit-card-number') {
		const newValue = String(stripFormat(value))
		if (newValue.length === 16) {
			return { isValid: true }
		} else {
			return { isValid: false, message: 'Invalid number length' }
		}
	}

	// alpha numeric check
	if (type === 'alpha-numeric') {
		const newValue = String(value)
		const pattern = /^[a-zA-Z0-9]+$/
		if (pattern.test(newValue) === false) {
			return { isValid: false, message: 'Invalid key' }
		}
	}

	// year check
	if (type === 'year') {
		let newValue = String(value)
		if (newValue.length !== 4) {
			return { isValid: false, message: 'Invalid year' }
		}
		newValue = Number(value)
		if (newValue < 1950 || newValue > 2050) {
			return { isValid: false, message: 'Invalid year' }
		}
	}

	// year short check
	if (type === 'year-short') {
		let newValue = String(value)
		if (newValue.length !== 2) {
			return { isValid: false, message: 'Invalid year' }
		}
		newValue = Number(value)
		if (newValue < 24 || newValue > 40) {
			return { isValid: false, message: 'Invalid year' }
		}
	}

	// month check
	if (type === 'month') {
		const newValue = String(value)
		// no leading zeros
		if (newValue.startsWith('0')) {
			return { isValid: false, message: "Can't start with 0" }
		}
		// 1-2 chars length
		if (newValue.length < 1 || newValue.length > 2) {
			return { isValid: false, message: 'Must be 1-2 digits' }
		}
		// month range
		if (newValue < 1 || newValue > 12) {
			return { isValid: false, message: 'Invalid month' }
		}
	}

	// day check
	if (type === 'day') {
		const newValue = String(value)
		// no leading zeros
		if (newValue.startsWith('0')) {
			return { isValid: false, message: "Can't start with 0" }
		}
		// 1-2 chars length
		if (newValue.length < 1 || newValue.length > 2) {
			return { isValid: false, message: 'Must be 1-2 digits' }
		}
		// day range
		if (newValue < 1 || newValue > 31) {
			return { isValid: false, message: 'Must be between 1-31' }
		}

		return { isValid: true }
	}

	// CVV check
	if (type === 'cvv') {
		const newValue = String(value)
		// 3 chars only
		if (newValue.length !== 3) {
			return { isValid: false, message: 'Invalid CVV' }
		}
	}

	return { isValid: true }
}
