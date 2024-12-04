import { getNotifications } from '@/actions/user.action'
import ClearBtn from '@/components/shared/clear-btn'
import Header from '@/components/shared/header'
import { IPost } from '@/types'
import Image from 'next/image'

const Page = async ({ params }: { params: { userId: string } }) => {
	const res = await getNotifications({ postId: params.userId })

	const notifications = res?.data?.notifications

	return (
		<>
			<div className='flex items-center justify-between'>
				<Header isBack label='Notifications' />
				{notifications && notifications?.length > 0 && (
					<div className='w-1/4'>
						<ClearBtn />
					</div>
				)}
			</div>
			<div className='flex flex-col'>
				{notifications && notifications.length > 0 ? (
					notifications.map((notification: IPost) => (
						<div className='flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800' key={notification._id}>
							<Image alt='logo' src={'/images/x.svg'} width={32} height={32} />
							<p className='text-white'>{notification.body}</p>
						</div>
					))
				) : (
					<div className='text-neutral-600 text-center p-6 text-xl'>No notifications</div>
				)}
			</div>
		</>
	)
}

export default Page
