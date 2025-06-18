"use client";
import "./../../components/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function RootLayout({ children }) {
	return (
		<html lang="id">
			<body>{children}</body>
		</html>
	);
}
