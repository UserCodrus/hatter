import { SessionUser } from "@/lib/auth";
import Image from "next/image";
import { ReactElement } from "react";
import { NavigationButton, LinkButton, MenuItem } from "./navigation";
import { Alias } from "@prisma/client";
import { pages } from "@/lib/utils";
import { DropDownMenu } from "./menus";
import Avatar from "boring-avatars";

const avatar_colors = [
		"#99ff99",
		"#009900"
	]

/** Displays a user's current status and gives them the option to sign in or out */
function UserComponent(props: {user: SessionUser | null, alias: Alias | null}): ReactElement
{
	let main = <LinkButton label="Sign In" target={pages.api.signin} />;
	let dropdown: ReactElement[] = [];
	
	if (props.user) {
		if (props.alias) {
			// Display the user's current alias as the dropdown element
			const img = props.alias?.image;

			main = <div className="flex flex-row items-center gap-2 text-center">
				<Avatar name={props.alias.id} colors={avatar_colors} variant="beam" size={32} square />
				<div className="text-nowrap">{props.alias.name}</div>
			</div>;

			dropdown = [
				<MenuItem label="Account" target={pages.signup} key={1} />,
				<MenuItem label="Sign Out" target={pages.api.signout} key={2} />,
			];
		} else {
			// Display a button to create an account if the user doesn't have an alias yet
			dropdown = [
				<MenuItem label="Setup" target={pages.signup} key={1} />,
				<MenuItem label="Sign Out" target={pages.api.signout} key={2} />,
			];
		}
	}

	return (
			<DropDownMenu main={main}>
				<div className="flex flex-col gap-2 p-2 bg-slate-500 text-center">
					{dropdown}
				</div>
			</DropDownMenu>
	);
}

/** A set of navigation buttons that provide different options depending on the user's status */
function NavigationBar(props: {alias: Alias | null}): ReactElement
{
	return (
		<div className="flex flex-row gap-2 font-bold flex-1">
			<NavigationButton label="Home" target={pages.root} />
			{props.alias && <NavigationButton label="Posts" target={pages.history} />}
			{props.alias && <NavigationButton label="Create" target={pages.create} />}
		</div>
	)
}

export async function Header(props: {user: SessionUser | null, alias: Alias | null}): Promise<ReactElement>
{
	return (
		<div className="flex flex-row items-center gap-2 p-2 w-full sticky top-0 z-10 bg-slate-400">
			<NavigationBar alias={props.alias} />
			<UserComponent user={props.user} alias={props.alias} />
		</div>
	);
}