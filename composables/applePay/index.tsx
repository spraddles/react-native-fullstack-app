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
	): Promise<PaymentResponse['details']> => {
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
				setError(getErrorMessage())
				return {
					error: true
				}
			}
			// normal flow
			else {
				await paymentResponse.complete(PaymentComplete.SUCCESS)
				return paymentResponse.details
			}
		} catch (e) {
			console.log('Payment error: ', e)
			setError(getErrorMessage())
		}
	}

	return { processPayment }
}
