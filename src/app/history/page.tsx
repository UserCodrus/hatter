import { ResetAliasButton } from "@/components/buttons";
import { UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getAlias, getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ReactElement } from "react";

export default async function Page()
{
	const user_data = await getUser();
	console.log(`Alias: ${user_data.alias?.name}, expired: ${user_data.expired}`);

	// Send the user to the home page if they aren't logged in
	if (!user_data.user)
		redirect(pages.root);

	let inner_component: ReactElement;
	if (user_data.alias)
	
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			<ResetAliasButton />
			{user_data.alias && !user_data.expired && <UserFeed id={user_data.alias.id} label="My Posts" />}
		</div>
	);
}