import { ReactElement, ReactNode } from "react";

export function Feed(props: { children: ReactNode, label: string }): ReactElement
{
	return (
		<div className="p-4 w-1/2">
			<div className="text-xl font-bold p-2">{props.label}</div>
			<div className="flex flex-col gap-2">
				{props.children}
			</div>
		</div>
	);
}