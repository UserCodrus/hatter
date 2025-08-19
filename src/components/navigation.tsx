'use client';

import { useRouter } from "next/navigation";
import { ReactElement } from "react";

export function NavigationButton(props: { label: string, target: string }): ReactElement
{
	const router = useRouter();

	return (
		<button
			className="cursor-pointer p-1"
			onClick={() => router.push(props.target)}
		>{props.label}</button>
	)
}

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