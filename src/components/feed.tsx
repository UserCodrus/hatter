import { getAll, getPost, getPostHistory } from "@/lib/db";
import { ReactElement } from "react";
import { Post } from "./post";

/** A feed showing the posts made by the current user */
export async function HistoryFeed(props: { id: string, label: string }): Promise<ReactElement>
{
	const posts = await getPostHistory(props.id);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post id={post.id} author={post.author?.name} authorID={post.authorId} title={post.title} content={post.content} time={post.created} key={key} />);
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

/** A feed showing recent posts made on the app */
export async function GlobalFeed(props: { label: string }): Promise<ReactElement>
{
	const posts = await getAll();
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post id={post.id} author={post.author?.name} authorID={post.authorId} title={post.title} content={post.content} time={post.created} key={key} />);
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

/** A single post and its replies */
export async function PostFeed(props: { id: string }): Promise<ReactElement>
{
	const post = (await getPost(props.id)).props.content;

	if (post) {
		return (
			<div className="p-4 w-1/2">
				<div className="flex flex-col gap-2">
					<Post id={post.id} author={post.author?.name} authorID={post.authorId} title={post.title} content={post.content} time={post.created} />
				</div>
			</div>
		);
	} else {
		return (
			<div>
				Post not found.
			</div>
		);
	}
}