import { CreateAlias } from "@/components/forms";
import { Header } from "@/components/header";

export default function Page()
{
	return (
		<div className="flex flex-col items-center justify-items-center min-h-screen w-full">
			<Header />
			<CreateAlias />
		</div>
	);
}