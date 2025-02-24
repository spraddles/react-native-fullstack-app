export const formatCPF = (value) => {
	if (!value) {
		return ''
	}
	const cleaned = value.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const removeNonNumbers = (value: string) => {
	if (!value) {
		return ''
	}
	return value.replace(/[^0-9]/g, '')
}

export const formatCurrency = (value: string) => {
	if (!value) {
		return ''
	}
	const numbers = value.replace(/[^\d]/g, '')
	const withComma = (parseInt(numbers, 10) / 100).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})
	return withComma
}

export const formatPhone = (value) => {
	if (!value) {
		return ''
	}
	const cleaned = value.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1)-$2-$3')
}

export const formatPhoneInternational = (value) => {
	if (!value) {
		return '+'
	}
	const cleaned = String(value).replace(/[^\d]/g, '')
	return `+${cleaned}`
}

export const formatAlphaNumeric = (value) => {
	if (!value) {
		return ''
	}
	value = String(value)
	const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
	return cleaned
}

export const allowNumeric = (value: string) => {
	if (!value) {
		return ''
	}
	value = String(value)
	const cleaned = value.replace(/[^0-9]/g, '')
	return cleaned
}

export const formatCreditCardNumber = (value: string) => {
	if (!value) {
		return ''
	}
	value = String(value)
	const cleaned = value.replace(/\D/g, '')
	const truncated = cleaned.slice(0, 16)
	const formatted = truncated.replace(/(\d{4})/g, '$1 ').trim()
	return formatted
}

export const stripSpaces = (value) => {
	if (!value) {
		return ''
	}
	return value.replace(/\s/g, '')
}

export const stripFormat = (value: any): string => {
	if (!value) {
		return ''
	}
	const stringValue = String(value)
	return stringValue.replace(/[^a-zA-Z0-9]/g, '')
}
