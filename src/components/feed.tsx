'use client';

import { getActivity, getAll, getFollowing, getPost, getPosts, getReplies } from "@/lib/db";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { Post } from "./post";
import { notFound } from "next/navigation";
import { Alias, Post as PostData } from "@prisma/client";
import { Author } from "next/dist/lib/metadata/types/metadata-types";
import { ContentPanel } from "./info";

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
		<div className="flex flex-col gap-4 w-full">
			{props.children}
			<div className="h-[10px] w-full" ref={ref}></div>
			{props.loading && <div className="w-full text-center mb-4">Loading...</div>}
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
export function UserFeed(props: { currentUser: string | undefined, userID: string, userName: string, banned: boolean }): ReactElement
{
	//const posts = await getPosts([props.userID], props.currentUser);
	const [posts, setPosts] = useState<Awaited<ReturnType<typeof getActivity>>>([]);
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
				const new_posts = await getActivity(props.userID, feed_size, props.currentUser, posts[posts.length - 1].index);
				setPosts(posts.concat(new_posts));
			} else {
				console.log(`Initializing with ${feed_size} posts`);
				const new_posts = await getActivity(props.userID, feed_size, props.currentUser);
				setPosts(new_posts);
			}
			setReload(false);
		})();
	}, [reload, posts]);
	
	// Create a set of post components for each post in the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts) {
		components.push(<Post
			post={post}
			author={post.author}
			reply={post.reply}
			replyAuthor={post.reply ? (post.reply as any).author : null}
			activeUser={props.currentUser}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post._count.replies}
			replied={post.replies.length > 0}
			banned={props.banned}
			key={key}
		/>);
		++key;
	}

	// Add a message to empty feeds
	if (components.length === 0) {
		components.push(<ContentPanel key={0}>
			{props.userName} has no activity yet.
		</ContentPanel>);
	}

	return (
		<Feed onReload={reloadPosts} loading={reload}>
			<FeedHeader>{props.userName}'s Feed</FeedHeader>
			{components}
		</Feed>
	);
}

// The maximum number of posts to show with each load in a feed
const feed_size = 20;

/** A feed showing recent posts made on the app */
export function GlobalFeed(props: { currentUser: string | undefined, viewerID: string | undefined, banned: boolean }): ReactElement
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
				const new_posts = await getAll(props.currentUser, feed_size, posts[posts.length - 1].index);
				setPosts(posts.concat(new_posts));
			} else {
				const new_posts = await getAll(props.currentUser, feed_size);
				setPosts(new_posts);
			}
			setReload(false);
		})();
	}, [reload, posts]);

	// Create a set of post components for the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts) {
		components.push(<Post
			post={post}
			author={post.author}
			reply={post.reply}
			replyAuthor={post.reply ? (post.reply as any).author : null}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post._count.replies}
			replied={post.replies.length > 0}
			banned={props.banned}
			key={key}
		/>);
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
export function PostFeed(props: { currentUser: string | undefined, post: PostData, reply: PostData | null, author: Alias, replyAuthor: Alias | null, likes: number, liked?: boolean, replies: number, replied?: boolean, viewerID: string | undefined, banned: boolean }): ReactElement
{
	const [replies, setReplies] = useState<Awaited<ReturnType<typeof getReplies>>>([]);
	const [reload, setReload] = useState(true);

	// Change the number of posts displayed
	function reloadPosts() {
		setReload(true);
	}

	// Load a new set of posts every time the reload flag is set
	useEffect(() => {
		if (!reload) return;

		(async () => {
			if (replies.length > 0) {
				const new_posts = await getReplies(props.post.id, props.currentUser, feed_size, replies[replies.length - 1].index);
				setReplies(replies.concat(new_posts));
			} else {
				const new_posts = await getReplies(props.post.id, props.currentUser, feed_size);
				setReplies(new_posts);
			}
			setReload(false);
		})();
	}, [reload, replies]);

	// Create a set of components for each reply to the post
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of replies) {
		components.push(<Post
			post={post}
			author={post.author}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post._count.replies}
			replied={post.replies.length > 0}
			banned={props.banned}
			key={key}
		/>);
		++key;
	}

	// Add a message to empty feeds
	if (components.length === 0) {
		components.push(<ContentPanel key={0}>
			This post has no replies.
		</ContentPanel>);
	}

	return (
		<Feed onReload={reloadPosts} loading={reload}>
			<Post
				post={props.post}
				author={props.author}
				reply={props.reply}
				replyAuthor={props.replyAuthor}
				activeUser={props.viewerID}
				likes={props.likes}
				liked={props.liked}
				replies={props.replies}
				replied={props.replied}
				banned={props.banned}
				key={0}
			/>
			<FeedHeader>Replies</FeedHeader>
			{components}
		</Feed>
	);
}

/** A feed showing users the current user is following */
export function CustomFeed(props: { currentUser: string | undefined, viewerID: string | undefined, banned: boolean }): ReactElement
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
			const following = await getFollowing(props.currentUser);
			if (!following || following.length === 0) {
				// Fallback to the global feed if the user isn't following anyone
				const new_posts = await getAll(props.currentUser, feed_size, posts.length > 0 ? posts[posts.length - 1].index : undefined);
				setPosts(posts.concat(new_posts));
			} else {
				// Get posts made by accounts the current user is following
				const users = following.map((value) => value.id);
				const new_posts = await getPosts(users, feed_size, props.currentUser, posts.length > 0 ? posts[posts.length - 1].index : undefined);
				setPosts(posts.concat(new_posts));
			}
			
			setReload(false);
		})();
	}, [reload, posts]);

	// Create a set of post components for the feed
	const components: ReactElement[] = [];
	let key = 0;
	for (const post of posts) {
		components.push(<Post
			post={post}
			author={post.author}
			reply={post.reply}
			replyAuthor={post.reply ? (post.reply as any).author : null}
			activeUser={props.viewerID}
			likes={post._count.likes}
			liked={post.likes.length > 0}
			replies={post._count.replies}
			replied={post.replies.length > 0}
			banned={props.banned}
			key={key}
		/>);
		++key;
	}

	return (
		<Feed onReload={reloadPosts} loading={reload}>
			<FeedHeader>Your Feed</FeedHeader>
			{components}
		</Feed>
	);
}