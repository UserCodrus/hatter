import { PostFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> })
{
	const params = await props.params;
	const user_data = await getUser();

	if (user_data.expired)
			redirect(pages.root);

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} expired={user_data.expired}  />
			<div className="p-2 w-2/3">
				<PostFeed postID={params.id} viewerID={user_data.alias?.id} />
			</div>
		</div>
	);
}