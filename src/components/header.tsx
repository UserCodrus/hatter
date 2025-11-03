import { SessionUser } from "@/lib/auth";
import { ReactElement } from "react";
import { NavigationButton, LinkButton, MenuItem, ImageButton } from "./navigation";
import { Alias } from "@prisma/client";
import { pages } from "@/lib/utils";
import { DropDownMenu } from "./menus";
import { Icon, UserAvatar } from "./info";
import { ExpireAliasButton, UnregisterUserButton } from "./interactive";

/** Displays a user's current status and gives them the option to sign in or out */
function UserComponent(props: { user: SessionUser | null, alias: Alias | null, admin?: boolean, expired: boolean, banned: boolean }): ReactElement
{
	if (props.user) {
		// Create the main component for the dropdown menu
		const show_alert = props.expired || props.banned || !props.alias;
		let name = props.alias ? props.alias.name : "Not Registered";
		if (props.banned)
			name = "Account Banned";

		const main = <div className="flex flex-row items-center gap-2 text-center">
			<div className="text-nowrap">{name}</div>
			{show_alert && <div className="text-alert"><Icon size={16} id={"tdesign--notification-error-filled"} /></div>}
			{props.alias && !props.banned && <UserAvatar icon={props.alias.icon} colors={[props.alias.colorA, props.alias.colorB]} style={props.alias.style} size={32} />}
		</div>

		// Add basic options to the dropdown menu
		const dropdown: ReactElement[] = [
				<MenuItem label={props.alias ? "Account" : "Register"} target={pages.account} key={1} />,
				<MenuItem label="Sign Out" target={pages.api.signout} key={2} />,
			];

		// Add admin options to the menu
		if (props.admin) {
			dropdown.push(<ExpireAliasButton key={3} />);
			dropdown.push(<UnregisterUserButton key={4} />);
		}

		return (
			<DropDownMenu main={main} disabled={props.user === null}>
				<div className="flex flex-col gap-2 p-2 text-center w-40">
					{dropdown}
				</div>
			</DropDownMenu>
		);
	}

	// Fallback to a simple sign in button
	return <LinkButton label="Sign In" target={pages.api.signin} />;
}

/** A set of navigation buttons that provide different options depending on the user's status */
function NavigationBar(props: { alias: Alias | null }): ReactElement
{
	return (
		<div className="flex flex-row gap-2 font-bold flex-1">
			<ImageButton src="/logo.png" target={pages.root} />
			{props.alias && <NavigationButton label="All" target={pages.global} />}
			{props.alias && <NavigationButton label="Me" target={pages.history} />}
			{props.alias && <NavigationButton label="Create" target={pages.create} />}
		</div>
	)
}

export async function Header(props: { user: SessionUser | null, alias: Alias | null, admin?: boolean, expired: boolean, banned: boolean }): Promise<ReactElement>
{
	return (
		<div className="flex flex-row items-center gap-2 w-full sticky top-0 header">
			<NavigationBar alias={!props.expired && !props.banned ? props.alias : null} />
			<UserComponent user={props.user} alias={props.alias} admin={props.admin} expired={props.expired} banned={props.banned} />
		</div>
	);
}