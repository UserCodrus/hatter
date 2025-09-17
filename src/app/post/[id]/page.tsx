import { FeedWrapper, PostFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";

export default async function Page(props: { params: Promise<{ id: string }> })
{
	const params = await props.params;
	const user_data = await getUser();

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired}  />
			<FeedWrapper>
				<PostFeed currentUser={user_data.alias?.id} postID={params.id} viewerID={user_data.expired ? undefined : user_data.alias?.id} />
			</FeedWrapper>
		</div>
	);
}