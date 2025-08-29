import { ResetAliasButton } from "@/components/interactive";
import { UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getFollowers, getFollowing, getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";
import { UserList, UserProfile } from "@/components/info";

export default async function Page()
{
	const user_data = await getUser();
	console.log(`Alias: ${user_data.alias?.name}, expired: ${user_data.expired}, owned: ${user_data.owned}`);

	// Send the user to the home page if they aren't logged in
	if (!user_data.user)
		redirect(pages.root);

	if (!user_data.alias)
		return <ResetAliasButton />;

	const following = await getFollowing(user_data.alias.id);
	const followers = await getFollowers(user_data.alias.id);
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			<ResetAliasButton />
			<UserProfile id={user_data.alias.id} name={user_data.alias.name} tag={user_data.alias.tag} followers={followers.length} />
			{following && following.length > 0 && <div>
				<div className="text-center">Following</div>
				<UserList aliases={following} />
			</div>}
			{user_data.alias && <UserFeed id={user_data.alias.id} label="My Posts" />}
		</div>
	);
}