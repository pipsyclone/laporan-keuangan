import AddingExpenditureComponents from "@/components/adding-expenditure";

export async function generateMetadata() {
	return {
		title: "Tambah Uang Pengeluaran",
		description: "Formulir untuk menambahkan data uang pengeluaran ke sistem.",
	};
}

export default function Page() {
	return <AddingExpenditureComponents />;
}
