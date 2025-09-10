'use client';

import { createAlias, updateAlias } from "@/lib/db";
import { pages, randomColor } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, ReactElement, useState } from "react";
import { Modal } from "./menus";
import { UserAvatar } from "./info";

/** A form that allows the user to submit a post */
export function CreatePost(props: { replyID?: string }): ReactElement
{
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const router = useRouter();

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			// Submit the post data to the API
			const body = { title, content, reply: props.replyID };
			console.log(body);
			await fetch("/api/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});

			// Redirect to the history feed
			router.push(pages.history);
		} catch (error) {
			if (error instanceof Error)
				console.error(error);
		}
	}

	// Hide the title field if the post is a reply - the title will be set automatically when a reply post is created
	const hide = props.replyID ? " hidden" : "";

	return (
		<form className="flex flex-col p-4 gap-2" onSubmit={submitForm}>
			<input
				className={"bg-white p-1" + hide}
				placeholder={"Title"}
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				type="text"
				disabled={props.replyID ? true : false}
			/>
			<textarea
				className="bg-white p-1"
				placeholder={"Write your post here"}
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<div className="flex items-center justify-center">
				<input className="w-20 outline-1 bg-slate-300 cursor-pointer" disabled={!content || (!title && !props.replyID)} type="submit" value="Post" />
			</div>
		</form>
	);
}

/** A modal popup that gives the user a set of icons to choose from */
function IconSelector(): ReactElement
{
	return (
		<div>
			Hi.
		</div>
	);
}

/** A form that allows the user to create a new alias */
export function CreateAlias(): ReactElement
{
	const [tag, setTag] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [icon, setIcon] = useState(Date.now().toString());
	const [colorA, setColorA] = useState(randomColor());
	const [colorB, setColorB] = useState(randomColor());
	const [iconModal, setIconModal] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const error = await createAlias(tag.toLowerCase(), name, bio, icon, colorA, colorB);
		if (error === null)
			router.push("/history");
		else
			setError(error);
	}

	return (
		<form className="flex flex-col p-4 gap-2 w-1/3 items-stretch" onSubmit={submitForm}>
			{iconModal && <Modal onCancel={() => setIconModal(false)}>
				<IconSelector />
			</Modal>}
			<div className="flex flex-row items-center">
				<div className="flex-1">Icon (click to change)</div>
				<div className="flex justify-center w-2/3">
					<button className="cursor-pointer" onClick={(e) => {e.preventDefault(); setIconModal(true);}}>
						<UserAvatar icon={icon} colors={[colorA, colorB]} size={64} />
					</button>
				</div>
			</div>
			<div className="flex flex-row items-center">
				<label className="flex-1">ID</label>
				<input
					className="bg-white p-1 w-2/3 lowercase"
					placeholder={""}
					value={tag}
					onChange={(e) => setTag(e.target.value)}
					type="text"
				/>
			</div>
			<div className="flex flex-row items-center">
				<label className="flex-1">Name</label>
				<input
					className="bg-white p-1 w-2/3"
					placeholder={""}
					value={name}
					onChange={(e) => setName(e.target.value)}
					type="text"
				/>
			</div>
			<div className="text-center">Bio</div>
			<textarea
				className="bg-white p-1"
				placeholder={"Write your account's bio here"}
				value={bio}
				onChange={(e) => setBio(e.target.value)}
			/>
			<div className="flex items-center justify-center m-2">
				<input className="w-20 outline-1 bg-slate-300 cursor-pointer" disabled={!tag || !name} type="submit" value="Create" />
			</div>
			{error && <div className="text-center text-red-800">{error}</div>}
		</form>
	);
}

/** A form that allows the user to update an owned alias */
export function UpdateAlias(props: {tag: string, name: string, bio: string | null}): ReactElement
{
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const error = await updateAlias(name, bio, null);
		if (error === null)
			router.push("/history");
		else
			setError(error);
	}

	return (
		<form className="flex flex-col p-4 gap-2 w-1/3 items-stretch" onSubmit={submitForm}>
			<div className="flex flex-row items-center">
				<label className="flex-1">ID</label>
				<input
					className="bg-white p-1 w-2/3 lowercase"
					placeholder={""}
					value={props.tag}
					type="text"
					disabled={true}
				/>
			</div>
			<div className="flex flex-row items-center">
				<label className="flex-1">Name</label>
				<input
					className="bg-white p-1 w-2/3"
					placeholder={props.name}
					value={name}
					onChange={(e) => setName(e.target.value)}
					type="text"
				/>
			</div>
			<div className="text-center">Bio</div>
			<textarea
				className="bg-white p-1"
				placeholder={props.bio ? props.bio : "Write your account's bio here"}
				value={bio}
				onChange={(e) => setBio(e.target.value)}
			/>
			<div className="flex items-center justify-center m-2">
				<input className="w-20 outline-1 bg-slate-300 cursor-pointer" disabled={!name} type="submit" value="Update" />
			</div>
			{error && <div className="text-center text-red-800">{error}</div>}
		</form>
	);
}