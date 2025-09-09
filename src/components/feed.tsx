import { getAll, getLiked, getPost, getPosts } from "@/lib/db";
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
export async function UserFeed(props: { currentUser: string | undefined, userID: string, viewerID: string | undefined }): Promise<ReactElement>
{
	const posts = await getPosts([props.userID], props.currentUser);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post
			post={post}
			author={post.author}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post.replies.length}
			replied={post._count.replies > 0}
			key={key}
		/>);
		++key;
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing posts a user has liked */
export async function LikedFeed(props: { currentUser: string | undefined, userID: string, viewerID: string | undefined }): Promise<ReactElement>
{
	const posts = await getLiked(props.userID);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const result of posts) {
		components.push(<Post
			post={result.post}
			author={result.post.author}
			activeUser={props.viewerID}
			likes={result.post._count.likes}
			liked={result.post.likes.length > 0}
			replies={result.post.replies.length}
			replied={result.post._count.replies > 0}
			key={key}
		/>);
		++key;
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing recent posts made on the app */
export async function GlobalFeed(props: { currentUser: string | undefined, viewerID: string | undefined }): Promise<ReactElement>
{
	const posts = await getAll(props.currentUser);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts.props.content) {
		components.push(<Post
			post={post}
			author={post.author}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post.replies.length}
			replied={post._count.replies > 0}
			key={key}
		/>);
	}

	return (
		<Feed>
			{components}
		</Feed>
	);
}

/** A feed showing a single post and its replies */
export async function PostFeed(props: { currentUser: string | undefined, postID: string, viewerID: string | undefined }): Promise<ReactElement>
{
	const post = (await getPost(props.postID, props.currentUser)).props.content;

	if (post === null)
		notFound();

	return (
		<Feed>
			<Post
				post={post}
				author={post.author}
				activeUser={props.viewerID}
				likes={post._count.likes}
				liked={post.likes.length > 0}
				replies={post.replies.length}
				replied={post._count.replies > 0}
			/>
		</Feed>
	);
}