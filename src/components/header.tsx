import { SessionUser } from "@/lib/auth";
import Image from "next/image";
import { ReactElement } from "react";
import { NavigationButton, LinkButton } from "./navigation";
import { Alias } from "@prisma/client";

/** Displays a user's current status and gives them the option to sign in or out */
function UserComponent(props: {user: SessionUser | null, alias: Alias | null}): ReactElement
{
	let inner_components = <LinkButton label="Sign In" target="/api/auth/signin" />;
	
	if (props.user) {
		if (props.alias) {
			// Display the user's current alias
			const img = props.alias?.image;
			inner_components = <>
				<div key={1}>{img && <Image src={img} alt="Icon" width={32} height={32} />}</div>
				<div>{props.alias.name}</div>
				<LinkButton label="Sign Out" target="/api/auth/signout" />
			</>
		} else {
			// Display a button to create an account if the user doesn't have an alias yet
			inner_components = <>
				<LinkButton label="Set Up Account" target="/signup" />
				<LinkButton label="Sign Out" target="/api/auth/signout" />
			</>
		}
	}

	return (
		<div className="flex flex-row items-center gap-2">
			{inner_components}
		</div>
	);
}

/** A set of navigation buttons that provide different options depending on the user's status */
function NavigationBar(props: {alias: Alias | null}): ReactElement
{
	return (
		<div className="flex flex-row gap-2 font-bold flex-1">
			<NavigationButton label="Home" target="/" />
			{props.alias && <NavigationButton label="Posts" target="/history" />}
			{props.alias && <NavigationButton label="Create" target="/create" />}
		</div>
	)
}

export async function Header(props: {user: SessionUser | null, alias: Alias | null}): Promise<ReactElement>
{
	return (
		<div className="flex flex-row items-center gap-2 p-2 w-full sticky top-0 bg-slate-400">
			<NavigationBar alias={props.alias} />
			<UserComponent user={props.user} alias={props.alias} />
		</div>
	);
}