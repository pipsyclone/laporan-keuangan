import AddingIncomeComponents from "@/components/adding-income";

export async function generateMetadata() {
	return {
		title: "Tambah Uang Pemasukkan",
		description: "Formulir untuk menambahkan data uang pemasukkan ke sistem.",
	};
}

export default function Page() {
	return <AddingIncomeComponents />;
}
