'use client';

import { pages } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { UserAvatar } from "./info";

export function Post(props: { id: string, title: string, author: string, authorID: string, tag: string, time: Date, content: string | null }): ReactElement
{
	const router = useRouter();
	const content = props.content ? props.content : "This post is empty.";

	let date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };

	return (
		<div className="flex flex-col p-2 gap-2 w-full min-w-[20vw] bg-slate-400">
			<div className="flex flex-row items-center gap-2">
				<div>
					<UserAvatar id={props.authorID} size={48} />
				</div>
				<div className="flex flex-col">
					<Link href={pages.user(props.tag)}>{props.author}</Link>
					<div className="text-sm">@{props.tag}</div>
				</div>
				<div className="flex flex-col grow-1 text-center">
					<div className="text-lg font-bold">{props.title}</div>
				</div>
			</div>
			<p className="bg-slate-200 p-2 whitespace-pre" onClick={() => router.push(pages.post(props.id))}>{content}</p>
			<div className="flex flex-row">
				<div className="text-sm grow-1">{props.time.toLocaleString("default", date_format)}</div>
				<div className="flex flex-row gap-2">
					<div>Like</div>
					<div>Reply</div>
				</div>
			</div>
		</div>
	);
}