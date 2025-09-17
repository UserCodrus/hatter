import { ExpireAliasButton, ResetAliasButton } from "@/components/interactive";
import { LikedFeed, UserFeed } from "@/components/feed";
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
	if (!user_data.user || !user_data.alias || user_data.expired)
		redirect(pages.root);

	if (!user_data.alias)
		return <ResetAliasButton />;

	const following = await getFollowing(user_data.alias.id);
	const followers = await getFollowers(user_data.alias.id);

	const follower_component = (followers && followers.length > 0) ? <UserList aliases={followers} /> : <div>None</div>;
	const following_component = (following && following.length > 0) ? <UserList aliases={following} /> : <div>None</div>;

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} />
			<div className="layout-horizontal w-4/5">
				<div className="flex flex-col gap-1 items-center p-2">
					<UserProfile
						id={user_data.alias.id}
						name={user_data.alias.name}
						tag={user_data.alias.tag}
						icon={user_data.alias.icon} colors={[user_data.alias.colorA, user_data.alias.colorB]} style={user_data.alias.style}
						followers={followers.length} selfProfile={true} activeUser={true}
					/>
					<div className="flex flex-row justify-stretch gap-2 w-full">
						<div className="flex flex-col grow-1">
							<div className="font-bold">Following</div>
							{following_component}
						</div>
						<div className="flex flex-col grow-1">
							<div className="font-bold">Followers</div>
							{follower_component}
						</div>
					</div>
				</div>
				<div className="flex flex-col p-2">
					<div className="text-lg font-bold">Recent Posts</div>
					<UserFeed currentUser={user_data.alias?.id} userID={user_data.alias.id} viewerID={user_data.alias.id} />
					<div className="text-lg font-bold">Liked Posts</div>
					<LikedFeed currentUser={user_data.alias?.id} userID={user_data.alias.id} viewerID={user_data.alias.id} />
				</div>
			</div>
		</div>
	);
}