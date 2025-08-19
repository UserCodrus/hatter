import { options } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { ReactElement } from "react";
import { NavigationButton, LinkButton } from "./navigation";

export async function Header(): Promise<ReactElement>
{
	let left_components = [<NavigationButton label="Home" target="/" key={1} />];
	let right_components = [<LinkButton label="Sign In" target="/api/auth/signin" key={1} />];

	// Switch components if the user is signed in
	const session = await getServerSession(options);
	if (session) {
		// Get user data from the session
		const user = session.user ? session.user.name : "Unknown";
		const img = session.user?.image;

		right_components = [
			<div key={1}>{img && <Image src={img} alt="Icon" width={32} height={32} />}</div>,
			<div key={2}>{user}</div>,
			<LinkButton label="Sign Out" target="/api/auth/signout" key={3} />
		];
		left_components = [
			<NavigationButton label="Home" target="/" key={1} />,
			<NavigationButton label="Create" target="/create" key={2} />
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