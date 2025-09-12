import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAlias, getAuthor, getPost } from "@/lib/db";

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
	const alias = await getAlias();

	// If the post is a reply, get the author of the post we are replying to
	const reply_author = await getAuthor(data.reply);

	if (alias) {
		// Push the post data to the database
		const result = await prisma.post.create({
			data: {
				title: data.reply ? reply_author?.tag : data.title,
				content: data.content,
				media: data.media,
				published: true,
				reply: data.reply ? { connect: { id: data.reply } } : undefined,
				author: { connect: { id: alias.id } },
			},
		});
		
		return Response.json(result);
	}

	return new Response("User not found", { status: 511 });
}