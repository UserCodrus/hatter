import { UserFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";

export default async function Home(props: { params: Promise<{ id: string }> })
{
	const params = await props.params;
	const user_data = await getUser();

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias}  />
			<UserFeed id={params.id} label="Post History" />
		</div>
	);
}