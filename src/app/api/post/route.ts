import { getServerSession } from "next-auth";
import { options } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

type PostData = {
	title: string,
	content: string
}

export async function POST(req: NextRequest)
{
	// Retrieve post info and the current server session
	const data: PostData = await req.json();
	const session = await getServerSession(options);

	const email = session?.user?.email;
	if (email) {
		// Push the post data to the database
		const result = await prisma.post.create({
			data: {
				title: data.title,
				content: data.content,
				published: true,
				author: { connect: { email: email }}
			},
		});
		
		return Response.json(result);
	}

	return new Response("User not found", { status: 511 });
}