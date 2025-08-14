import { ReactElement } from "react";

export function Post(props: { title: string, author: string | null | undefined, content: string | null }): ReactElement
{
	const author = props.author ? props.author : "Anonymous";
	const content = props.content ? props.content : "This post is empty.";

	return (
		<div className="w-full min-w-[20vw] bg-slate-700 text-center">
			<div className="p-2">
				<div className="text-lg font-bold">{props.title}</div>
				<div className="text-sm">By {author}</div>
			</div>
			<p className="bg-slate-600 p-2 m-2">{content}</p>
		</div>
	);
}