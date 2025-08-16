import prisma from "@/lib/prisma";
import { ReactElement } from "react";
import { Feed } from "./feed";
import { Post } from "./post";
import { Header } from "./header";

// Pull data from the database
async function getPosts() {
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

export async function Content(): Promise<ReactElement>
{
	const posts = await getPosts();

	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post author={post.author?.name} title={post.title} content={post.content} time={post.created} key={key} />);
		++key;
	}

	return (
		<div className="flex flex-col w-full items-center">
			<Header />
			<Feed label="Public Feed">
				{components}
			</Feed>
		</div>
	);
}