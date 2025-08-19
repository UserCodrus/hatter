import { HistoryFeed } from "@/components/feed";
import { Header } from "@/components/header";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header />
			<HistoryFeed label="My Posts" />
		</div>
	);
}