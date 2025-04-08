import starkbank from 'starkbank'
import testCards from './testCards.js'
import { base64ToPem } from './../../../utils/decrypt.js'

// for testing
const logging = false

// init
let user = new starkbank.Project({
	environment: 'sandbox',
	id: '4801747562266624',
	privateKey: base64ToPem(process.env.STARKBANK_PRIVATE_KEY_BASE64, 'private')
})
starkbank.user = user
starkbank.language = 'en-US'

const createMerchantSession = async (amount) => {
	try {
		const merchantSession = await starkbank.merchantSession.create({
			allowedFundingTypes: ['debit', 'credit'],
			allowedInstallments: [{ totalAmount: amount, count: 1 }],
			expiration: 3600,
			challengeMode: 'disabled'
		})
		return merchantSession
	} catch (error) {
		console.error('createMerchantSession error:', error)
	}
}

const isSessionValid = async (id) => {
	try {
		const session = await starkbank.merchantSession.get(id)
		return session.status === 'created'
	} catch (error) {
		console.error('isSessionValid error:', error)
		return false
	}
}

const merchantSessionPurchase = async (uuid, cardDetails) => {
	try {
		const sessionPurchase = await starkbank.merchantSession.purchase(uuid, {
			amount: cardDetails.amount,
			installmentCount: 1,
			cardExpiration: cardDetails.cardExpiration,
			cardNumber: cardDetails.cardNumber,
			cardSecurityCode: cardDetails.cardSecurityCode,
			fundingType: cardDetails.fundingType,
			holderName: cardDetails.holderName
		})
		return sessionPurchase
	} catch (e) {
		if (e && e.errors && Array.isArray(e.errors) && e.errors.length > 0) {
			// return only the first error
			const theError = {
				code: e.errors[0].code,
				message: e.errors[0].message
			}
			return theError
		} else {
			console.error('merchantSessionPurchase error:', e)
			throw e
		}
	}
}

const getPurchaseLogs = async (purchaseId) => {
	try {
		const logs = await starkbank.merchantPurchase.log.query({
			limit: 10,
			purchaseIds: [purchaseId]
		})
		const logsList = []
		for await (let log of logs) {
			logsList.push(log)
		}
		return logsList
	} catch (error) {
		console.error('getPurchaseLogs error:', error)
		return []
	}
}

const filterLogsForErrors = (logs) => {
	// see responses.txt for more details
	const errorTypes = ['denied', 'canceled', 'voided', 'failed']
	const errorLogs = logs
		.filter((log) => errorTypes.includes(log.type) && log.errors && log.errors.length > 0)
		.map((log) => ({
			type: log.type,
			errors: log.errors
		}))
	return errorLogs
}

// for previously saved cards
export const merchantPurchase = async (card, amount) => {
	const amountInCents = Math.round(Number(amount) * 100)
	try {
		const purchase = await starkbank.merchantPurchase.create({
			amount: amountInCents,
			fundingType: card.type,
			challengeMode: 'disabled',
			cardId: card.external_id
		})
		return purchase
	} catch (error) {
		console.error('merchantPurchase error:', error)
		return false
	}
}

// for saving a new card
export const chargeCard = async (card, amount) => {
	try {
		// Step 1: Create merchant session
		const session = await createMerchantSession(amount)
		logging ? console.error('session:', session) : null
		if (!session) {
			return {
				success: false,
				data: null,
				message: 'Could not create a merchant session, please try again later'
			}
		}

		// Step 2: Validate session
		const sessionID = session.id
		const validSession = await isSessionValid(sessionID)
		logging ? console.error('validSession:', validSession) : null
		if (!validSession) {
			return {
				success: false,
				data: null,
				message: 'Your card session is not valid, please try again later'
			}
		}

		// Step 3: Prepare card details
		const cardDetails = {
			amount: session.allowedInstallments[0].totalAmount,
			cardNumber: card.cardNumber,
			cardExpiration: card.cardExpiration,
			cardSecurityCode: card.cardSecurityCode,
			fundingType: card.fundingType,
			holderName: card.holderName
		}
		logging ? console.error('cardDetails:', cardDetails) : null

		// Step 4: Make purchase
		const purchase = await merchantSessionPurchase(session.uuid, cardDetails)
		logging ? console.error('purchase:', purchase) : null

		if (!purchase) {
			logging ? console.error('no purchase!') : null
			return {
				success: false,
				data: null,
				message: 'Your card purchase is not valid, please try again later'
			}
		}

		// Step 5: Check for immediate errors
		if (purchase.code && purchase.message) {
			logging ? console.error('purchase error: ', purchase.message) : null
			return {
				success: false,
				data: null,
				message: purchase.message || 'Card payment was declined'
			}
		}

		// Step 6: Check purchase logs for errors
		const purchaseLogs = await getPurchaseLogs(purchase.id)
		const errorLogs = filterLogsForErrors(purchaseLogs)

		if (
			errorLogs &&
			errorLogs.length > 0 &&
			errorLogs[0].errors &&
			errorLogs[0].errors.length > 0
		) {
			return {
				success: false,
				data: null,
				message: errorLogs[0].errors[0].message || 'Card payment was declined'
			}
		}

		// Success - starkbank will save the card details
		const successObject = {
			success: true,
			data: {
				card_id: purchase.cardId,
				purchase_id: purchase.id,
				last_4_digits: purchase.cardEnding
			},
			message: null
		}
		console.log('successObject: ', successObject)
		return successObject
	} catch (error) {
		console.log('error: ', error)
		return {
			success: false,
			data: null,
			message: "We can't process your card right now sorry. Please try again later"
		}
	}
}

// for testing:

// ;(async () => {
// 	const card = await chargeCard(testCards[3], 250)
// 	console.log('card: ', card)
// })()
