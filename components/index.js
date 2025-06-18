"use client";
import "./../components/globals.css";

export default function IndexComponent() {
	return (
		<div className="left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] fixed text-center">
			<h1>Selamat Datang di Aplikasi Laporan Keuangan KAS PMRT Motorpart</h1>
			<button
				onClick={() => (window.location.href = "/dashboard")}
				className="bg-blue-500 hover:bg-blue-600 transition-all rounded p-3 text-white cursor-pointer mt-3"
			>
				Dashboard
			</button>
		</div>
	);
}
