import UpdateReportComponent from "@/components/update-report";

export async function generateMetadata() {
	return {
		title: "Ubah Laporan Keuangan",
		description: "Formulir untuk menambahkan data uang pemasukkan ke sistem.",
	};
}

export default function Page() {
	return <UpdateReportComponent />;
}
