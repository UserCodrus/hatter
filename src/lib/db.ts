import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { options } from "./auth";

/** Get posts made by the current active user */
export async function getPostHistory()
{
	const session = await getServerSession(options);
	
	const email = session?.user?.email;
	if (email) {
		const content = await prisma.post.findMany({
			where: {
				published: true,
				author: { email: email }
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
			author: { email: value }
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