import { ReactElement } from "react";

export function Post(props: { title: string, author: string | null | undefined, time: Date, content: string | null }): ReactElement
{
	const author = props.author ? props.author : "Anonymous";
	const content = props.content ? props.content : "This post is empty.";

	let date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };

	return (
		<div className="w-full min-w-[20vw] bg-slate-400 text-center">
			<div className="p-2">
				<div className="text-lg font-bold">{props.title}</div>
				<div className="text-sm">By {author} on {props.time.toLocaleString("default", date_format)}</div>
			</div>
			<p className="bg-slate-200 p-2 m-2">{content}</p>
		</div>
	);
}