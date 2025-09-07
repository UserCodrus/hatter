import { GlobalFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { AliasExpired } from "@/components/info";
import { getUser } from "@/lib/db";

export default async function Page()
{
	const user_data = await getUser();

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} />
			{user_data.expired && <AliasExpired />}
			<div className="flex flex-col w-2/3 p-2">
				<div className="font-bold text-lg">Global Feed</div>
				<GlobalFeed viewerID={user_data.alias?.id} />
			</div>
		</div>
	);
}
