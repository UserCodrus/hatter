import { options } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { ReactElement } from "react";
import { NavigationButton } from "./navigation";

export async function Header(): Promise<ReactElement>
{
	const session = await getServerSession(options);

	if (session) {
		// Get user data from the session
		const user = session.user ? session.user.name : "Unknown";
		const img = session.user?.image;

		return (
			<div className="flex flex-row items-center gap-2 p-2 w-full sticky top-0 bg-slate-400">
				<div className="flex flex-row gap-2 font-bold flex-1">
					<NavigationButton label="Home" target="/" />
					<NavigationButton label="Create" target="/create" />
				</div>
				<div className="flex flex-row items-center">
					<div>{img && <Image src={img} alt="Icon" width={32} height={32} />}</div>
					<div>{user}</div>
				</div>
				
			</div>
		);
	}

	return (
		<div>Error: no server session</div>
	)
}