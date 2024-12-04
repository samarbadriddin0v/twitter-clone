'use server'

import Comment from '@/database/comment.model'
import Notification from '@/database/notification.model'
import Post from '@/database/post.model'
import User from '@/database/user.model'
import { authOptions } from '@/lib/auth-options'
import { connectToDatabase } from '@/lib/mognoose'
import { actionClient } from '@/lib/safe-action'
import { createCommentSchema, idSchema, paramsSchema } from '@/lib/validation'
import { ReturnActionType } from '@/types'
import { FilterQuery } from 'mongoose'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

export const getComments = actionClient.schema(paramsSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { page, pageSize, postId } = parsedInput
	await connectToDatabase()

	const query: FilterQuery<typeof Comment> = { post: postId }
	const skipAmount = (+page - 1) * +pageSize

	const comments = await Comment.find(query)
		.populate({ path: 'user', model: User, select: 'name email profileImage _id username' })
		.sort({ createdAt: -1 })
		.skip(skipAmount)
		.limit(+pageSize)

	const totalProducts = await Comment.countDocuments(query)
	const isNext = totalProducts > skipAmount + +comments.length

	const session = await getServerSession(authOptions)

	const filteredComments = comments.map(comment => ({
		body: comment.body,
		createdAt: comment.createdAt,
		user: {
			_id: comment.user._id,
			name: comment.user.name,
			username: comment.user.username,
			profileImage: comment.user.profileImage,
			email: comment.user.email,
		},
		likes: comment.likes.length,
		hasLiked: comment.likes.includes(session?.currentUser?._id),
		_id: comment._id,
	}))

	return JSON.parse(JSON.stringify({ comments: filteredComments, isNext }))
})

export const createComment = actionClient.schema(createCommentSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { body, id } = parsedInput
	await connectToDatabase()
	const session = await getServerSession(authOptions)
	if (!session) return { failure: 'You must be logged in to create a comment.' }
	const comment = await Comment.create({ body, post: id, user: session.currentUser?._id })
	const post = await Post.findByIdAndUpdate(id, { $push: { comments: comment._id } })
	await Notification.create({
		user: String(post.user),
		body: `${session.currentUser?.name} replied on your post!`,
	})
	await User.findOneAndUpdate({ _id: String(post.user) }, { $set: { hasNewNotifications: true } })
	revalidatePath(`/posts/${id}`)
	return { status: 200 }
})

export const likeComment = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { id } = parsedInput
	await connectToDatabase()
	const session = await getServerSession(authOptions)
	if (!session) return { failure: 'You must be logged in to like a comment.' }
	const comment = await Comment.findByIdAndUpdate(id, { $push: { likes: session.currentUser?._id } })
	await Notification.create({
		user: String(comment.user),
		body: `${session.currentUser?.name} liked on your replied post!`,
	})
	await User.findOneAndUpdate({ _id: String(comment.user) }, { $set: { hasNewNotifications: true } })
	revalidatePath(`/posts/${comment.post}`)
	return { status: 200 }
})

export const unlikeComment = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { id } = parsedInput
	await connectToDatabase()
	const session = await getServerSession(authOptions)
	if (!session) return { failure: 'You must be logged in to unlike a comment.' }
	const comment = await Comment.findByIdAndUpdate(id, { $pull: { likes: session.currentUser?._id } })
	await Notification.create({
		user: String(comment.user),
		body: `${session.currentUser?.name} unliked on your replied post!`,
	})
	await User.findOneAndUpdate({ _id: String(comment.user) }, { $set: { hasNewNotifications: true } })
	revalidatePath(`/posts/${comment.post}`)
	return { status: 200 }
})

export const deleteComment = actionClient.schema(idSchema).action<ReturnActionType>(async ({ parsedInput }) => {
	const { id } = parsedInput
	await connectToDatabase()
	const session = await getServerSession(authOptions)
	if (!session) return { failure: 'You must be logged in to delete a comment.' }
	const comment = await Comment.findByIdAndDelete(id)
	await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } })
	revalidatePath(`/posts/${comment.post}`)
	return { status: 200 }
})
