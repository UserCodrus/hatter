import { ReactElement, ReactNode } from "react";

export function Feed(props: { children: ReactNode, label: string }): ReactElement
{
	return (
		<div>
			<div className="text-xl font-bold p-2">{props.label}</div>
			<div className="flex flex-col gap-2">
				{props.children}
			</div>
		</div>
	);
}