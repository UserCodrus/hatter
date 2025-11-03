'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactElement } from "react";

/** A button made with an image */
export function ImageButton(props: { src: string, target: string }): ReactElement
{
	return (
		<Link href={props.target} className="h-[24px] w-[24px]">
			<Image width={24} height={24} src={props.src} alt="Home" />
		</Link>
	);
}

/** A low-profile navigation button that will be disabled if the link corresponds to the current page */
export function NavigationButton(props: { label: string, target: string }): ReactElement
{
	const path = usePathname();

	// Disable buttons that link to the current page
	const disabled = path === props.target;

	if (disabled) {
		return (
			<div className="disabled p-1">
				{props.label}
			</div>
		);
	} else {
		return (
			<Link href={props.target} className="p-1">
				{props.label}
			</Link>
		);
	}
}

/** A high-profile button that links to a different page */
export function LinkButton(props: { label: string, target: string }): ReactElement
{
	const router = useRouter();

	return (
		<button
			className="button"
			onClick={() => router.push(props.target)}
		>{props.label}</button>
	)
}

/** A link used inside of a drop down menu  */
export function MenuItem(props: { label: string, target: string }): ReactElement
{
	return (
		<Link className="hover:bg-highlight" href={props.target}>
			{props.label}
		</Link>
	)
}