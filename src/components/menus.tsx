'use client';

import { ReactElement, ReactNode, useState } from "react";

/** A dropdown menu that displays when the user hovers over its main element */
export function DropDownMenu(props: {main: ReactNode, children: ReactNode}): ReactElement
{
	const [open, setOpen] = useState(false);

	return (
		<div className="relative" onMouseLeave={() => setOpen(false)}>
			<div onMouseOver={() => setOpen(true)}>
				{props.main}
			</div>
			{open && <div className="absolute z-10 w-full">
				{props.children}
			</div>}
		</div>
	);
}