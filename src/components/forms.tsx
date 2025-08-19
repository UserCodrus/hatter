'use client';

import { useRouter } from "next/navigation";
import { FormEvent, ReactElement, useState } from "react";

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
			<input disabled={!content || !title} type="submit" value="Post" />
		</form>
	);
}