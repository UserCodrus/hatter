import Avatar from "boring-avatars";
import { ReactElement } from "react";
import { FollowButton } from "./interactive";
import { pages } from "@/lib/utils";
import { Alias } from "@prisma/client";

const avatar_colors = [
	"#99ff99",
	"#009900"
];

export function UserAvatar(props: { image: string | null, size: number }): ReactElement
{
	if (props.image)
		return <Avatar name={props.image} size={props.size} colors={avatar_colors} variant="beam" square />
	else
		return <Avatar name={"default"} size={props.size} colors={avatar_colors} variant="beam" square />
}

/** Display a user's name and icon */
export function UserName(props: { id: string, tag: string, name: string }): ReactElement
{
	return (
		<a className="flex flex-row gap-2 items-center cursor-pointer" href={pages.user(props.tag)}>
			<UserAvatar image={props.name} size={32} />
			<div>{props.name}</div>
		</a>
	);
}

/** Display a user's full profile, including their name, icon and follower count */
export function UserProfile(props: { id: string, name: string, tag: string, followers: number, following?: boolean, selfProfile: boolean }): ReactElement
{
	return (
		<div className="flex flex-row gap-2 items-center w-full">
			<UserAvatar image={props.name} size={64} />
			<div className="flex flex-col grow-1">
				<div className="font-bold">{props.name}</div>
				<div>${props.tag}</div>
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
		components.push(<UserName id={alias.id} tag={alias.tag} name={alias.name} key={key} />);
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