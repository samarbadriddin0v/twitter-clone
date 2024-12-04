import * as z from 'zod'

export const registerStep1Schema = z.object({
	email: z.string().email(),
	name: z.string().min(3),
})

export const registerStep2Schema = z.object({
	password: z.string().min(6),
	username: z.string().min(3),
})

export const registerSchema = z.object({
	step: z.number().min(1).max(2),
	email: z.string().email().optional(),
	name: z.string().min(3).optional(),
	password: z.string().min(6).optional(),
	username: z.string().min(3).optional(),
})

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})

export const userSchema = z.object({
	name: z.string().min(3),
	username: z.string().min(3),
	bio: z.string().min(3),
	location: z.string().min(3),
})

export const paramsSchema = z.object({
	page: z.number().optional().default(1),
	pageSize: z.number().optional().default(20),
	searchQuery: z.string().optional(),
	filter: z.string().optional(),
	postId: z.string().optional(),
})

export const createPostSchema = z.object({
	body: z.string().min(3),
})

export const idSchema = z.object({
	id: z.string(),
})

export const createCommentSchema = z.object({}).merge(createPostSchema).merge(idSchema)

export const followsSchema = z.object({
	userId: z.string(),
	currentUserId: z.string(),
})

export const getFollowSchema = z.object({
	userId: z.string(),
	state: z.string(),
})

export const updateUserSchema = z
	.object({
		profileImage: z.string().optional(),
		coverImage: z.string().optional(),
		type: z.string().optional(),
		name: z.string().min(3).optional(),
		username: z.string().min(3).optional(),
		bio: z.string().min(3).optional(),
		location: z.string().min(3).optional(),
	})
	.merge(idSchema)
