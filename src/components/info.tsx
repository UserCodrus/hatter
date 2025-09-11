import Avatar from "boring-avatars";
import { ReactElement } from "react";
import { FollowButton } from "./interactive";
import { pages } from "@/lib/utils";
import { Alias } from "@prisma/client";
import Link from "next/link";

const avatar_colors = [
	"#99ff99",
	"#009900"
];

export function UserAvatar(props: { icon: string, colors: string[], style: string, size: number }): ReactElement
{
	return <Avatar name={props.icon} size={props.size} colors={props.colors} variant={props.style ? props.style as any : "beam"} square />
}

/** Display a user's name and icon */
export function UserName(props: { id: string, tag: string, name: string, icon: string, colors: string[], style: string }): ReactElement
{
	return (
		<a className="flex flex-row gap-2 items-center cursor-pointer" href={pages.user(props.tag)}>
			<UserAvatar icon={props.icon} colors={props.colors} style={props.style} size={32} />
			<div>{props.name}</div>
		</a>
	);
}

/** Display a user's full profile, including their name, icon and follower count */
export function UserProfile(props: { id: string, name: string, tag: string, icon: string, colors: string[], style: string, followers: number, following?: boolean, selfProfile: boolean }): ReactElement
{
	return (
		<div className="flex flex-row gap-2 items-center w-full">
			<UserAvatar icon={props.icon} colors={props.colors} style={props.style} size={64} />
			<div className="flex flex-col grow-1">
				<div className="font-bold">{props.name}</div>
				<div>@{props.tag}</div>
			</div>
			<div>
				<FollowButton userID={props.id} followers={props.followers} following={props.following} selfProfile={props.selfProfile} />
			</div>
		</div>
	);
}

/** A list of users */
export function UserList(props: { aliases: Alias[] }): ReactElement
{
	const components: ReactElement[] = [];
	let key = 0;
	for (const alias of props.aliases) {
		components.push(<UserName id={alias.id} tag={alias.tag} icon={alias.icon} colors={[alias.colorA, alias.colorB]} style={alias.style} name={alias.name} key={key} />);
		++key;
	}

	return (
		<div className="flex flex-col gap-1">
			{components}
		</div>
	);
}

/** An svg icon */
export function Icon(props: { size: number, id: string }): ReactElement
{
	return (
		<svg width={props.size} height={props.size}><use href={pages.icons + "#" + props.id} /></svg>
	);
}

/** A box that notifies the user that their alias is expired */
export function AliasExpired(): ReactElement
{
	return (
		<div className="p-4">
			Your current account has expired. Go to the <Link href={pages.account}>account page</Link> to acquire a new one.
		</div>
	);
}