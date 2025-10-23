'use client';

import { MouseEvent as ReactMouseEvent, ReactElement, ReactNode, useEffect, useRef, useState } from "react";

/** A dropdown menu that displays when the user hovers over its main element */
export function DropDownMenu(props: { above?: boolean, fill?: boolean, disabled?: boolean, className?: string, main: ReactNode, children: ReactNode }): ReactElement
{
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	function handleClick(e: ReactMouseEvent) {
		e.preventDefault();
		setOpen(false);
	}

	// Add an event handler to close the menu when users click outside of the menu
	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (!ref.current?.contains(e.target as Node))
				setOpen(false);
		}

		document.addEventListener("click", handleOutsideClick);
		document.addEventListener("contextmenu", handleOutsideClick);

		return () => {
			document.removeEventListener("click", handleOutsideClick);
			document.removeEventListener("contextmenu", handleOutsideClick);
		}
	}, []);

	const position_style = props.above ? " bottom-full" : "";
	const size_style = props.fill ? " w-full" : "";
	const additional_style = props.className ? " " + props.className : "";

	return (
		<div className={"relative origin-top" + additional_style} onMouseLeave={() => setOpen(false)} ref={ref}>
			<div onMouseOver={() => setOpen(true)} onClick={() => setOpen(true)}>
				{props.main}
			</div>
			{open && !props.disabled && <div className={"absolute right-0 panel" + position_style + size_style} onClick={(e) => handleClick(e)}>
				{props.children}
			</div>}
		</div>
	);
}

/** A modal pop up */
export function Modal(props: { onCancel: Function, children: ReactNode }): ReactElement
{
	return (
		<div className="fixed modal-background top-0 left-0 flex flex-row items-center justify-center min-w-screen min-h-screen z-30" onClick={() => props.onCancel()}>
			<div onClick={(e) => e.stopPropagation()} className="flex items-center w-full">
				{props.children}
			</div>
		</div>
	);
}