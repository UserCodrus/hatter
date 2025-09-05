import { CreatePost } from "@/components/forms";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page()
{
	const user_data = await getUser();

	// Send the user to the home page if they aren't logged in
	if (!user_data.user || !user_data.alias || user_data.expired)
		redirect(pages.root);

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} expired={user_data.expired} />
			<div className="w-1/3">
				<CreatePost />
			</div>
		</div>
	);
}