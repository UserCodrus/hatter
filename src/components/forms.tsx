'use client';

import { createAlias } from "@/lib/db";
import { useRouter } from "next/navigation";
import { FormEvent, ReactElement, useState } from "react";

/** A form that llows the user to submit a post */
export function CreatePost(): ReactElement
{
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const router = useRouter();

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			// Submit the post data to the API
			const body = { title, content };
			await fetch("/api/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});

			// Redirect to the history feed
			router.push("/history");
		} catch (error) {
			if (error instanceof Error)
				console.error(error);
		}
	}

	return (
		<form className="flex flex-col p-4 gap-2 w-1/3" onSubmit={submitForm}>
			<input
				className="bg-white p-1"
				placeholder={"Title"}
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				type="text"
			/>
			<textarea
				className="bg-white p-1"
				placeholder={"Write your post here"}
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
			<div className="flex items-center justify-center">
				<input disabled={!content || !title} type="submit" value="Post" />
			</div>
		</form>
	);
}

/** A form that allows the user to create a new alias */
export function CreateAlias(): ReactElement
{
	const [tag, setTag] = useState("");
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const router = useRouter();

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const success = await createAlias(tag.toLowerCase(), name, bio, null);
		if (success)
			router.push("/history");
	}

	return (
		<form className="flex flex-col p-4 gap-2 w-1/3 items-stretch" onSubmit={submitForm}>
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
			<div className="flex items-center justify-center">
				<input className="w-20 outline-1 bg-slate-300" disabled={!tag || !name} type="submit" value="Create" />
			</div>
		</form>
	);
}