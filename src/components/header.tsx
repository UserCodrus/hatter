import { options, SessionUser } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { ReactElement } from "react";
import { NavigationButton, LinkButton } from "./navigation";
import { Alias } from "@prisma/client";

/** Displays a user's current status and gives them the option to sign in or out */
function UserComponent(): ReactElement
{
	return (
		<LinkButton label="Sign In" target="/api/auth/signin" key={1} />
	);
}

/** A set of navigation buttons that provide different options depending on the user's status */
function NavigationBar(): ReactElement
{
	return (
		<div>
			<NavigationButton label="Home" target="/" />
			<NavigationButton label="Posts" target="/history" />
			<NavigationButton label="Create" target="/create" />
		</div>
	)
}

export async function Header(props: {user: SessionUser | null, alias: Alias | null}): Promise<ReactElement>
{
	let left_components = [<NavigationButton label="Home" target="/" key={1} />];
	let right_components = [<LinkButton label="Sign In" target="/api/auth/signin" key={1} />];

	// Switch components if the user is signed in
	if (props.user) {
		// Get user data from the session
		const user = props.user.name;
		const img = props.user?.image;

		right_components = [
			<div key={1}>{img && <Image src={img} alt="Icon" width={32} height={32} />}</div>,
			<div key={2}>{user}</div>,
			<LinkButton label="Create Account" target="/signup" key={3} />,
			<LinkButton label="Sign Out" target="/api/auth/signout" key={4} />
		];
		left_components = [
			<NavigationButton label="Home" target="/" key={1} />,
			<NavigationButton label="Posts" target="/history" key={2} />,
			<NavigationButton label="Create" target="/create" key={3} />,
		];
	}
	return (
		<div className="flex flex-row items-center gap-2 p-2 w-full sticky top-0 bg-slate-400">
			<div className="flex flex-row gap-2 font-bold flex-1">
				{left_components}
			</div>
			<div className="flex flex-row items-center gap-2">
				{right_components}
			</div>
		</div>
	);
}