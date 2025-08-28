import Avatar from "boring-avatars";
import { ReactElement } from "react";
import { FollowButton } from "./buttons";

const avatar_colors = [
	"#99ff99",
	"#009900"
];

export function UserAvatar(props: {id: string, size: number}): ReactElement
{
	return <Avatar name={props.id} size={props.size} colors={avatar_colors} variant="beam" square />
}

export function UserData(props: {id: string, name: string, tag: string, followers: number}): ReactElement
{
	return (
		<div className="flex flex-row gap-2 items-center">
			<UserAvatar id={props.id} size={64} />
			<div className="flex flex-col">
				<div className="font-bold">{props.name}</div>
				<div>${props.tag}</div>
			</div>
			<div>
				{props.followers} Followers
			</div>
			<div>
				<FollowButton id={props.id} />
			</div>
		</div>
	);
}