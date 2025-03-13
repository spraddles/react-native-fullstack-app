export const getAccountBalance = async () => {
	const balance = 10000 // add fake value for now
	await new Promise((resolve) => setTimeout(resolve, 1000)) // fake await
	return balance
}
