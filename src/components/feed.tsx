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
export async function UserFeed(props: { userID: string, viewerID: string | undefined }): Promise<ReactElement>
{
	const posts = await getPostHistory(props.userID);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post post={post} author={post.author} activeUser={props.viewerID} likes={post._count.likes} liked={post.likes.length > 0} key={key} />);
		++key;
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing posts a user has liked */
export async function LikedFeed(props: { userID: string, viewerID: string | undefined }): Promise<ReactElement>
{
	const posts = await getLiked(props.userID);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const result of posts) {
		components.push(<Post post={result.post} author={result.post.author} activeUser={props.viewerID} likes={result.post._count.likes} liked={result.post.likes.length > 0} key={key} />);
		++key;
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing recent posts made on the app */
export async function GlobalFeed(props: { viewerID: string | undefined }): Promise<ReactElement>
{
	const posts = await getAll();
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post post={post} author={post.author} activeUser={props.viewerID} likes={post._count.likes} liked={post.likes.length > 0} key={key} />);
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing a single post and its replies */
export async function PostFeed(props: { postID: string, viewerID: string | undefined }): Promise<ReactElement>
{
	const post = (await getPost(props.postID)).props.content;

	if (post === null)
		notFound();

	return (
		<Feed>
			<Post post={post} author={post.author} activeUser={props.viewerID} likes={post._count.likes} liked={post.likes.length > 0} />
		</Feed>
	);
}