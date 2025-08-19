'use client';

import { FormEvent, ReactElement, useState } from "react";

export function CreatePost(): ReactElement
{
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	async function submitForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const body = { title, content };
			await fetch("/api/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
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
			<input disabled={!content || !title} type="submit" value="Post" />
		</form>
	);
}