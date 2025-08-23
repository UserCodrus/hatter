import { ResetAliasButton } from "@/components/buttons";
import { HistoryFeed } from "@/components/feed";
import { Header } from "@/components/header";
import { getAlias } from "@/lib/db";

export default async function Home() {
	const alias = await getAlias();
	console.log(`Alias: ${alias?.name}`)
	
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header />
			<ResetAliasButton />
			{alias && <HistoryFeed id={alias.id} label="My Posts" />}
		</div>
	);
}