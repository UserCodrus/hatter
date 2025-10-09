import { ResetAliasButton } from "@/components/interactive";
import { FeedWrapper, UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getFollowers, getFollowing, getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/info";

export default async function Page()
{
	const user_data = await getUser();
	console.log(`Alias: ${user_data.alias?.name}, expired: ${user_data.expired}, owned: ${user_data.owned}`);

	// Send the user to the home page if they aren't logged in
	if (!user_data.user || !user_data.alias || user_data.expired || user_data.banned !== null)
		redirect(pages.root);

	if (!user_data.alias)
		return <ResetAliasButton />;

	const following = await getFollowing(user_data.alias.id);
	const followers = await getFollowers(user_data.alias.id);

	return (<>
		<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} banned={user_data.banned !== null}/>
		<div className="flex flex-col lg:flex-row w-full items-center lg:items-start lg:justify-center p-2 gap-2 mt-2">
			<UserProfile
				alias={user_data.alias}
				followers={followers} following={following}
				selfProfile={true} activeUser={true} userFollowed={true}
			/>
			<FeedWrapper>
				<UserFeed currentUser={user_data.alias?.id} userID={user_data.alias.id} userName={user_data.alias.name} />
			</FeedWrapper>
		</div>
	</>);
}