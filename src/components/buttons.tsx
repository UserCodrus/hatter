'use client';

import { resetAlias } from "@/lib/db";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

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