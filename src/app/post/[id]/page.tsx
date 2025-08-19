import { HistoryFeed, PostFeed } from "@/components/feed";
import { Header } from "@/components/header";

export default async function Home(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;

	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header />
			<PostFeed id={params.id} />
		</div>
	);
}