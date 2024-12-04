'use client'

import { IPost, IUser } from '@/types'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import PostItem from './post-item'
import useAction from '@/hooks/use-action'
import { getUserPosts } from '@/actions/user.action'

interface Props {
	userId: string
	user: IUser
}

const PostFeed = ({ userId, user }: Props) => {
	const { isLoading, setIsLoading, onError } = useAction()
	const [posts, setPosts] = useState<IPost[]>([])

	const getPosts = async () => {
		setIsLoading(true)
		const res = await getUserPosts({ id: userId })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsLoading(false)
			res.data.posts && setPosts(res.data.posts)
		}
	}

	useEffect(() => {
		getPosts()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId])

	return isLoading ? (
		<div className='flex justify-center items-center h-24'>
			<Loader2 className='animate-spin text-sky-500' />
		</div>
	) : (
		posts.map(post => <PostItem key={post._id} post={post} user={user} />)
	)
}

export default PostFeed
