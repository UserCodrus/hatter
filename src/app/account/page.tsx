import { CreateAlias, UpdateAlias } from "@/components/forms";
import { Header } from "@/components/header";
import { ContentPanel } from "@/components/info";
import { ResetAliasButton } from "@/components/interactive";
import { getUser } from "@/lib/db";
import { getNextReset, pages, randomColor } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ReactElement } from "react";

/** Show the signup form when the user needs to create an account */
function Signup(): ReactElement
{
	const default_avatar = {
		icon: Date.now().toString(),
		colorA: randomColor(),
		colorB: randomColor(),
		style: "beam",
	}

	const expires = getNextReset();
	return (
		<div className="flex flex-col flex-1 p-2 gap-2 items-center justify-center w-full">
			<ContentPanel>
				<div className="text-center">
					<p>Fill out the boxes below to create a new alias.</p>
					<p>Your alias will be available until {expires.toLocaleString()}.</p>
					<p>A different user will receive your alias at this time and you will be unable to change the information below.</p>
				</div>
			</ContentPanel>
			<div className="flex flex-col justify-center w-full">
				<CreateAlias defaultAvatar={default_avatar} />
			</div>
		</div>
	);
}

/** Show a form to update the user's alias */
function Update(props: {tag: string, name: string, bio: string | null}): ReactElement
{
	return (
		<div className="flex flex-col items-center w-full">
			<ContentPanel>
				Fill out the boxes below to change your alias info.
			</ContentPanel>
			<UpdateAlias tag={props.tag} name={props.name} bio={props.bio} />
		</div>
	);
}

/** Show a form for getting a new alias */
function Expired(props: { expiration: Date }): ReactElement
{
	const date_format: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" };

	return (
		<ContentPanel>
			<div className="flex flex-col gap-4 items-center">
				<div className="text-center">
					<div>Your current account expired on {props.expiration.toLocaleString("default", date_format)}</div>
					<div>Click the button below to get a new one.</div>
				</div>
				<ResetAliasButton />
			</div>
		</ContentPanel>
	);
}

export default async function Page()
{
	const user_data = await getUser();

	// Redirect if the user isn't logged in or has already signed up
	if (!user_data.user)
		redirect(pages.root);
	if (user_data.user && user_data.alias && !user_data.expired && !user_data.owned)
		redirect(pages.history);

	return (<>
		<Header user={user_data.user} alias={user_data.alias} expired={user_data.expired} admin={user_data.admin} />
		{user_data.alias && user_data.expired && <Expired expiration={user_data.expires}/>}
		{user_data.alias && !user_data.expired && <Update tag={user_data.alias.tag} name={user_data.alias.name} bio={user_data.alias.bio} />}
		{!user_data.alias && <Signup />}
	</>);
}