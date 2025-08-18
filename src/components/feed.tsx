import { getPosts } from "@/lib/db";
import { ReactElement, ReactNode } from "react";
import { Post } from "./post";

export async function Feed(props: { label: string }): Promise<ReactElement>
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
		<div className="p-4 w-1/2">
			<div className="text-xl font-bold p-2">{props.label}</div>
			<div className="flex flex-col gap-2">
				{components}
			</div>
		</div>
	);
}