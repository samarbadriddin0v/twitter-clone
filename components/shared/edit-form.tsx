'use client'

import { userSchema } from '@/lib/validation'
import { IUser } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import Button from '../ui/button'
import useEditModal from '@/hooks/useEditModal'
import useAction from '@/hooks/use-action'
import { updateUser } from '@/actions/user.action'

interface Props {
	user: IUser
}

const EditForm = ({ user }: Props) => {
	const { isLoading, onError, setIsLoading } = useAction()
	const editModal = useEditModal()

	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: { name: user.name || '', username: user.username || '', bio: user.bio || '', location: user.location || '' },
	})

	const onSubmit = async (values: z.infer<typeof userSchema>) => {
		setIsLoading(true)
		const res = await updateUser({ id: user._id, type: 'updateFields', ...values })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			editModal.onClose()
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 relative -top-8 mx-4'>
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
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder='Location' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='bio'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea placeholder='Bio' disabled={isLoading} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' label={'Save'} secondary large fullWidth disabled={isLoading} isLoading={isLoading} />
			</form>
		</Form>
	)
}

export default EditForm
