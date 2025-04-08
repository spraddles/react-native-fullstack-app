export const stripFormat = (value) => {
	if (!value) {
		return ''
	}
	const stringValue = String(value)
	return stringValue.replace(/[^a-zA-Z0-9]/g, '')
}

export const stripFormatForNumbers = (value) => {
	if (!value) {
		return ''
	}
	const stringValue = String(value)
	return stringValue.replace(/[^a-zA-Z0-9.]/g, '')
}

export const convertExpiryDateFormat = (dateString) => {
	const parts = dateString.split('/')
	if (parts.length !== 2) {
		throw new Error('Invalid date format. Expected "M/YY" format')
	}
	let month = parts[0]
	let year = parts[1]
	month = month.padStart(2, '0')
	const fullYear = '20' + year
	return `${fullYear}-${month}`
}
