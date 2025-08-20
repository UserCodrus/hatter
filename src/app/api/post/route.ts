import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getAlias } from "@/lib/db";

type PostData = {
	title: string,
	content: string
}

export async function POST(req: NextRequest)
{
	// Retrieve post info and the current server session
	const data: PostData = await req.json();
	const alias = await getAlias();

	if (alias) {
		// Push the post data to the database
		const result = await prisma.post.create({
			data: {
				title: data.title,
				content: data.content,
				published: true,
				author: { connect: { id: alias.id }}
			},
		});
		
		return Response.json(result);
	}

	return new Response("User not found", { status: 511 });
}