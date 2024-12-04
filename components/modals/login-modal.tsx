import React, { useCallback, useState } from 'react'
import Modal from '../ui/modal'
import useLoginModal from '@/hooks/useLoginModal'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import Button from '../ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validation'
import useRegisterModal from '@/hooks/useRegisterModal'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '../ui/alert'
import { signIn } from 'next-auth/react'
import useAction from '@/hooks/use-action'
import { login } from '@/actions/auth.action'

export default function LoginModal() {
	const { isLoading, onError, setIsLoading } = useAction()
	const [error, setError] = useState('')

	const loginModal = useLoginModal()
	const registerModal = useRegisterModal()

	const onToggle = useCallback(() => {
		loginModal.onClose()
		registerModal.onOpen()
	}, [loginModal, registerModal])

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: { password: '', email: '' },
	})

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true)
		const res = await login(values)
		if (res?.serverError || res?.validationErrors || !res?.data) {
			setError('Something went wrong')
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			setError(res.data.failure)
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			signIn('credentials', values)
			loginModal.onClose()
			setIsLoading(false)
		}
	}

	const { isSubmitting } = form.formState

	const bodyContent = (
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
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Email' disabled={isLoading} {...field} />
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
								<Input placeholder='Password' disabled={isLoading} type='password' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button label={'Login'} type='submit' secondary fullWidth large disabled={isLoading} isLoading={isLoading} />
			</form>
		</Form>
	)

	const footer = (
		<div className='text-neutral-400 text-center mb-4'>
			<p>
				First time using X?
				<span className='text-white cursor-pointer hover:underline' onClick={onToggle}>
					{' '}
					Create an account
				</span>
			</p>
		</div>
	)

	return <Modal isOpen={loginModal.isOpen} onClose={loginModal.onClose} body={bodyContent} footer={footer} />
}
