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