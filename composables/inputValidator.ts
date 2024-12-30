export const validateInput = (type: string, value: string | number, length?: number) => {

	// empty check
	if (!value || value === '0.00' || value === '0' || value === 0 || value === '') {
		return { isValid: false, message: 'Please enter a value' }
	}

	// length check
	if (length && value.length !== length) {
		return { isValid: false, message: 'Invalid number length' }
	}

	// email check
	if (type === 'email') {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!pattern.test(value)) {
			return { isValid: false, message: 'Invalid email address' }
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

	return { isValid: true }
}
