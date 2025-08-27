'use client';

import { pages } from "@/lib/utils";
import Avatar from "boring-avatars";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

const avatar_colors = [
		"#99ff99",
		"#009900"
	]

export function Post(props: { id: string, title: string, author: string | null | undefined, authorID: string | null, time: Date, content: string | null }): ReactElement
{
	const router = useRouter();

	const author = props.authorID ? <Link href={pages.user(props.authorID)}>{props.author}</Link> : "?";
	const content = props.content ? props.content : "This post is empty.";

	let date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };

	return (
		<div className="relative w-full min-w-[20vw] bg-slate-400 text-center">
			<div className="absolute left-2 top-2">
				<Avatar name={props.authorID ? props.authorID : "?"} colors={avatar_colors} variant="beam" size={56} square />
			</div>
			<div className="p-2">
				<div className="text-lg font-bold">{props.title}</div>
				<div className="text-sm">By {author} on {props.time.toLocaleString("default", date_format)}</div>
			</div>
			<p className="bg-slate-200 p-2 m-2" onClick={() => router.push(pages.post(props.id))}>{content}</p>
		</div>
	);
}