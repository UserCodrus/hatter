'use client';

import { toggleFollow, resetAlias, toggleLike, expireAlias, unregisterUser, hidePost, banUser } from "@/lib/db";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactElement, useState } from "react";
import { Icon } from "./info";
import { Modal } from "./menus";
import { CreatePost } from "./forms";
import Avatar from "boring-avatars";
import { HexColorInput, HexColorPicker } from "react-colorful";

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
			className="button"
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
			className="hover:bg-highlight cursor-pointer"
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
			className="hover:bg-highlight cursor-pointer"
		>
			Unregister
		</button>
	)
}

/** A button that can follow or unfollow a user */
export function FollowButton(props: { userID: string, followers: number, following?: boolean, disabled: boolean }): ReactElement
{
	const [following, setFollowing] = useState(props.following ? true : false);
	const [followers, setFollowers] = useState(props.followers);

	async function handleClick() {
		if (!props.disabled) {
			await toggleFollow(props.userID);

			setFollowing(!following);
			if (following)
					setFollowers(followers - 1);
				else
					setFollowers(followers + 1);
		}
	}

	// Set the icon to a filled style if the current user is following or its their own profile
	const icon = following ? "tdesign--star-filled" : "tdesign--star";
	const style = props.disabled ? "" : " cursor-pointer";

	return (
		<div className="flex flex-row gap-1">
			<div>{followers} Followers</div>
			<button onClick={() => handleClick()} className={"text-interactive" + style}>
				<Icon size={16} id={icon} />
			</button>
		</div>
	);
}

/** A button that can like or unlike a post */
export function LikeButton(props: { postID: string, likeCount: number, likedPost?: boolean, selfPost: boolean, disabled?: boolean }): ReactElement
{
	const [liked, setLiked] = useState(props.likedPost ? true : false);
	const [counter, setCounter] = useState(props.likeCount);

	// Mark the post as liked on the server and toggle the visible state of the like counter when clicked
	async function handleClick() {
		if (!props.selfPost && !props.disabled) {
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
	const style = props.selfPost || props.disabled ? "" : " cursor-pointer";

	return (
		<button onClick={() => handleClick()} className={"flex flex-row items-center text-interactive" + style}>
			<Icon size={16} id={icon} />+{counter}
		</button>
	);
}

/** A button that opens a modal box to compose a reply */
export function ReplyButton(props: { postID: string, replyCount: number, replied?: boolean, disabled?: boolean, onClick: Function }): ReactElement
{
	function handleClick() {
		if (!props.disabled)
			props.onClick();
	}

	const icon = props.replied ? "tdesign--chat-bubble-filled" : "tdesign--chat-bubble"
	const style = props.disabled ? "" : " cursor-pointer";

	return (
		<button onClick={() => handleClick()} className={"flex flex-row items-center gap-2 text-interactive" + style} >
			<Icon size={16} id={icon} />{props.replyCount}
		</button>
	);
}

/** A component that allows users to moderate posts */
export function ModeratorTools(props: { postID: string, authorID: string | null, published: boolean, banned: boolean }): ReactElement
{
	const router = useRouter();

	// Hide the post from users
	async function hide() {
		await hidePost(props.postID, props.published);
		router.refresh();
	}

	// Apply a permanent (100 year) ban to the account that made the post
	async function ban() {
		if (props.authorID) {
			let date = new Date();
			date.setFullYear(date.getFullYear() + 100);
			await banUser(props.authorID, date);
			router.refresh();
		}
	}

	// Apply a one week ban
	async function timeOut() {
		if (props.authorID) {
			let date = new Date();
			date.setDate(date.getDate() + 7);
			await banUser(props.authorID, date);
			router.refresh();
		}
	}

	return (
		<div className="flex flex-col items-center gap-4 p-4 fit-width panel">
			<div>Moderator Actions</div>
			<div>{props.published ? "Post is visible" : "Post is hidden"}</div>
			<div className="flex flex-row items-center justify-center gap-4">
				<button onClick={() => hide()} className={"flex flex-row items-center justify-center gap-2 button"} >
					{props.published ? "Hide Post" : "Show Post"}
				</button>
				<button onClick={() => timeOut()} className={"flex flex-row items-center justify-center gap-2 button"} >
					Time Out
				</button>
				<button onClick={() => ban()} className={"flex flex-row items-center justify-center gap-2 button"} >
					Ban
				</button>
			</div>
		</div>
	);
}

type AvatarStyle = "pixel" | "bauhaus" | "ring" | "beam" | "sunset" | "marble" | "geometric" | "abstract";

/** A button for selecting an avatar icon */
export function AvatarSelector(props: { icon: string, colors: string[], style: AvatarStyle, selected: boolean, onSelect: (icon: string) => void }): ReactElement
{
	function handleClick(e: MouseEvent) {
		e.preventDefault();

		if (!props.selected)
			props.onSelect(props.icon);
	}

	const style = props.selected ? " bg-highlight" : " bg-interactive cursor-pointer"

	return (
		<button onClick={(e) => handleClick(e)} className={"p-1" + style}>
			<Avatar name={props.icon} colors={props.colors} variant={props.style} size={64} square />
		</button>
	);
}

/** A component that allows the user to select a color */
export function ColorSelector(props: { color: string, selected: boolean, onChange: (new_color: string) => void, onSelect: Function }): ReactElement
{
	const selection_style = props.selected ? " border-highlight" : " border-interactive";

	return (
		<div className="flex flex-row gap-2 items-center justify-center">
			<div className={"w-8 h-8 border-2 cursor-pointer" +  selection_style} style={{background: props.color}} onClick={() => props.onSelect()}></div>
			<HexColorInput color={props.color} onChange={props.onChange} prefixed className="bg-input text-center w-1/2" />
		</div>
	);
}

/** A button used inside of a drop down menu */
export function MenuButton(props: { label: string, onClick: Function }): ReactElement
{
	function handleClick(e: MouseEvent) {
		e.preventDefault();
		props.onClick();
	}

	return (
		<button className="hover:bg-highlight" onClick={(e) => handleClick(e)}>
			{props.label}
		</button>
	)
}