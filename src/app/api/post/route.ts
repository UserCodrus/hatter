import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAlias, getAuthor, getPost } from "@/lib/db";
import { Alias } from "@prisma/client";

type PostData = {
	title: string,
	content: string,
	media?: string,
	reply?: string,
}

/** Push a post to the database */
async function createPost(alias: Alias, data: PostData, author?: Alias): Promise<Response>
{
	const result = await prisma.post.create({
		data: {
			title: data.reply ? author?.tag : data.title,
			content: data.content,
			media: data.media,
			published: true,
			reply: data.reply ? { connect: { id: data.reply } } : undefined,
			author: { connect: { id: alias.id } },
		},
	});

	return Response.json(result);
}


export async function POST(req: NextRequest)
{
	// Retrieve post info and the current server session
	const data: PostData = await req.json();
	const alias = await getAlias();

	// If the post is a reply, get the author of the post we are replying to
	const reply_author = await getAuthor(data.reply);

	if (alias) {
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