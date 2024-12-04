import { getUser } from '@/actions/user.action'
import ProfileBio from '@/components/profile/profile-bio'
import ProfileHero from '@/components/profile/profile-hero'
import Header from '@/components/shared/header'
import PostFeed from '@/components/shared/post-feed'
import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'
import React from 'react'

const Page = async ({ params }: { params: { userId: string } }) => {
	const res = await getUser({ id: params.userId })
	const session = await getServerSession(authOptions)

	const user = JSON.parse(JSON.stringify(res?.data?.user))

	console.log(user)

	return (
		<>
			<Header label={user?.name!} isBack />
			<ProfileHero user={user} />
			<ProfileBio user={user} userId={JSON.parse(JSON.stringify(session?.currentUser?._id))} />
			<PostFeed userId={params.userId} user={JSON.parse(JSON.stringify(session?.currentUser))} />
		</>
	)
}

export default Page
