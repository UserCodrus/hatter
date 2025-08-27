import { ResetAliasButton } from "@/components/buttons";
import { UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page()
{
	const user_data = await getUser();
	console.log(`Alias: ${user_data.alias?.name}, expired: ${user_data.expired}, owned: ${user_data.owned}`);

	// Send the user to the home page if they aren't logged in
	if (!user_data.user)
		redirect(pages.root);
	
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			<ResetAliasButton />
			{user_data.alias && <UserFeed id={user_data.alias.id} label="My Posts" />}
		</div>
	);
}