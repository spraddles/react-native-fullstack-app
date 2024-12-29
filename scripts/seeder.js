import { faker } from '@faker-js/faker'
import { useBaseStore } from '../store/base.js'

export const dataStoreSeeder = () => {
	const user = {
		name: 'Bob',
		surname: 'Sender',
		email: 'bob.sender@gmail.com',
		phone: '02938475612',
		cpf: '91827361551'
	}

	useBaseStore.getState().setUser('name', user.name)
	useBaseStore.getState().setUser('surname', user.surname)
	useBaseStore.getState().setUser('email', user.email)
	useBaseStore.getState().setUser('phone', user.phone)
	useBaseStore.getState().setUser('cpf', user.cpf)

	const recipient = {
		name: faker.person.fullName(),
		cpf: faker.string.numeric(11),
		phone: faker.string.numeric(11),
		email: faker.internet.email()
	}

	const transactions = Array.from({ length: 10 }, () => ({
		id: faker.string.alphanumeric(9),
		dateTime: faker.date.recent({ days: 30 }).toISOString(),
		amount: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
		paymentType: 'pix',
		pixMethod: faker.helpers.arrayElement(['cpf', 'phone', 'email']),
		pixMethodValue: faker.helpers.arrayElement([
			recipient.cpf,
			recipient.phone,
			recipient.email
		]),
		receiver: faker.person.fullName()
	}))

	transactions.forEach((transaction) => {
		useBaseStore.getState().addTransaction(transaction)
	})
}
