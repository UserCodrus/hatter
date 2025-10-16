import { FeedWrapper, GlobalFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { ContentPanel } from "@/components/info";
import { getUser } from "@/lib/db";
import { pages } from "@/lib/utils";
import Link from "next/link";
import { ReactElement } from "react";

/** A box that notifies the user that their alias is expired */
function NotifyExpired(): ReactElement
{
	return (
		<ContentPanel>
			Your current account has expired. Go to the <Link href={pages.account}>account page</Link> to acquire a new one.
		</ContentPanel>
	);
}

/** A box that notifies the user that they need to register */
function NotifyUnregistered(): ReactElement
{
	return (
		<ContentPanel>
			You have not registered with Hatter. Go to the <Link href={pages.account}>account page</Link> to create an alias and start posting!
		</ContentPanel>
	);
}

/** A box that ask the user to sign in */
function NotifySignout(): ReactElement
{
	return (
		<ContentPanel>
			You aren't currently signed in. Go to the <Link href={pages.api.signin}>signin page</Link> to sign in with Google and register for Hatter.
		</ContentPanel>
	);
}

/** A box that notifies the user that they have been banned */
function NotifyBan(props: { expiration: Date }): ReactElement
{
	return (
		<ContentPanel>
			Your current account is currently banned until {props.expiration.toLocaleDateString()}.
		</ContentPanel>
	);
}

export default async function Page()
{
	const user_data = await getUser();

	// Add a notification based on the user's current status
	let notification_component: ReactElement | null = null;
	if (user_data.user === null) {
		notification_component = <NotifySignout />
	} else if (user_data.banned !== null) {
		notification_component = <NotifyBan expiration={user_data.banned} />
	} else if (user_data.alias === null) {
		notification_component = <NotifyUnregistered />
	} else if (user_data.expired) {
		notification_component = <NotifyExpired />;
	}

	return (<>
		<Header user={user_data.user} alias={user_data.alias} admin={user_data.admin} expired={user_data.expired} banned={user_data.banned !== null} />
		<div className="flex flex-col gap-4 mt-4">
			{notification_component}
			<FeedWrapper>
				<GlobalFeed currentUser={user_data.alias?.id} viewerID={user_data.expired ? undefined : user_data.alias?.id} banned={user_data.banned !== null} />
			</FeedWrapper>
		</div>
	</>);
}
