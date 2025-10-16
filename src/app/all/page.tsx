import { FeedWrapper, GlobalFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page()
{
	const user_data = await getUser();

	// Send the user to the home page if they aren't logged in
	if (!user_data.user || !user_data.alias || user_data.expired || user_data.banned !== null)
		redirect(pages.root);

	return (<>
		<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} banned={user_data.banned !== null} />
		<div className="flex flex-col gap-4 mt-4">
			<FeedWrapper>
				<GlobalFeed currentUser={user_data.alias?.id} viewerID={user_data.expired ? undefined : user_data.alias?.id} banned={user_data.banned !== null} />
			</FeedWrapper>
		</div>
	</>);
}