'use client';

import { pages } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { UserAvatar } from "./info";

export function Post(props: { id: string, title: string, author: string | null | undefined, authorID: string | null, tag: string, time: Date, content: string | null }): ReactElement
{
	const router = useRouter();

	const author = props.authorID ? <Link href={pages.user(props.tag)}>{props.author}</Link> : "?";
	const content = props.content ? props.content : "This post is empty.";

	let date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };

	return (
		<div className="relative w-full min-w-[20vw] bg-slate-400 text-center">
			<div className="absolute left-2 top-2">
				<UserAvatar id={props.authorID ? props.authorID : "?"} size={56} />
			</div>
			<div className="p-2">
				<div className="text-lg font-bold">{props.title}</div>
				<div className="text-sm">By {author} on {props.time.toLocaleString("default", date_format)}</div>
			</div>
			<p className="bg-slate-200 p-2 m-2 whitespace-pre text-left" onClick={() => router.push(pages.post(props.id))}>{content}</p>
		</div>
	);
}