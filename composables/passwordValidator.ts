export const validatePassword = (value: number | string, minLength: number) => {

	// empty check
	if (!value || value === '' || value === null || value === undefined) {
		return { isValid: false, message: 'Please enter a password' }
	}

	// minLength check
	if (value.length < minLength) {
		return { isValid: false, message: `Minimum ${minLength} characters required` }
	}

	return { isValid: true }
}

export const comparePassword = (value: number | string, confirmValue: number | string) => {

	if (value !== confirmValue) {
		return { isValid: false, message: 'Passwords do not match' }
	}

	return { isValid: true }
}
