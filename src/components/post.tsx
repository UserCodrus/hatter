'use client';

import { pages } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactElement, ReactNode, useState } from "react";
import { UserAvatar } from "./info";
import { LikeButton, ReplyButton } from "./interactive";
import { Alias, Post as PostData } from "@prisma/client";
import { CreateReply } from "./forms";

const date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };

/** A component containing the content of a post */
function PostBody(props: { post: PostData, author?: Alias | null, children?: ReactNode}): ReactElement
{
	const router = useRouter();

	function handleClick(event: MouseEvent) {
		event.stopPropagation();
		router.push(pages.post(props.post.id));
	}

	return (
		<div className={"flex flex-col gap-2 p-4 whitespace-pre panel-inner cursor-pointer"} onClick={(e) => handleClick(e)}>
			{props.author && <div className="text-sm">@{props.author.tag}</div>}
			{props.post.content && <p className="flex-1 text-wrap">{props.post.content}</p>}
			{props.post.media && <div className="flex flex-col items-center w-full"><img className="max-w-full" src={props.post.media} alt={props.post.media} /></div>}
			{props.children}
			{props.author && <div className="text-sm">{props.post.updated.toLocaleString("default", date_format)}</div>}
		</div>
	);
}

/** A component that displays a post */
export function Post(props: { post: PostData, author: Alias, reply?: PostData | null, replyAuthor?: Alias | null, likes: number, liked?: boolean, replies: number, replied?: boolean, inline?: boolean, activeUser?: string }): ReactElement
{
	const [replyOpen, setReplyOpen] = useState(false);

	// Activate the reply component when the user clicks the reply button
	function reply() {
		setReplyOpen(true);
	}
	
	// Change the title
	let title = props.post.title;
	if (props.inline) {
		title = "";
	} else if (props.post.replyID) {
		title = `Reply`;
	}

	return (
		<div className={"flex flex-col p-4 gap-2 relative w-full panel"}>
			<div className="flex flex-row items-center gap-2">
				<div>
					<UserAvatar icon={props.author.icon} colors={[props.author.colorA, props.author.colorB]} style={props.author.style} size={40} />
				</div>
				<div className="flex flex-col">
					<Link href={pages.user(props.author.tag)}>{props.author.name}</Link>
					<div className="text-sm">@{props.author.tag}</div>
				</div>
				<div className="flex flex-col grow-1 text-center">
					<div className="text-lg font-bold text-right">{title}</div>
				</div>
			</div>
			<PostBody post={props.post}>
				{props.reply && <PostBody post={props.reply} author={props.replyAuthor} />}
			</PostBody>
			<div className="flex flex-row items-center">
				<div className="text-sm grow-1">{props.post.updated.toLocaleString("default", date_format)}</div>
				<div className="flex flex-row gap-2">
					<ReplyButton
						postID={props.post.id}
						replied={props.replied && props.activeUser != undefined}
						replyCount={props.replies}
						disabled={props.activeUser === undefined}
						onClick={reply}
					/>
					<LikeButton
						postID={props.post.id}
						likedPost={props.liked && props.activeUser != undefined}
						likeCount={props.likes}
						selfPost={props.post.authorId === props.activeUser}
						disabled={props.activeUser === undefined}
					/>
				</div>
			</div>
			{replyOpen && <div className="flex flex-col items-stretch panel-inner">
				<div className="text-center font-bold">Reply to {props.author.name}</div>
				<CreateReply replyID={props.post.id} />
			</div>}
		</div>
	);
}