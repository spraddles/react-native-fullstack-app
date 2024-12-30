export const formatCPF = (number) => {
	const cleaned = number.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const removeNonNumbers = (value: string) => {
	return value.replace(/[^0-9]/g, '')
}

export const formatCurrency = (text: string) => {
	const numbers = text.replace(/[^\d]/g, '')
	if (!numbers) {
		return ''
	}
	const withComma = (parseInt(numbers, 10) / 100).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})
	return withComma
}

export const formatPhone = (number) => {
	const cleaned = number.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1)-$2-$3')
}
