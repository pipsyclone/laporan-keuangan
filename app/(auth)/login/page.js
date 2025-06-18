import LoginComponent from "@/components/login";

export async function generateMetadata() {
	return {
		title: "Silahkan Login",
		description: "",
	};
}

export default function Page() {
	return <LoginComponent />;
}
