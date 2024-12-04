'use client'

import { IUser } from '@/types'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { sliceText } from '@/lib/utils'
import Button from '../ui/button'
import { follow, unfollow } from '@/actions/user.action'
import useAction from '@/hooks/use-action'

interface Props {
	user: IUser
	setFollowing: React.Dispatch<React.SetStateAction<IUser[]>>
}

const FollowUser = ({ user, setFollowing }: Props) => {
	const { isLoading, setIsLoading, onError } = useAction()
	const [profile, setProfile] = useState<IUser>(user)

	const router = useRouter()
	const { data: session } = useSession()
	const { userId } = useParams<{ userId: string }>()

	const onFollow = async () => {
		setIsLoading(true)
		const res = await follow({ userId: user._id, currentUserId: session?.currentUser?._id! })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsLoading(false)
			if (userId === session?.currentUser?._id) {
				setFollowing(prev => [
					...prev,
					{ ...user, followers: [...user.followers.filter(f => f !== undefined), session.currentUser?._id as string] },
				])
			}
			setProfile(prev => ({
				...prev,
				followers: [...(prev.followers.filter(f => f !== undefined) as string[]), session?.currentUser?._id as string],
			}))
		}
	}

	const onUnfollow = async () => {
		setIsLoading(true)
		const res = await unfollow({ userId: user._id, currentUserId: session?.currentUser?._id! })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsLoading(false)
			if (userId === session?.currentUser?._id) {
				setFollowing(prev => prev.filter(following => following._id !== user._id))
			}
			setProfile(prev => ({
				...prev,
				followers: prev.followers.filter(follower => follower !== session?.currentUser?._id),
			}))
		}
	}

	const goToProfile = (evt: any) => {
		evt.stopPropagation()
		router.push(`/profile/${user._id}`)
	}

	return (
		<div className='flex gap-3 items-center justify-between cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 transition py-2 px-3 rounded-md'>
			<div className='flex gap-2 cursor-pointer'>
				<Avatar onClick={goToProfile}>
					<AvatarImage src={profile.profileImage} />
					<AvatarFallback>{profile.name[0]}</AvatarFallback>
				</Avatar>

				<div className='flex flex-col' onClick={goToProfile}>
					<p className='text-white font-semibold text-sm line-clamp-1'>{profile.name}</p>
					<p className='text-neutral-400 text-sm line-clamp-1'>
						{profile.username ? `@${sliceText(user.username, 20)}` : sliceText(user.email, 20)}
					</p>
				</div>
			</div>

			{profile._id !== session?.currentUser?._id ? (
				profile.followers.includes(session?.currentUser?._id!) ? (
					<Button
						label={'Unfollow'}
						outline
						classNames='h-[30px] p-0 w-fit px-3 text-sm'
						disabled={isLoading}
						onClick={onUnfollow}
					/>
				) : (
					<Button label={'Follow'} classNames='h-[30px] p-0 w-fit px-3 text-sm' disabled={isLoading} onClick={onFollow} />
				)
			) : null}
		</div>
	)
}

export default FollowUser
