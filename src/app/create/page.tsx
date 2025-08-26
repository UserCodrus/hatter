import { CreatePost } from "@/components/forms";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page()
{
	const user_data = await getUser();

	// Send the user to the home page if they aren't logged in
	if (!user_data.user || !user_data.alias)
		redirect(pages.root);

	// Send the user to the history page to 

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			<CreatePost />
		</div>
	);
}