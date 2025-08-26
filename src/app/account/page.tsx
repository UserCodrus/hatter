import { CreateAlias, UpdateAlias } from "@/components/forms";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { getNextReset, pages } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ReactElement } from "react";

/** Show the signup form when the user needs to create an account */
function Signup(): ReactElement
{
	const expires = getNextReset();
	return (
		<div className="flex flex-col items-center w-full">
			<div className="p-4 text-center">
				<p>Fill out the boxes below to create a new alias.</p>
				<p>Your alias will be available until {expires.toLocaleString()}.</p>
				<p>A different user will receive your alias at this time and you will be unable to change the information below.</p>
			</div>
			<CreateAlias />
		</div>
	);
}

/** Show a form to update the user's alias */
function Update(props: {tag: string, name: string, bio: string | null}): ReactElement
{
	return (
		<div className="flex flex-col items-center w-full">
			<div className="p-4 text-center">
				<p>Fill out the boxes below to change your alias info.</p>
			</div>
			<UpdateAlias tag={props.tag} name={props.name} bio={props.bio} />
		</div>
	);
}

export default async function Page()
{
	const user_data = await getUser();

	// Redirect if the user isn't logged in or has already signed up
	if (!user_data.user)
		redirect(pages.root);
	if (user_data.user && user_data.alias && !user_data.owned)
		redirect(pages.history);

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} />
			{user_data.alias && <Update tag={user_data.alias.tag} name={user_data.alias.name} bio={user_data.alias.bio} />}
			{!user_data.alias && <Signup />}
		</div>
	);
}