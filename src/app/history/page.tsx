import { ResetAliasButton } from "@/components/buttons";
import { UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getAlias, getUser } from "@/lib/db";

export default async function Home() {
	const user_data = await getUser();
	console.log(`Alias: ${user_data?.alias?.name}`);
	
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			<ResetAliasButton />
			{user_data?.alias && <UserFeed id={user_data.alias.id} label="My Posts" />}
		</div>
	);
}