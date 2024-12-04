'use client'

import useRegisterModal from '@/hooks/useRegisterModal'
import Modal from '../ui/modal'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerStep1Schema, registerStep2Schema } from '@/lib/validation'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import Button from '../ui/button'
import useLoginModal from '@/hooks/useLoginModal'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import useAction from '@/hooks/use-action'
import { register } from '@/actions/auth.action'

export default function RegisterModal() {
	const [step, setStep] = useState(1)
	const [data, setData] = useState({ name: '', email: '' })

	const registerModal = useRegisterModal()
	const loginModal = useLoginModal()

	const onToggle = useCallback(() => {
		registerModal.onClose()
		loginModal.onOpen()
	}, [loginModal, registerModal])

	const bodyContent = step === 1 ? <RegisterStep1 setData={setData} setStep={setStep} /> : <RegisterStep2 data={data} />

	const footer = (
		<div className='text-neutral-400 text-center mb-4'>
			<p>
				Already have an account?{' '}
				<span className='text-white cursor-pointer hover:underline' onClick={onToggle}>
					Sign in
				</span>
			</p>
		</div>
	)

	return (
		<Modal
			body={bodyContent}
			footer={footer}
			isOpen={registerModal.isOpen}
			onClose={registerModal.onClose}
			step={step}
			totalSteps={2}
		/>
	)
}

function RegisterStep1({
	setData,
	setStep,
}: {
	setData: Dispatch<SetStateAction<{ name: string; email: string }>>
	setStep: Dispatch<SetStateAction<number>>
}) {
	const { isLoading, onError, setIsLoading } = useAction()
	const [error, setError] = useState('')

	const form = useForm<z.infer<typeof registerStep1Schema>>({
		resolver: zodResolver(registerStep1Schema),
		defaultValues: { email: '', name: '' },
	})

	async function onSubmit(values: z.infer<typeof registerStep1Schema>) {
		setIsLoading(true)
		const res = await register({ email: values.email, name: values.name, step: 1 })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			setError('Something went wrong')
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			setError(res.data.failure)
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setData(values)
			setStep(2)
			setIsLoading(false)
		}
	}

	const { isSubmitting } = form.formState

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-12'>
				{error && (
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Name' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Email' disabled={isLoading} type='email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button label={'Next'} type='submit' secondary fullWidth large disabled={isLoading} isLoading={isLoading} />
			</form>
		</Form>
	)
}

function RegisterStep2({ data }: { data: { name: string; email: string } }) {
	const { isLoading, onError, setIsLoading } = useAction()
	const [error, setError] = useState('')
	const registerModal = useRegisterModal()

	const form = useForm<z.infer<typeof registerStep2Schema>>({
		resolver: zodResolver(registerStep2Schema),
		defaultValues: { password: '', username: '' },
	})

	async function onSubmit(values: z.infer<typeof registerStep2Schema>) {
		setIsLoading(true)
		const res = await register({
			email: data.email,
			name: data.name,
			step: 2,
			username: values.username,
			password: values.password,
		})
		if (res?.serverError || res?.validationErrors || !res?.data) {
			setError('Something went wrong')
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			setError(res.data.failure)
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			signIn('credentials', {
				email: data.email,
				password: values.password,
			})
			registerModal.onClose()
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-12'>
				{error && (
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Username' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Password' type='password' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button label={'Register'} type='submit' secondary fullWidth large disabled={isLoading} isLoading={isLoading} />
			</form>
		</Form>
	)
}
