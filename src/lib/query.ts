import { Prisma } from "@prisma/client";

/**
 * A portion of a prisma post query
 * Includes data about the post author needed to display the author's info in each post
 * */
const author_data: Prisma.AliasDefaultArgs = {
	select: {
		name: true,
		tag: true,
	}
}

/**
 * A portion of a prisma post query
 * Queries like relations with the user's current alias to determine if the user has liked the post
 * */
const like_data = (alias: string | undefined): Prisma.Post$likesArgs => {
	return {
		where: {
			userID: alias,
		},
		select: {
			user: {
				select: {
					tag: true,
				},
			},
		},
	}
}

/**
 * A portion of a prisma post query
 * Queries rply relations with the user's current alias to determine if the user has replied to a post
 * */
const reply_data = (alias: string | undefined): Prisma.Post$repliesArgs => {
	return {
		where: {
			authorId: alias
		},
		select: {
			author: {
				select: {
					tag: true
				}
			}
		},
	}
}

/**
 * A portion of a prisma post query
 * Counts the number of likes a post has and the number of times the active user has replied to the post
 * */
const count_data = (alias: string | undefined): Prisma.PostCountOutputTypeDefaultArgs => {
	return {
		select: {
			likes: true,
			replies: true,
		}
	}
}

/** A prisma include config that specifies which data should be returned from a set of posts */
export const prisma_post_query = (alias: string | undefined): Prisma.PostInclude => {
	return {
		author: author_data,
		likes: like_data(alias),
		replies: reply_data(alias),
		_count: count_data(alias),
	}
}