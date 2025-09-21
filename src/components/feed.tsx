import { getAll, getLiked, getPost, getPosts, getReplies } from "@/lib/db";
import { ReactElement, ReactNode } from "react";
import { Post } from "./post";
import { notFound } from "next/navigation";

/** The base layout for post feeds */
function Feed(props: { children: ReactNode }): ReactElement
{
	return (
		<div className="flex flex-col gap-3 w-full">
			{props.children}
		</div>
	);
}

/** A wrapper component for feed layouts */
export function FeedWrapper(props: { children: ReactNode }): ReactElement
{
	return (
		<div className="flex flex-col w-200 max-w-[90vw]">
			{props.children}
		</div>
	)
}

/** A header above a feed */
export function FeedHeader(props: { children: ReactNode }): ReactElement
{
	return (
		<div className="font-bold text-lg text-foreground">
			{props.children}
		</div>
	)
}

/** A feed showing the posts made by a single user */
export async function UserFeed(props: { currentUser: string | undefined, userID: string, viewerID: string | undefined }): Promise<ReactElement>
{
	const posts = await getPosts([props.userID], props.currentUser);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts) {
		components.push(<Post
			post={post}
			author={post.author}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post._count.replies}
			replied={post.replies.length > 0}
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
			replies={result.post._count.replies}
			replied={result.post.replies.length > 0}
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
	// The maximum number of replies allowed below each post
	const num_replies = 3;
	
	// Create a set of post components for each post in the feed
	const posts = await getAll(props.currentUser);
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts) {
		const post_component = <Post
			post={post}
			author={post.author}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post._count.replies}
			replied={post.replies.length > 0}
			key={post._count.replies > 0 ? undefined : key}
		/>

		if (post._count.replies === 0) {
			components.push(post_component);
		} else {
			// Add replies below the post
			const replies = await getReplies(post.id, props.currentUser);

			const reply_components: ReactElement[] = [];
			let secondary_key = 0;
			for (const reply of replies) {
				reply_components.push(<Post
					post={reply}
					author={reply.author}
					activeUser={props.viewerID}
					likes={reply._count.likes}
					liked={reply.likes.length > 0}
					replies={reply.replies.length}
					replied={reply._count.replies > 0}
					key={secondary_key}
					inline
				/>);
				++secondary_key;

				// Put a cap on the number of replies shown
				if (reply_components.length >= num_replies)
					break;
			}

			components.push(<div className="flex flex-col" key={key}>
				<div className="flex flex-col">
					{post_component}
					{reply_components}
				</div>
			</div>);
		}

		++key;
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
	const post = await getPost(props.postID, props.currentUser);

	if (post === null)
		notFound();

	// Get all the replies to the post
	const reply_components: ReactElement[] = [];
	if (post._count.replies > 0) {
		let replies = await getReplies(post.id, props.currentUser);
		let key = 1;
		for (const reply of replies) {
			reply_components.push(<Post
				post={reply}
				author={reply.author}
				activeUser={props.viewerID}
				likes={reply._count.likes}
				liked={reply.likes.length > 0}
				replies={reply.replies.length}
				replied={reply._count.replies > 0}
				inline={true}
				key={key}
			/>);
		}
	}

	return (
		<Feed>
			<Post
				post={post}
				author={post.author}
				activeUser={props.viewerID}
				likes={post._count.likes}
				liked={post.likes.length > 0}
				replies={post._count.replies}
				replied={post.replies.length > 0}
				key={0}
			/>
			<div className="font-bold text-lg">Replies</div>
			{reply_components}
		</Feed>
	);
}