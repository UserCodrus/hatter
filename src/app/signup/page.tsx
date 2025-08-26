import { CreateAlias } from "@/components/forms";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page()
{
	const user_data = await getUser();

	// Redirect if the user has already signed up
	if (user_data.user && user_data.alias)
			redirect(pages.history);

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			<CreateAlias />
		</div>
	);
}