import { SessionUser } from "@/lib/auth";
import { ReactElement } from "react";
import { NavigationButton, LinkButton, MenuItem } from "./navigation";
import { Alias } from "@prisma/client";
import { pages } from "@/lib/utils";
import { DropDownMenu } from "./menus";
import { Icon, UserAvatar } from "./info";
import { ExpireAliasButton, UnregisterUserButton } from "./interactive";

/** Displays a user's current status and gives them the option to sign in or out */
function UserComponent(props: { user: SessionUser | null, alias: Alias | null, admin?: boolean, expired: boolean }): ReactElement
{
	if (props.user) {
		let dropdown: ReactElement[] = [];
		let main = <div className="flex flex-row items-center">Not Registered</div>
		if (props.alias) {
			// Display the user's current alias as the dropdown element
			main = <div className="flex flex-row items-center gap-2 text-center">
				<div className="text-nowrap">{props.alias.name}</div>
				{props.expired && <div className="text-alert"><Icon size={16} id={"tdesign--notification-error-filled"} /></div>}
				<UserAvatar icon={props.alias.icon} colors={[props.alias.colorA, props.alias.colorB]} style={props.alias.style} size={32} />
			</div>;

			dropdown = [
				<MenuItem label="Account" target={pages.account} key={1} />,
				<MenuItem label="Sign Out" target={pages.api.signout} key={2} />,
			];

			// Add admin options to the menu
			if (props.admin) {
				dropdown.push(<ExpireAliasButton key={3} />);
				dropdown.push(<UnregisterUserButton key={4} />);
			}
		} else {
			// Display a button to create an account if the user doesn't have an alias yet
			dropdown = [
				<MenuItem label="Register" target={pages.account} key={1} />,
				<MenuItem label="Sign Out" target={pages.api.signout} key={2} />,
			];
		}

		return (
			<DropDownMenu main={main} disabled={props.user === null}>
				<div className="flex flex-col gap-2 p-2 text-center w-40 panel">
					{dropdown}
				</div>
			</DropDownMenu>
		);
	}

	return <LinkButton label="Sign In" target={pages.api.signin} />;
}

/** A set of navigation buttons that provide different options depending on the user's status */
function NavigationBar(props: { alias: Alias | null }): ReactElement
{
	return (
		<div className="flex flex-row gap-2 font-bold flex-1">
			<NavigationButton label="Home" target={pages.root} />
			{props.alias && <NavigationButton label="Posts" target={pages.history} />}
			{props.alias && <NavigationButton label="Create" target={pages.create} />}
		</div>
	)
}

export async function Header(props: { user: SessionUser | null, alias: Alias | null, admin?: boolean, expired: boolean }): Promise<ReactElement>
{
	return (
		<div className="flex flex-row items-center gap-2 p-2 w-full sticky top-0 z-20 header">
			<NavigationBar alias={props.expired ? null : props.alias} />
			<UserComponent user={props.user} alias={props.alias} admin={props.admin} expired={props.expired} />
		</div>
	);
}