import { ExpireAliasButton, ResetAliasButton } from "@/components/interactive";
import { FeedHeader, FeedWrapper, LikedFeed, UserFeed } from "@/components/feed";
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

	return (<>
		<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} />
		<div className="flex flex-col lg:flex-row w-full items-center lg:items-start lg:justify-center">
			<div className="flex flex-col p-2 gap-1 w-200 lg:w-100 max-w-[90vw]">
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
			<FeedWrapper>
				<FeedHeader>Recent Posts</FeedHeader>
				<UserFeed currentUser={user_data.alias?.id} userID={user_data.alias.id} viewerID={user_data.alias.id} />
				<FeedHeader>Liked Posts</FeedHeader>
				<LikedFeed currentUser={user_data.alias?.id} userID={user_data.alias.id} viewerID={user_data.alias.id} />
			</FeedWrapper>
		</div>
	</>);
}