import { getServerSession } from "next-auth";
import { options } from "@/lib/auth";
import prisma from "@/lib/prisma";

type PostData = {
	title: string,
	content: string
}

export async function POST(req: Request, res: Response)
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
				author: { connect: { email: email }}
			},
		});
		
		return Response.json(result);
	}

	return Response.json("Whoops.");
}