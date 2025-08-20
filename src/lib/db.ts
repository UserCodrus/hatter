import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { AuthSession, options } from "./auth";

/** Get the current alias for the user */
export async function getAlias()
{
	const session = await getServerSession(options) as AuthSession;
	const id = session?.user?.id;
	if (id) {
		const user_alias = await prisma.userAlias.findUnique({
			where: {
				userID: id
			},
			include: {
				alias: true
			}
		});

		return user_alias?.alias;
	}

	return null;
}

/** Get posts made by the current active user */
export async function getPostHistory()
{
	// Get the user's current alias
	const alias = await getAlias();
	console.log(`Current alias: ${alias?.name}`);

	if (alias?.id) {
		const content = await prisma.post.findMany({
			where: {
				authorId: alias?.id,
				published: true
			},
			orderBy: {
				created: "desc",
			},
			include: {
				author: {
					select: { name: true },
				},
			},
		});

		return {
			props: { content },
			revalidate: 10
		};
	}

	return {
		props: { content: [] },
		revalidate: 10
	};
};

/** Get posts made by a set of users */
export async function getPosts(users: string[])
{
	// Generate a set of search queries from the user list
	const filters = users.map((value) => {
		return {
			published: true,
			authorId: value
		}
	});

	// Find posts matching the provided users
	const content = await prisma.post.findMany({
		where: {
			OR: filters,
		},
		orderBy: {
			created: "desc",
		},
		include: {
			author: {
				select: { name: true },
			},
		},
	});

	return {
		props: { content },
		revalidate: 10
	};
}

/** Get all posts */
export async function getAll()
{
	// Find posts matching the provided users
	const content = await prisma.post.findMany({
		where: {
			published: true,
		},
		orderBy: {
			created: "desc",
		},
		include: {
			author: {
				select: { name: true },
			},
		},
	});

	return {
		props: { content },
		revalidate: 10
	};
}

/** Get a single post */
export async function getPost(id: string)
{
	console.log(id);
	
	// Find posts matching the provided users
	const content = await prisma.post.findUnique({
		where: {
			id: String(id)
		},
		include: {
			author: {
				select: { name: true },
			},
		},
	});

	console.log(content);

	return {
		props: { content },
		revalidate: 10
	};
}