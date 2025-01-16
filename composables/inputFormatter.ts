export const formatCPF = (number) => {
	if (!number) {
		return ''
	}
	const cleaned = number.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const removeNonNumbers = (value: string) => {
	if (!value) {
		return ''
	}
	return value.replace(/[^0-9]/g, '')
}

export const formatCurrency = (text: string) => {
	if (!text) {
		return ''
	}
	const numbers = text.replace(/[^\d]/g, '')
	const withComma = (parseInt(numbers, 10) / 100).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})
	return withComma
}

export const formatPhone = (number) => {
	if (!number) {
		return ''
	}
	const cleaned = number.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1)-$2-$3')
}

export const formatPassport = (string) => {
	if (!string) {
		return ''
	}
	string = String(string)
	const cleaned = string.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
	return cleaned
}

export const stripFormat = (value: any): string => {
	const stringValue = String(value)
	return stringValue.replace(/[^a-zA-Z0-9]/g, '')
}

export const cleanDataByKey = (data: object, keysToClean: string[]) => {
	const cleanedData = { ...data }
	keysToClean.forEach((key) => {
		if (key in cleanedData) {
			cleanedData[key] = stripFormat(cleanedData[key])
		}
	})
	return cleanedData
}
