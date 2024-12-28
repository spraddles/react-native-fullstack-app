export const formatPhone = (number) => {
	const cleaned = number.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1)-$2-$3')
}
