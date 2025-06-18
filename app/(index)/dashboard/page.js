import HomeComponent from "@/components/home";

export async function generateMetadata() {
	return {
		title: "Welcome to Dashboard",
		description: "",
	};
}

export default function Page() {
	return <HomeComponent />;
}
