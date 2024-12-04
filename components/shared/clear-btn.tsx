'use client'

import useAction from '@/hooks/use-action'
import Button from '../ui/button'
import { deleteNotifications } from '@/actions/user.action'
import { useSession } from 'next-auth/react'
import { toast } from '../ui/use-toast'

const ClearBtn = () => {
	const { isLoading, onError, setIsLoading } = useAction()
	const { data } = useSession()

	const onClear = async () => {
		setIsLoading(true)
		const res = await deleteNotifications({ id: data?.currentUser?._id! })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast({ title: 'Success', description: 'Notifications cleared' })
			setIsLoading(false)
		}
	}

	return (
		<div className='mt-4 flex justify-center'>
			<Button outline label={'Clear all'} onClick={onClear} disabled={isLoading} isLoading={isLoading} />
		</div>
	)
}

export default ClearBtn
