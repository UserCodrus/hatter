'use client';

import { usePathname, useRouter } from "next/navigation";
import { ReactElement } from "react";

/** A low-profile navigation button that will be disabled if the link corresponds to the current page */
export function NavigationButton(props: { label: string, target: string }): ReactElement
{
	const router = useRouter();
	const path = usePathname();

	const normal_style = "cursor-pointer p-1";
	const disabled_style = "text-gray-700 p-1";

	// Disable buttons that link to the current page
	const disabled = path === props.target;

	return (
		<button
			className={disabled ? disabled_style : normal_style}
			disabled={disabled}
			onClick={() => router.push(props.target)}
		>{props.label}</button>
	)
}

/** A high-profile button that links to a different page */
export function LinkButton(props: { label: string, target: string }): ReactElement
{
	const router = useRouter();

	return (
		<button
			className="cursor-pointer p-1 outline-1 rounded-sm bg-slate-300"
			onClick={() => router.push(props.target)}
		>{props.label}</button>
	)
}

/** A link used inside of a drop down menu  */
export function MenuItem(props: {label: string, target: string}): ReactElement
{
	return (
		<a className="hover:bg-amber-300" href={props.target}>
			{props.label}
		</a>
	)
}