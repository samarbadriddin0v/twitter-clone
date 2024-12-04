import Header from '@/components/shared/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { sliceText } from '@/lib/utils'
import { SearchParams } from '@/types'
import Link from 'next/link'
import { FC } from 'react'
import SearchInput from '@/components/shared/search-input'
import { getUsers } from '@/actions/user.action'
import Pagination from '@/components/shared/pagination'

interface Props {
	searchParams: SearchParams
}
const Page: FC<Props> = async ({ searchParams }) => {
	const res = await getUsers({
		page: parseInt(`${searchParams.page}`) || 1,
		pageSize: parseInt(`${searchParams.pageSize}`) || 0,
		searchQuery: `${searchParams.q || ''}`,
	})

	const users = res?.data?.users
	const isNext = res?.data?.isNext || false

	return (
		<>
			<Header label='Explore' />
			<SearchInput />

			<>
				{users && users.length === 0 && <div className='text-neutral-600 text-center p-6 text-xl'>No users found</div>}
				<div className='grid grid-cols-1 lg:grid-cols-2 mt-6'>
					{users &&
						users.map(user => (
							<Link key={user._id} href={`/profile/${user._id}`}>
								<div className='border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative mr-4'>
									<div className='flex flex-row gap-4'>
										<Avatar>
											<AvatarImage src={user.profileImage} />
											<AvatarFallback>{user.name[0]}</AvatarFallback>
										</Avatar>

										<div className='flex flex-col'>
											<p className='text-white font-semibold cursor-pointer capitalize'>{user.name}</p>

											<span className='text-neutral-500 cursor-pointer md:block'>
												{user.username ? `@${sliceText(user.username, 16)}` : sliceText(user.email, 16)}
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
				</div>
				<Pagination isNext={isNext} pageNumber={searchParams?.page ? +searchParams.page : 1} />
			</>
		</>
	)
}

export default Page
