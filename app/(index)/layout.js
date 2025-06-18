import RootLayout from "@/components/root-layout";
import AuthProvider from "@/context/AuthProvider";

export default function Layout({ children }) {
	return (
		<AuthProvider>
			<html lang="id">
				<body>
					<RootLayout>{children}</RootLayout>
				</body>
			</html>
		</AuthProvider>
	);
}
