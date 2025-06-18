"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function RootLayout({ children }) {
	const { data: session } = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isClient, setIsClient] = useState(false);
	const [isDesktop, setIsDesktop] = useState(true);

	useEffect(() => {
		setIsClient(true);
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 768);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (!isClient) return null;

	return (
		<>
			<ToastContainer />
			<div className="flex h-screen bg-gray-100">
				{/* Sidebar */}
				<div
					className={`transition-all duration-300 bg-zinc-900 text-white shadow-md z-30
						fixed top-0 left-0 h-full overflow-hidden
						${isDesktop ? (sidebarOpen ? "w-64" : "w-0") : sidebarOpen ? "w-64" : "w-0"}
					`}
				>
					<div className="flex items-center justify-between p-4 border-b">
						<h2 className="text-xl font-bold">Laporan KAS PMRT Motorpart</h2>
						<button
							onClick={() => setSidebarOpen(false)}
							className="ml:block md:hidden"
						>
							<X />
						</button>
					</div>
					<nav className="p-4 space-y-2">
						<a
							href="/dashboard"
							className="flex py-2 px-4 rounded hover:bg-zinc-800"
						>
							<div className="text-center w-8">
								<i className="fa-solid fa-home"></i>
							</div>
							<div>Beranda</div>
						</a>
						<a
							href="/dashboard/tambah-pemasukkan"
							className="flex py-2 px-4 rounded hover:bg-zinc-800"
						>
							<div className="text-center w-8">
								<i className="fa-solid fa-money-bill-transfer"></i>
							</div>
							<div>Pemasukkan</div>
						</a>
						<a
							href="/dashboard/tambah-pengeluaran"
							className="flex py-2 px-4 rounded hover:bg-zinc-800"
						>
							<div className="text-center w-8">
								<i className="fa-solid fa-money-bills"></i>
							</div>
							<div>Pengeluaran</div>
						</a>
						<button
							type="button"
							className="flex py-2 px-4 rounded hover:bg-zinc-800 text-red-500 w-full cursor-pointer"
							onClick={signOut}
						>
							<div className="text-center w-8">
								<i className="fa-solid fa-arrow-right-from-bracket"></i>
							</div>
							<div>Logout</div>
						</button>
					</nav>
				</div>

				{/* Overlay mobile */}
				{sidebarOpen && !isDesktop && (
					<div
						className="fixed inset-0 bg-black opacity-30 z-20"
						onClick={() => setSidebarOpen(false)}
					></div>
				)}

				{/* Main Content */}
				<div
					className={`flex-1 flex flex-col transition-all duration-300 ${
						isDesktop && sidebarOpen ? "ml-64" : ""
					}`}
				>
					{/* Top bar */}
					<div className="flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-10">
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="block"
						>
							{isDesktop ? (
								sidebarOpen ? (
									<X />
								) : (
									<Menu />
								)
							) : isClient ? (
								sidebarOpen ? (
									<X />
								) : (
									<Menu />
								)
							) : (
								<Menu />
							)}
						</button>
						<div className="flex items-center space-x-3">
							<Image
								src="/user.png"
								alt="User Profile"
								width={32}
								height={32}
								className="rounded-full"
							/>
							<small>
								<i>Hi, {session?.user?.name}</i>
							</small>
						</div>
					</div>

					{/* Page Content */}
					<main className="p-3 space-y-4 overflow-x-hidden">{children}</main>
				</div>
			</div>
		</>
	);
}
