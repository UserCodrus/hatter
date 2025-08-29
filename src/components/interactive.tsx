'use client';

import { toggleFollow, resetAlias } from "@/lib/db";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

/** A button that triggers an alias reset for the user */
export function ResetAliasButton(): ReactElement
{
	const router = useRouter();

	async function handleClick() {
		await resetAlias(true);
		router.push("/history");
	}

	return (
		<button
			onClick={() => handleClick()}
			className="bg-red-300 p-2 cursor-pointer"
		>
			Reset Alias
		</button>
	)
}

/** A button that can follow or unfollow a user */
export function FollowButton(props: {id: string}): ReactElement
{
	async function handleClick() {
		await toggleFollow(props.id);
	}

	return (
		<button onClick={() => handleClick()} className="bg-green-300 p-1 cursor-pointer">Follow</button>
	);
}