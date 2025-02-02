import { PaymentComplete, type PaymentResponse } from '@rnw-community/react-native-payments'
import { getErrorMessage } from '@rnw-community/shared'

import { createPaymentRequest } from './createPaymentRequest'
import { getAndroidPaymentMethodData } from './androidPaymentMethodData'
import { getIosPaymentMethodData } from './iosPaymentMethodData'
import { paymentDetails } from './paymentDetails'

export const ApplePay = () => {
	const processPayment = async (
		setError: (error: string) => void,
		setResponse: (response: PaymentResponse['details'] | undefined) => void
	): Promise<{
		error?: string | boolean
		response?: PaymentResponse['details']
	}> => {
		setError('')
		setResponse(undefined)

		try {
			const paymentResponse = await createPaymentRequest({
				iosPaymentMethodData: getIosPaymentMethodData({}),
				androidPaymentMethodData: getAndroidPaymentMethodData({}),
				paymentDetails: paymentDetails
			}).show()

			setResponse(paymentResponse.details)

			// fail payment for testing
			if (process.env.EXPO_PUBLIC_FORCE_FAIL_PAYMENT === 'true') {
				await paymentResponse.complete(PaymentComplete.FAIL)
				const errorMsg = getErrorMessage()
				setError(errorMsg)
				return {
					error: true,
					response: errorMsg
				}
			}
			// normal flow
			else {
				await paymentResponse.complete(PaymentComplete.SUCCESS)
				return {
					error: false,
					response: paymentResponse
				}
			}
		} catch (e) {
			console.log('Payment error: ', e)
			const errorMsg = getErrorMessage()
			setError(errorMsg)
			return {
				error: true,
				response: errorMsg
			}
		}
	}

	return { processPayment }
}
