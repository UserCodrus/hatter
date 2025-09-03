'use client';

import { toggleFollow, resetAlias, toggleLike } from "@/lib/db";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";
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
export function LikeButton(props: { postID: string, likeCount: number, likedPost?: boolean, selfPost: boolean }): ReactElement
{
	const [liked, setLiked] = useState(props.likedPost ? true : false);
	const [counter, setCounter] = useState(props.likeCount);

	// Mark the post as liked on the server and toggle the visible state of the like counter when clicked
	async function handleClick() {
		if (!props.selfPost) {
			await toggleLike(props.postID);

			setLiked(!liked);
			if (liked)
				setCounter(counter - 1);
			else
				setCounter(counter + 1);
		}
	}

	// Set the icon to a filled heart if the user has liked the post or the user posted it themselves
	const icon = liked || props.selfPost ? "tdesign--heart-filled" : "tdesign--heart";
	const style = props.selfPost ? "" : " cursor-pointer";

	return (
		<button onClick={() => handleClick()} className={"flex flex-row items-center" + style}><Icon size={16} id={icon} />+{counter}</button>
	);
}