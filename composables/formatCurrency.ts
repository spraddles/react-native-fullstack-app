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
