import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAlias, getAuthor, getPost, getUser } from "@/lib/db";

type PostData = {
	title: string,
	content: string,
	media?: string,
	reply?: string,
}

export async function POST(req: NextRequest)
{
	// Retrieve post info and the current server session
	const data: PostData = await req.json();
	const user = await getUser();

	if (user.user && user.alias && user.banned === null) {
		// Make sure the post has content
		if (!data.media && !data.content)
			return new Response("Missing post data", { status: 422 });

		// Check media links to ensure they are valid
		if (data.media) {
			try {
				const img = await fetch(data.media);
				if (!img.ok)
					throw new Error();
			} catch {
				return new Response("Invalid media URL in post", { status: 422 });
			}
		}

		const result = await prisma.post.create({
			data: {
				content: data.content,
				media: data.media,
				published: true,
				reply: data.reply ? { connect: { id: data.reply } } : undefined,
				author: { connect: { id: user.alias.id } },
				user: { connect: { id: user.user.id } },
			},
		});

		return Response.json(result);
	}

	return new Response("User not found", { status: 511 });
}