import { GlobalFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";

export default async function Page()
{
	const user_data = await getUser();

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			<div className="flex flex-col w-4/5 p-2">
				<div className="font-bold text-lg">Global Feed</div>
				<GlobalFeed viewerID={user_data.alias?.id} />
			</div>
		</div>
	);
}
