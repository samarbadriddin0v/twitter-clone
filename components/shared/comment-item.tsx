'use client'

import { IPost, IUser } from '@/types'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { sliceText } from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'
import { FaHeart } from 'react-icons/fa'
import { AiFillDelete } from 'react-icons/ai'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useAction from '@/hooks/use-action'
import { deleteComment, likeComment, unlikeComment } from '@/actions/comment.action'

interface Props {
	comment: IPost
	user: IUser
}

const CommentItem = ({ comment, user }: Props) => {
	const { isLoading, setIsLoading, onError } = useAction()

	const router = useRouter()

	const onLike = async () => {
		setIsLoading(true)
		let res
		if (!comment.hasLiked) {
			res = await likeComment({ id: comment._id })
		} else {
			res = await unlikeComment({ id: comment._id })
		}
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsLoading(false)
		}
	}

	const onDelete = async () => {
		setIsLoading(true)
		const res = await deleteComment({ id: comment._id })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsLoading(false)
		}
	}

	const goToProfile = (evt: any) => {
		evt.stopPropagation()
		router.push(`/profile/${user._id}`)
	}

	return (
		<div className='border-b-[1px] relative border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition'>
			{isLoading && (
				<div className='absolute inset-0 w-full h-full bg-black opacity-50'>
					<div className='flex justify-center items-center h-full'>
						<Loader2 className='animate-spin text-sky-500' />
					</div>
				</div>
			)}
			<div className='flex flex-row items-center gap-3'>
				<Avatar onClick={goToProfile}>
					<AvatarImage src={comment?.user.profileImage} />
					<AvatarFallback>{comment?.user.name[0]}</AvatarFallback>
				</Avatar>

				<div>
					<div className='flex flex-row items-center gap-2' onClick={goToProfile}>
						<p className='text-white font-semibold cursor-pointer hover:underline'>{comment?.user.name}</p>
						<span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
							{comment && comment?.user.username
								? `@${sliceText(comment.user.username, 20)}`
								: comment && sliceText(comment.user.email, 20)}
						</span>
						<span className='text-neutral-500 text-sm'>
							{comment && comment.createdAt && formatDistanceToNowStrict(new Date(comment.createdAt))}
						</span>
					</div>
					<div className='text-white mt-1'>{comment?.body}</div>

					<div className='flex flex-row items-center mt-3 gap-10'>
						<div
							className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
							onClick={onLike}
							role='button'
						>
							<FaHeart size={20} color={comment.hasLiked ? 'red' : ''} />
							<p>{comment.likes || 0}</p>
						</div>

						{comment.user._id === user._id && (
							<div
								className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
								onClick={onDelete}
								role='button'
							>
								<AiFillDelete size={20} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CommentItem
