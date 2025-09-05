import { LikedFeed, UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { UserList, UserProfile } from "@/components/info";
import { getAliasData, getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> })
{
	const params = await props.params;
	const user_data = await getUser();
	const alias = await getAliasData(params.id);

	if (user_data.expired)
		redirect(pages.root);

	if (alias === null)
		notFound();

	const follower_component = (alias.following.length > 0) ? <UserList aliases={alias.following} /> : <div>None</div>;
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} expired={user_data.expired}  />
			<div className="layout-horizontal w-4/5">
				<div className="flex flex-col p-2 gap-1">
					<UserProfile
						id={alias.id} name={alias.name} tag={alias.tag}
						followers={alias.followers.length}
						following={alias._count.followers > 0}
						selfProfile={user_data.alias?.id === alias.id}
					/>
					<div>
						<div className="font-bold">Following</div>
						{follower_component}
					</div>
				</div>
				<div className="flex flex-col p-2">
					<div className="text-lg font-bold">Recent Posts</div>
					<UserFeed userID={alias.id} viewerID={user_data.alias?.id} />
					<div className="text-lg font-bold">Liked Posts</div>
					<LikedFeed userID={alias.id} viewerID={user_data.alias?.id} />
				</div>
			</div>
		</div>
	);
}