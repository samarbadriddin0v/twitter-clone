'use server'

import { compare, hash } from 'bcrypt'
import User from '@/database/user.model'
import { connectToDatabase } from '@/lib/mognoose'
import { actionClient } from '@/lib/safe-action'
import { loginSchema, registerSchema } from '@/lib/validation'
import { ReturnActionType } from '@/types'

export const login = actionClient.schema(loginSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	await connectToDatabase()
	const { email, password } = parsedInput
	const isExistingUser = await User.findOne({ email })

	if (!isExistingUser) return { failure: 'Email does not exist', status: 400 }

	const isPasswordValid = await compare(password, isExistingUser.password)
	if (!isPasswordValid) return { failure: 'Password is incorrect', status: 400 }

	return JSON.parse(JSON.stringify({ status: 200, user: isExistingUser }))
})

export const register = actionClient.schema(registerSchema).action(async ({ parsedInput }) => {
	await connectToDatabase()
	const { email, password, name, step, username } = parsedInput

	if (step == 1) {
		const isExistingUser = await User.findOne({ email })
		if (isExistingUser) return { failure: 'Email already exists', status: 400 }
		return { status: 200 }
	} else if (step == 2) {
		const isExistinUsername = await User.findOne({ username })

		if (isExistinUsername) return { failure: 'Username already exists', status: 400 }

		const hashedPassword = await hash(password!, 10)

		const user = await User.create({ email, username, name, password: hashedPassword })

		return JSON.parse(JSON.stringify({ status: 200, user }))
	}
})
