'use client';

import { getAll, getLiked, getPost, getPosts, getReplies } from "@/lib/db";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { Post } from "./post";
import { notFound } from "next/navigation";

/** The base layout for post feeds */
function Feed(props: { children: ReactNode, onReload?: Function, loading?: boolean }): ReactElement
{
	const ref = useRef<HTMLDivElement>(null);

	// Create an intersection observer that will trigger infinite scrolling behavior
	useEffect(() => {
		if (!ref.current || !props.onReload)
			return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				if (props.onReload)
					props.onReload();
			}
		});

		observer.observe(ref.current);

		return () => {
			if (ref.current)
				observer.unobserve(ref.current);
		}
	}, []);

	return (
		<div className="flex flex-col gap-2 w-full my-2">
			{props.children}
			<div ref={ref}></div>
			{props.loading && <div>Loading...</div>}
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
		<div className="font-bold text-lg">
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

// The maximum number of posts to show with each load in a feed
const feed_size = 20;
// The maximum number of replies allowed below each post
const num_replies = 3;

/** A feed showing recent posts made on the app */
export function GlobalFeed(props: { currentUser: string | undefined, viewerID: string | undefined }): ReactElement
{
	const [posts, setPosts] = useState<Awaited<ReturnType<typeof getAll>>>([]);
	const [reload, setReload] = useState(true);

	// Change the number of posts displayed
	function reloadPosts() {
		setReload(true);
	}

	// Load a new set of posts every time the reload flag is set
	useEffect(() => {
		if (!reload) return;

		(async () => {
			if (posts.length > 0) {
				console.log(`Reloading with ${posts.length + feed_size} posts`);
				const new_posts = await getAll(props.currentUser, feed_size, posts[posts.length - 1].index);
				setPosts(posts.concat(new_posts));
			} else {
				console.log(`Initializing with ${feed_size} posts`);
				const new_posts = await getAll(props.currentUser, feed_size);
				setPosts(new_posts);
			}
			setReload(false);
		})();
	}, [reload, posts]);

	console.log(`Loaded posts: ${posts.length}, ${reload ? "reloading" : "not reloading"}`);

	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts) {
		/*const post_component = <Post
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
			const replies = await getReplies(post.id, num_replies, props.currentUser);

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
			}

			components.push(<div className="flex flex-col" key={key}>
				<div className="flex flex-col">
					{post_component}
					{reply_components}
				</div>
			</div>);
		}*/

		const post_component = <Post
			post={post}
			author={post.author}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post._count.replies}
			replied={post.replies.length > 0}
			key={key}
		/>
		components.push(post_component);

		++key;
	}

	return (
		<Feed onReload={reloadPosts} loading={reload}>
			<FeedHeader>Global Feed</FeedHeader>
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
		let replies = await getReplies(post.id, num_replies, props.currentUser);
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
			<FeedHeader>Replies</FeedHeader>
			{reply_components}
		</Feed>
	);
}