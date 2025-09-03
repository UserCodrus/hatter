'use client';

import { pages } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { UserAvatar } from "./info";
import { LikeButton } from "./interactive";
import { Post as PostData } from "@prisma/client";

type Author = {
	name: string,
	tag: string
}

export function Post(props: { post: PostData, author: Author, likes: number, liked?: boolean, activeUser?: string }): ReactElement
{
	const router = useRouter();
	const content = props.post.content ? props.post.content : "This post is empty.";

	let date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };

	// Create like and reply buttons based on whether or not the post was made by the active user
	let reply_button = <></>;

	const self_post = props.post.authorId === props.activeUser;
	if (props.post.authorId !== props.activeUser) {
		let reply_button = <></>;
	}

	return (
		<div className="flex flex-col p-2 gap-2 w-full min-w-[20vw] bg-slate-400">
			<div className="flex flex-row items-center gap-2">
				<div>
					<UserAvatar image={props.author.name} size={48} />
				</div>
				<div className="flex flex-col">
					<Link href={pages.user(props.author.tag)}>{props.author.name}</Link>
					<div className="text-sm">@{props.author.tag}</div>
				</div>
				<div className="flex flex-col grow-1 text-center">
					<div className="text-lg font-bold">{props.post.title}</div>
				</div>
			</div>
			<p className="bg-slate-200 p-2 whitespace-pre" onClick={() => router.push(pages.post(props.post.id))}>{content}</p>
			<div className="flex flex-row">
				<div className="text-sm grow-1">{props.post.updated.toLocaleString("default", date_format)}</div>
				<div className="flex flex-row gap-2">
					<div className="flex flex-row items-center"><LikeButton postID={props.post.id} likedPost={props.liked} likeCount={props.likes} selfPost={self_post} /></div>
					<div>Reply</div>
				</div>
			</div>
		</div>
	);
}