import { getComments } from '@/actions/comment.action'
import { getPost } from '@/actions/post.action'
import CommentItem from '@/components/shared/comment-item'
import Form from '@/components/shared/form'
import Header from '@/components/shared/header'
import Pagination from '@/components/shared/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { authOptions } from '@/lib/auth-options'
import { sliceText } from '@/lib/utils'
import { SearchParams } from '@/types'
import { formatDistanceToNowStrict } from 'date-fns'
import { getServerSession } from 'next-auth'
import React from 'react'

interface Props {
	params: { postId: string }
	searchParams: SearchParams
}
const Page = async ({ params, searchParams }: Props) => {
	const [posRes, commentRes] = await Promise.all([
		getPost({ id: params.postId }),
		getComments({ postId: params.postId, page: parseInt(`${searchParams.page}`) || 1 }),
	])

	const session = await getServerSession(authOptions)

	const post = posRes?.data?.post
	const comments = commentRes?.data?.comments
	const isNext = commentRes?.data?.isNext || false
	const user = JSON.parse(JSON.stringify(session?.currentUser))

	return (
		<>
			<Header label='Posts' isBack />

			<>
				<div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer bg-neutral-900 transition'>
					<div className='flex flex-row items-center gap-3'>
						<Avatar>
							<AvatarImage src={post?.user.profileImage} />
							<AvatarFallback>{post?.user.name[0]}</AvatarFallback>
						</Avatar>

						<div>
							<div className='flex flex-row items-center gap-2'>
								<p className='text-white font-semibold cursor-pointer hover:underline'>{post?.user.name}</p>
								<span className='text-neutral-500 cursor-pointer hover:underline hidden md:block'>
									{post && post?.user.username ? `@${sliceText(post.user.username, 20)}` : post && sliceText(post.user.email, 20)}
								</span>
								<span className='text-neutral-500 text-sm'>
									{post && post.createdAt && formatDistanceToNowStrict(new Date(post.createdAt))}
								</span>
							</div>
							<div className='text-white mt-1'>{post?.body}</div>
						</div>
					</div>
				</div>

				<Form placeholder='Post your reply?' user={user} isComment />

				{comments && comments.map(comment => <CommentItem comment={comment} key={comment._id} user={user} />)}
				<Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
			</>
		</>
	)
}

export default Page
