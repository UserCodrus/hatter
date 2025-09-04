'use client';

import { ReactElement, ReactNode, useState } from "react";

/** A dropdown menu that displays when the user hovers over its main element */
export function DropDownMenu(props: { main: ReactNode, children: ReactNode }): ReactElement
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

/** A modal pop up */
export function Modal(props: { onCancel: Function, children: ReactNode }): ReactElement
{
	return (
		<div className="fixed modal-background top-0 left-0 flex flex-row items-center justify-center min-w-screen min-h-screen" onClick={() => props.onCancel()}>
			<div onClick={(e) => e.stopPropagation()}>
				{props.children}
			</div>
		</div>
	);
}