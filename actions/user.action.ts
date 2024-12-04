'use server'

import Notification from '@/database/notification.model'
import Post from '@/database/post.model'
import User from '@/database/user.model'
import { authOptions } from '@/lib/auth-options'
import { connectToDatabase } from '@/lib/mognoose'
import { actionClient } from '@/lib/safe-action'
import { followsSchema, getFollowSchema, idSchema, paramsSchema, updateUserSchema } from '@/lib/validation'
import { ReturnActionType } from '@/types'
import { FilterQuery } from 'mongoose'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export const getUsers = actionClient.schema(paramsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { page, pageSize, searchQuery } = parsedInput
	await connectToDatabase()

	const skipAmount = (+page - 1) * +pageSize
	const query: FilterQuery<typeof User> = {}

	if (searchQuery) {
		const escapedSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		query.$or = [
			{ name: { $regex: new RegExp(escapedSearchQuery, 'i') } },
			{ username: { $regex: new RegExp(escapedSearchQuery, 'i') } },
		]
	}

	const users = await User.find(query)
		.sort({ createdAt: 1 })
		.skip(skipAmount)
		.limit(+pageSize)
		.select('name username _id profileImage email')

	const totalUsers = await User.countDocuments(query)
	const isNext = totalUsers > skipAmount + +users.length

	return JSON.parse(JSON.stringify({ users, isNext }))
})

export const getUser = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	await connectToDatabase()
	const { id } = parsedInput
	const user = await User.findById(id)
	const session = await getServerSession(authOptions)
	const filteredUser = {
		_id: user?._id,
		name: user?.name,
		email: user?.email,
		coverImage: user?.coverImage,
		profileImage: user?.profileImage,
		username: user?.username,
		bio: user?.bio,
		location: user?.location,
		createdAt: user?.createdAt,
		followers: user?.followers?.length || 0,
		following: user?.following?.length || 0,
		isFollowing: user?.followers?.includes(session?.currentUser?._id) || false,
	}
	return JSON.parse(JSON.stringify({ user: filteredUser }))
})

export const getNotifications = actionClient.schema(paramsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { postId } = parsedInput
	await connectToDatabase()
	const session = await getServerSession(authOptions)
	if (!session) return { failure: 'You need to be logged in to view notifications' }
	const notifications = await Notification.find({ user: postId }).sort({ createdAt: -1 })
	await User.findByIdAndUpdate(session.currentUser?._id, { $set: { hasNewNotifications: false } })
	return JSON.parse(JSON.stringify({ notifications }))
})

export const getFollowUser = actionClient.schema(getFollowSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	await connectToDatabase()
	const { userId, state } = parsedInput
	const user = await User.findById(userId)
	if (state === 'following') {
		const following = await User.find({ _id: { $in: user.following } })
		return JSON.parse(JSON.stringify({ users: following, status: 200 }))
	} else if (state === 'followers') {
		const followers = await User.find({ _id: { $in: user.followers } })
		return JSON.parse(JSON.stringify({ users: followers, status: 200 }))
	}
})

export const getUserPosts = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { id } = parsedInput
	await connectToDatabase()
	const session = await getServerSession(authOptions)
	if (!session) return { failure: 'You need to be logged in to view posts' }
	const posts = await Post.find({ user: id })
		.populate({ path: 'user', model: User, select: 'name email profileImage _id username' })
		.sort({ createdAt: -1 })

	const filteredPosts = posts.map(post => ({
		body: post.body,
		createdAt: post.createdAt,
		user: {
			_id: post.user._id,
			name: post.user.name,
			username: post.user.username,
			profileImage: post.user.profileImage,
			email: post.user.email,
		},
		likes: post.likes.length,
		comments: post.comments.length,
		hasLiked: post.likes.includes(session.currentUser?._id),
		_id: post._id,
	}))

	return JSON.parse(JSON.stringify({ posts: filteredPosts, status: 200 }))
})

export const updateUser = actionClient.schema(updateUserSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { id, type } = parsedInput
	await connectToDatabase()

	if (type === 'updateImage') {
		await User.findByIdAndUpdate(id, parsedInput)
		revalidatePath(`/profile/${id}`)
		return { status: 200 }
	} else if (type === 'updateFields') {
		const existUser = await User.findById(id)
		if (parsedInput.username !== existUser.username) {
			const usernameExist = await User.exists({ username: parsedInput.username })
			if (usernameExist) {
				return { failure: 'Username already exists', status: 400 }
			}
		}
		await User.findByIdAndUpdate(id, parsedInput)
		revalidatePath(`/profile/${id}`)
		return { status: 200 }
	}
	return { failure: 'Invalid update type', status: 400 }
})

export const follow = actionClient.schema(followsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	await connectToDatabase()
	const { userId, currentUserId } = parsedInput
	const session = await getServerSession(authOptions)
	if (!session) return { failure: 'You need to be logged in to follow' }
	await User.findByIdAndUpdate(userId, { $push: { followers: currentUserId } })
	await User.findByIdAndUpdate(currentUserId, { $push: { following: userId } })
	await Notification.create({ user: userId, body: 'Someone followed you!' })
	await User.findOneAndUpdate({ _id: userId }, { $set: { hasNewNotifications: true } })
	revalidatePath(`/profile/${userId}`)
	return { status: 200 }
})

export const unfollow = actionClient.schema(followsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	await connectToDatabase()
	const { userId, currentUserId } = parsedInput
	await User.findByIdAndUpdate(userId, { $pull: { followers: currentUserId } })
	await User.findByIdAndUpdate(currentUserId, { $pull: { following: userId } })
	revalidatePath(`/profile/${userId}`)
	return { status: 200 }
})

export const deleteNotifications = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { id } = parsedInput
	await connectToDatabase()
	await Notification.deleteMany({ user: id })
	await User.findByIdAndUpdate(id, { $set: { hasNewNotifications: false } })
	revalidatePath(`/notifications/${id}`)
	return { status: 200 }
})
