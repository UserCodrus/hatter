import Avatar from "boring-avatars";
import { ReactElement, ReactNode, useEffect } from "react";
import { FollowButton } from "./interactive";
import { getScrollRatio, pages } from "@/lib/utils";
import { Alias } from "@prisma/client";

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
export function UserProfile(props: { alias: Alias, followers: Alias[], following?: Alias[] | null, userFollowed: boolean, selfProfile: boolean, activeUser: boolean }): ReactElement
{
	const follower_component = (props.followers && props.followers.length > 0) ? <UserList aliases={props.followers} /> : <div>None</div>;
	const following_component = (props.following && props.following.length > 0) ? <UserList aliases={props.following} /> : <div>None</div>;

	return (
		<div className="flex flex-col p-2 gap-2 w-200 max-w-[90vw] panel">
			<div className="flex flex-row gap-2 items-center w-full">
				<UserAvatar icon={props.alias.icon} colors={[props.alias.colorA, props.alias.colorB]} style={props.alias.style} size={64} />
				<div className="flex flex-col grow-1">
					<div className="font-bold">{props.alias.name}</div>
					<div>@{props.alias.tag}</div>
				</div>
				<div>
					<FollowButton userID={props.alias.id} followers={props.followers.length} following={props.userFollowed || props.selfProfile} disabled={!props.activeUser} />
				</div>
			</div>
			{props.alias.bio && <div className="panel-inner">
				{props.alias.bio}
			</div>}
			<div className="flex flex-row justify-stretch gap-2 w-full panel-inner">
				<div className="flex flex-col grow-1">
					<div className="font-bold">Following</div>
					{following_component}
				</div>
				<div className="flex flex-col grow-1">
					<div className="font-bold">Followers</div>
					{follower_component}
				</div>
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

/** A box used to display content other than posts, like alerts or status messages */
export function ContentPanel(props: { children?: ReactNode }): ReactElement
{
	return (
		<div className="fit-width p-2 panel">
			{props.children}
		</div>
	);
}