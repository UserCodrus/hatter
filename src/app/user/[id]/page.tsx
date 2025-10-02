import { FeedHeader, FeedWrapper, LikedFeed, UserFeed } from "@/components/feed";
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

	return (<>
		<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired}  />
		<div className="flex flex-col lg:flex-row w-full items-center lg:items-start lg:justify-center p-2 gap-2 mt-2">
			<UserProfile
				alias={alias}
				followers={alias.followers}
				userFollowed={alias._count ? alias._count.followers > 0 : false}
				selfProfile={user_data.alias?.id === alias.id}
				activeUser={user_data.alias !== null && !user_data.expired}
			/>
			<FeedWrapper>
				<UserFeed currentUser={user_data.alias?.id} userID={alias.id} userName={alias.name} />
			</FeedWrapper>
		</div>
	</>);
}