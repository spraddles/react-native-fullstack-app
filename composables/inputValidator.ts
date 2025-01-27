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
		value === '0' ||
		value === 0 ||
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
		if (isNaN(value as number)) {
			return { isValid: false, message: 'Field only accepts numbers' }
		}
		if (value === 0) {
			return { isValid: false, message: 'Amount must be greater than zero' }
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

	// month check
	if (type === 'month') {
		let newValue = String(value)
		if (newValue.length !== 2) {
			return { isValid: false, message: 'Invalid month' }
		}
		newValue = Number(value)
		if (newValue < 1 || newValue > 12) {
			return { isValid: false, message: 'Invalid month' }
		}
	}

	// day check
	if (type === 'day') {
		let newValue = String(value)
		newValue = Number(value)
		if (newValue < 1 || newValue > 31) {
			return { isValid: false, message: 'Invalid day' }
		}
	}

	return { isValid: true }
}
