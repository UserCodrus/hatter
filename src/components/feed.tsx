import { getAll, getLiked, getPost, getPostHistory } from "@/lib/db";
import { ReactElement, ReactNode } from "react";
import { Post } from "./post";
import { notFound } from "next/navigation";

/** The base layout for post feeds */
function Feed(props: {children: ReactNode}): ReactElement
{
	return (
		<div className="flex flex-col gap-2 w-full">
			{props.children}
		</div>
	);
}

/** A feed showing the posts made by a single user */
export async function UserFeed(props: { id: string }): Promise<ReactElement>
{
	const posts = await getPostHistory(props.id);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post post={post} author={post.author} likes={post.likes.length} key={key} />);
		++key;
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing posts a user has liked */
export async function LikedFeed(props: { id: string }): Promise<ReactElement>
{
	const posts = await getLiked(props.id);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const result of posts) {
		components.push(<Post post={result.post} author={result.post.author} likes={result.post._count.likes} key={key} />);
		++key;
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing recent posts made on the app */
export async function GlobalFeed(): Promise<ReactElement>
{
	const posts = await getAll();
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post post={post} author={post.author} likes={post.likes.length} key={key} />);
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing a single post and its replies */
export async function PostFeed(props: { id: string }): Promise<ReactElement>
{
	const post = (await getPost(props.id)).props.content;

	if (post === null)
		notFound();

	return (
		<Feed>
			<Post post={post} author={post.author} likes={post.likes.length} />
		</Feed>
	);
}