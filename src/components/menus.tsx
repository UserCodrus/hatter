'use client';

import { MouseEvent, ReactElement, ReactNode, useState } from "react";

/** A dropdown menu that displays when the user hovers over its main element */
export function DropDownMenu(props: { above?: boolean, fill?: boolean, disabled?: boolean, className?: string, main: ReactNode, children: ReactNode }): ReactElement
{
	const [open, setOpen] = useState(false);

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		setOpen(false);
	}

	const position_style = props.above ? " bottom-full" : "";
	const size_style = props.fill ? " w-full" : "";
	const additional_style = props.className ? " " + props.className : "";

	return (
		<div className={"relative origin-top" + additional_style} onMouseLeave={() => setOpen(false)}>
			<div onMouseOver={() => setOpen(true)} onClick={() => setOpen(true)}>
				{props.main}
			</div>
			{open && !props.disabled && <div className={"absolute z-10 right-0" + position_style + size_style} onClick={(e) => handleClick(e)}>
				{props.children}
			</div>}
		</div>
	);
}

/** A modal pop up */
export function Modal(props: { onCancel: Function, children: ReactNode }): ReactElement
{
	return (
		<div className="fixed modal-background top-0 left-0 flex flex-row items-center justify-center min-w-screen min-h-screen z-10" onClick={() => props.onCancel()}>
			<div onClick={(e) => e.stopPropagation()} className="flex items-center w-1/3">
				{props.children}
			</div>
		</div>
	);
}