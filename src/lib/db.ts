import prisma from "@/lib/prisma";

// Pull data from the database
export async function getPosts() {
	const content = await prisma.post.findMany({
		where: { published: true },
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
};