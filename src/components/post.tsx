'use client';

import { pages } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { UserAvatar } from "./info";
import { LikeButton, ReplyButton } from "./interactive";
import { Post as PostData } from "@prisma/client";

type Author = {
	name: string,
	tag: string,
	icon: string,
	colorA: string,
	colorB: string,
	style: string,
}

export function Post(props: { post: PostData, author: Author, likes: number, liked?: boolean, replies: number, replied?: boolean, inline?: boolean, activeUser?: string }): ReactElement
{
	const router = useRouter();
	const content = props.post.content ? props.post.content : "This post is empty.";

	let date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };
	
	// Change the title
	let title = props.post.title;
	if (props.inline) {
		title = "";
	} else if (props.post.replyID) {
		title = `Reply to @${props.post.title}`;
	}

	//const width_style = props.isReply ? " w-[95%] self-end" : " w-full";

	return (
		<div className={"flex flex-col p-2 gap-2 relative w-full bg-panel-background text-panel-foreground"}>
			<div className="flex flex-row items-center gap-2">
				<div>
					<UserAvatar icon={props.author.icon} colors={[props.author.colorA, props.author.colorB]} style={props.author.style} size={48} />
				</div>
				<div className="flex flex-col">
					<Link href={pages.user(props.author.tag)}>{props.author.name}</Link>
					<div className="text-sm">@{props.author.tag}</div>
				</div>
				<div className="flex flex-col grow-1 text-center">
					<div className="text-lg font-bold">{title}</div>
				</div>
			</div>
			<div className="flex flex-col gap-1 p-4 whitespace-pre cursor-pointer bg-inset" onClick={() => router.push(pages.post(props.post.id))}>
				{props.post.media && <img className="max-w-full" src={props.post.media} alt={props.post.media} />}
				<p className="flex-1 text-wrap">{content}</p>
			</div>
			<div className="flex flex-row">
				<div className="text-sm grow-1">{props.post.updated.toLocaleString("default", date_format)}</div>
				<div className="flex flex-row gap-2">
					<ReplyButton postID={props.post.id} postContent={props.post.content} replyCount={props.replies} replied={props.replied} disabled={props.activeUser === undefined} />
					<LikeButton postID={props.post.id} likedPost={props.liked} likeCount={props.likes} selfPost={props.post.authorId === props.activeUser} disabled={props.activeUser === undefined} />
				</div>
			</div>
		</div>
	);
}