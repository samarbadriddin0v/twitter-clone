'use client'

import { IUser } from '@/types'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Button from '../ui/button'
import { toast } from '../ui/use-toast'
import { createPost } from '@/actions/post.action'
import useAction from '@/hooks/use-action'
import { createComment } from '@/actions/comment.action'
import { useParams } from 'next/navigation'

interface Props {
	placeholder: string
	user: IUser
	postId?: string
	isComment?: boolean
}

const Form = ({ placeholder, user, isComment }: Props) => {
	const { isLoading, setIsLoading, onError } = useAction()
	const [body, setBody] = useState('')
	const { postId } = useParams<{ postId: string }>()

	const onSubmit = async () => {
		setIsLoading(true)
		let res
		if (isComment) {
			res = await createComment({ body, id: postId })
		} else {
			res = await createPost({ body })
		}
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast({ title: 'Success', description: 'Tweet created successfully' })
			setBody('')
		}
		setIsLoading(false)
	}

	return (
		<div className='border-b-[1px] border-neutral-800 px-5 py-2'>
			<div className='flex flex-row gap-4'>
				<Avatar>
					<AvatarImage src={user.profileImage} />
					<AvatarFallback>{user.name[0]}</AvatarFallback>
				</Avatar>

				<div className='w-full'>
					<textarea
						className='disabled:opacity-80 peer resize-none mt-3 w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white h-[50px]'
						placeholder={placeholder}
						disabled={isLoading}
						value={body}
						onChange={e => setBody(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && onSubmit()}
					></textarea>
					<hr className='opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition' />

					<div className='mt-4 flex flex-row justify-end'>
						<Button
							label={isComment ? 'Reply' : 'Post'}
							classNames='px-8'
							disabled={isLoading || !body}
							onClick={onSubmit}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Form
