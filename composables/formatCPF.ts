export const formatCPF = (number) => {
	const cleaned = number.toString().replace(/\D/g, '')
	return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const removeNonNumbers = (value: string) => {
	return value.replace(/[^0-9]/g, '')
}
