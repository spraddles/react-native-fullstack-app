/*
 ** Note: all fees in our entire application are set & managed here
 */

const ourFees = 5

const cardFees = {
	debit: 1,
	credit: 2.2
}

const calculateOurFees = (amount) => {
	const _ourFees = (amount * ourFees) / 100
	return _ourFees
}

const calculateCardFees = (type, amount) => {
	if (type === 'debit') {
		const _cardFees = (amount * cardFees.debit) / 100
		return _cardFees
	} else if (type === 'credit') {
		const _cardFees = (amount * cardFees.credit) / 100
		return _cardFees
	}
	throw new Error("Can't calculate card fees, missing inputs")
}

const calculatePixFees = (amount) => {
	if (!amount) {
		throw new Error("Can't calculate Pix fees, missing inputs")
	}
	// zero for now
	return 0
}

export const calculateFees = (cardType, amount) => {
	const _cardFee = calculateCardFees(cardType, amount)
	const _pixFee = calculatePixFees(amount)
	const _ourFee = calculateOurFees(amount)
	const feeObject = {
		card_fee: _cardFee,
		pix_fee: _pixFee,
		our_fee: _ourFee,
		total_fee: _cardFee + _pixFee + _ourFee
	}
	return feeObject
}
