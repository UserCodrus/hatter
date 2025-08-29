import { UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { UserList, UserProfile } from "@/components/info";
import { getAliasData, getUser } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> })
{
	const params = await props.params;
	const user_data = await getUser();
	const alias = await getAliasData(params.id);

	if (alias === null)
		notFound();

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias}  />
			<UserProfile id={alias.id} name={alias.name} tag={alias.tag} followers={alias.followers.length} />
			{alias.following.length > 0 && <div>
				<div className="text-center">Following</div>
				<UserList aliases={alias.following} />
			</div>}
			<UserFeed id={params.id} label="Post History" />
		</div>
	);
}