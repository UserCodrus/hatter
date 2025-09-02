'use client';

import { toggleFollow, resetAlias, toggleLike } from "@/lib/db";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { Icon } from "./info";

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
export function FollowButton(props: {userID: string}): ReactElement
{
	async function handleClick() {
		await toggleFollow(props.userID);
	}

	return (
		<button onClick={() => handleClick()} className="bg-green-300 p-1 cursor-pointer">Follow</button>
	);
}

/** A button that can like or unlike a post */
export function LikeButton(props: { postID: string, liked?: boolean }): ReactElement
{
	async function handleClick() {
		await toggleLike(props.postID);
	}

	const icon = props.liked ? "tdesign--heart-filled" : "tdesign--heart";

	return (
		<button onClick={() => handleClick()} className="cursor-pointer"><Icon size={16} id={icon} /></button>
	);
}