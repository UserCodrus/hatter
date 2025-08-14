import { ReactElement } from "react";

export function Post(props: { title: string, author: string, content: string }): ReactElement
{
	return (
		<div className="w-full min-w-[20vw] bg-slate-700 text-center">
			<div className="p-2">
				<div className="text-lg font-bold">{props.title}</div>
				<div className="text-sm">By {props.author}</div>
			</div>
			<p className="bg-slate-600 p-2 m-2">{props.content}</p>
		</div>
	);
}