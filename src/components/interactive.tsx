'use client';

import { toggleFollow, resetAlias, toggleLike, expireAlias, unregisterUser } from "@/lib/db";
import { useRouter } from "next/navigation";
import { ReactElement, useState } from "react";
import { Icon } from "./info";
import { Modal } from "./menus";
import { CreatePost } from "./forms";

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

/** A button that forces the user's alias to expire */
export function ExpireAliasButton(): ReactElement
{
	const router = useRouter();

	async function handleClick() {
		await expireAlias();
		router.refresh();
	}

	return (
		<button
			onClick={() => handleClick()}
			className="hover:bg-red-500 cursor-pointer"
		>
			Expire Alias
		</button>
	)
}

/** A button that removes the user's registration */
export function UnregisterUserButton(): ReactElement
{
	const router = useRouter();

	async function handleClick() {
		await unregisterUser();
		router.refresh();
	}

	return (
		<button
			onClick={() => handleClick()}
			className="hover:bg-red-500 cursor-pointer"
		>
			Unregister
		</button>
	)
}

/** A button that can follow or unfollow a user */
export function FollowButton(props: { userID: string, followers: number, following?: boolean, selfProfile: boolean }): ReactElement
{
	const [following, setFollowing] = useState(props.following ? true : false);
	const [followers, setFollowers] = useState(props.followers);

	async function handleClick() {
		if (!props.selfProfile) {
			await toggleFollow(props.userID);

			setFollowing(!following);
			if (following)
					setFollowers(followers - 1);
				else
					setFollowers(followers + 1);
		}
	}

	// Set the icon to a filled style if the current user is following or its their own profile
	const icon = following || props.selfProfile ? "tdesign--star-filled" : "tdesign--star";
	const style = props.selfProfile ? "" : " cursor-pointer";

	return (
		<div className="flex flex-row gap-1">
			<div>{followers} Followers</div>
			<button onClick={() => handleClick()} className={"text-green-800" + style}>
				<Icon size={16} id={icon} />
			</button>
		</div>
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
		<button onClick={() => handleClick()} className={"flex flex-row items-center text-green-800" + style}>
			<Icon size={16} id={icon} />+{counter}
		</button>
	);
}

/** A button that opens a modal box to compose a reply */
export function ReplyButton(props: { postID: string, postContent: string | null, replyCount: number, replied?: boolean }): ReactElement
{
	const [modal, setModal] = useState(false);

	function handleClick() {
		if (!props.replied)
			setModal(true);
	}

	return (
		<>
			{modal && <Modal onCancel={() => setModal(false)}>
				<div className="flex flex-col items-center justify-center bg-background w-full p-4 gap-2 z-30">
					<div className="text-lg font-bold text-center">Reply</div>
					<div className="bg-white p-2 whitespace-pre">{props.postContent}</div>
					<div className="w-full"><CreatePost replyID={props.postID} /></div>
				</div>
			</Modal>}
			<button onClick={() => handleClick()} className="flex flex-row items-center gap-2 cursor-pointer text-green-800" >
				<Icon size={16} id={props.replied ? "tdesign--chat-bubble-filled" : "tdesign--chat-bubble"} />{props.replyCount}
			</button>
		</>
	);
}