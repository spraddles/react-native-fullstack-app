export const stripFormat = (value) => {
	if (!value) {
		return ''
	}
	const stringValue = String(value)
	return stringValue.replace(/[^a-zA-Z0-9]/g, '')
}
