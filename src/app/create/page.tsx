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

	return (<>
		<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} />
		<div>Create a post</div>
		<div className="w-1/3 m-2">
			<CreatePost />
		</div>
	</>);
}