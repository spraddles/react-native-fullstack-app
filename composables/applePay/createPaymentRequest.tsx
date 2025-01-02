import {
	type AndroidPaymentMethodDataInterface,
	type IosPaymentMethodDataInterface,
	type PaymentDetailsInit,
	PaymentRequest
} from '@rnw-community/react-native-payments'

import { getAndroidPaymentMethodData } from './androidPaymentMethodData'
import { getIosPaymentMethodData } from './iosPaymentMethodData'
import { paymentDetails as defaultPaymentDetails } from './paymentDetails'

interface CreatePaymentRequestProps {
	androidPaymentMethodData?: AndroidPaymentMethodDataInterface
	iosPaymentMethodData?: IosPaymentMethodDataInterface
	paymentDetails?: PaymentDetailsInit
}

export const createPaymentRequest = ({
	androidPaymentMethodData = getAndroidPaymentMethodData(),
	iosPaymentMethodData = getIosPaymentMethodData(),
	paymentDetails = defaultPaymentDetails
}: CreatePaymentRequestProps = {}): PaymentRequest =>
	new PaymentRequest([iosPaymentMethodData, androidPaymentMethodData], paymentDetails)
