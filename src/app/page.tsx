import { GlobalFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import Link from "next/link";
import { ReactElement } from "react";

/** A box that notifies the user that their alias is expired */
function NotifyExpired(): ReactElement
{
	return (
		<div className="p-4">
			Your current account has expired. Go to the <Link href={pages.account}>account page</Link> to acquire a new one.
		</div>
	);
}

/** A box that notifies the user that they need to register */
function NotifyUnregistered(): ReactElement
{
	return (
		<div className="p-4">
			You have not registered with Hatter. Go to the <Link href={pages.account}>account page</Link> to create an alias and start posting!
		</div>
	);
}

/** A box that ask the user to sign in */
function NotifySignout(): ReactElement
{
	return (
		<div className="p-4">
			You aren't currently signed in. Go to the <Link href={pages.api.signin}>signin page</Link> to sign in with Google and register for Hatter.
		</div>
	);
}

export default async function Page()
{
	const user_data = await getUser();

	// Add a notification based on the user's current status
	let notification_component: ReactElement = <></>;
	if (user_data.user === null) {
		notification_component = <NotifySignout />
	} else if (user_data.alias === null) {
		notification_component = <NotifyUnregistered />
	} else if (user_data.expired) {
		notification_component = <NotifyExpired />;
	}

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} />
			{notification_component}
			<div className="flex flex-col w-200 max-w-9/10 p-2">
				<div className="font-bold text-lg">Global Feed</div>
				<GlobalFeed currentUser={user_data.alias?.id} viewerID={user_data.expired ? undefined : user_data.alias?.id} />
			</div>
		</div>
	);
}
