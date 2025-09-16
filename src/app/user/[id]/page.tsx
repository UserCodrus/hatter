import { LikedFeed, UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { UserList, UserProfile } from "@/components/info";
import { getAliasData, getUser } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> })
{
	const params = await props.params;
	const user_data = await getUser();
	const alias = await getAliasData(params.id, user_data.alias?.id);

	if (alias === null)
		notFound();

	const follower_component = (alias.following.length > 0) ? <UserList aliases={alias.following} /> : <div>None</div>;
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired}  />
			<div className="layout-horizontal w-4/5">
				<div className="flex flex-col p-2 gap-1">
					<UserProfile
						id={alias.id} name={alias.name} tag={alias.tag}
						icon={alias.icon} colors={[alias.colorA, alias.colorB]} style={alias.style}
						followers={alias.followers.length}
						following={alias._count ? alias._count.followers > 0 : false}
						selfProfile={user_data.alias?.id === alias.id}
						activeUser={user_data.alias !== null}
					/>
					<div>
						<div className="font-bold">Following</div>
						{follower_component}
					</div>
				</div>
				<div className="flex flex-col p-2">
					<div className="text-lg font-bold">Recent Posts</div>
					<UserFeed currentUser={user_data.alias?.id} userID={alias.id} viewerID={user_data.alias?.id} />
					<div className="text-lg font-bold">Liked Posts</div>
					<LikedFeed currentUser={user_data.alias?.id} userID={alias.id} viewerID={user_data.alias?.id} />
				</div>
			</div>
		</div>
	);
}