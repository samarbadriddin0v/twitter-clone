import { getPosts } from '@/actions/post.action'
import Form from '@/components/shared/form'
import Header from '@/components/shared/header'
import Pagination from '@/components/shared/pagination'
import PostItem from '@/components/shared/post-item'
import { authOptions } from '@/lib/auth-options'
import { IPost, SearchParams } from '@/types'
import { getServerSession } from 'next-auth'

interface Props {
	searchParams: SearchParams
}
export default async function Page({ searchParams }: Props) {
	const session = await getServerSession(authOptions)

	const res = await getPosts({
		page: parseInt(`${searchParams.page}`) || 1,
	})

	const posts = res?.data?.posts
	const isNext = res?.data?.isNext || false
	const user = JSON.parse(JSON.stringify(session?.currentUser))

	return (
		<>
			<Header label='Home' />
			<Form placeholder="What's on your mind?" user={user} />
			{posts && posts.map(post => <PostItem key={post._id} post={post} user={user} />)}
			<Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
		</>
	)
}
