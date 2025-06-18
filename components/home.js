"use client";
import axios from "axios";
import { useRef, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast, Bounce } from "react-toastify";

export default function HomeComponent() {
	const [data, setData] = useState([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [filterTipe, setFilterTipe] = useState("ALL");
	const [filterRange, setFilterRange] = useState("BULAN"); // default filter untuk chart
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});
	const chartRef = useRef(null);
	const [tipeChart, setTipeChart] = useState("bar");

	const formatTanggal = (rowData) => {
		return dayjs(rowData?.tanggal).locale("id").format("D MMMM YYYY");
	};

	const formatRupiah = (rowData) => {
		return rowData?.saldo?.toLocaleString("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		});
	};
	const formatRupiahTotal = (rowData) => {
		return rowData.total.toLocaleString("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		});
	};

	const loadData = async () => {
		try {
			const res = await axios.get("/api/get/laporan-keuangan");

			// Urutkan berdasarkan tanggal ASCENDING (lama ke baru)
			const sorted = res.data.data.sort(
				(a, b) => dayjs(a.tanggal).unix() - dayjs(b.tanggal).unix()
			);

			setData(sorted);
			prepareChartData(sorted, filterRange);
		} catch (err) {
			console.error("Gagal memuat data:", err);
		}
	};

	const handleDelete = async (reportid) => {
		await axios
			.delete(`/api/delete/laporan-keuangan?reportid=${reportid}`)
			.then((res) => {
				loadData();
				toast.success("Berhasil hapus data!", {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: false,
					pauseOnHover: true,
					draggable: false,
					progress: undefined,
					theme: "light",
					transition: Bounce,
				});
			})
			.catch((err) => {
				console.error("Gagal menghapus data:", err);
			});
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		prepareChartData(data, filterRange);
	}, [filterRange]);

	const tipeOptions = [
		{ label: "Semua", value: "ALL" },
		{ label: "PEMASUKKAN", value: "PEMASUKKAN" },
		{ label: "PENGELUARAN", value: "PENGELUARAN" },
	];

	const filterRangeOptions = [
		{ label: "Per Minggu", value: "MINGGU" },
		{ label: "Per Bulan", value: "BULAN" },
		{ label: "Per Tahun", value: "TAHUN" },
	];

	const filteredData = data?.filter((item) => {
		const matchSearch = Object.values(item)
			.join(" ")
			.toLowerCase()
			.includes(globalFilter.toLowerCase());

		const matchTipe = filterTipe === "ALL" || item.tipe === filterTipe;

		return matchSearch && matchTipe;
	});

	const tipeTemplate = (rowData) => (
		<span
			className={`font-bold px-2 py-1 rounded ${
				rowData.tipe === "PENGELUARAN"
					? "bg-red-100 text-red-600"
					: "bg-green-100 text-green-700"
			}`}
		>
			{rowData.tipe}
		</span>
	);

	const actionTemplate = (rowData) => (
		<div className="flex gap-3">
			<Button
				icon="fa-solid fa-pen"
				className="p-button-primary p-button-sm flex-1"
				onClick={() =>
					(window.location.href = "/dashboard/edit-laporan/" + rowData.reportid)
				}
				label="Edit"
			/>
			<Button
				icon="fa-solid fa-trash"
				className="p-button-danger p-button-sm flex-1"
				onClick={() => handleDelete(rowData.reportid)}
				label="Hapus"
			/>
		</div>
	);

	const prepareChartData = (dataArray, range) => {
		const grouped = {};

		dataArray?.forEach((item) => {
			const date = dayjs(item.tanggal);
			let key;

			if (range === "MINGGU") {
				const week = date.isoWeek();
				key = `${date.year()}-Minggu ${week}`;
			} else if (range === "BULAN") {
				key = date.format("MMMM YYYY");
			} else if (range === "TAHUN") {
				key = date.format("YYYY");
			}

			if (!grouped[key]) {
				grouped[key] = { PEMASUKKAN: 0, PENGELUARAN: 0 };
			}

			if (item.jumlah === 0) {
				// Ambil bulan & tahun dari item
				const bulan = date.month(); // 0-indexed
				const tahun = date.year();

				// Filter item lain di bulan dan tahun yang sama serta tipe yang sama
				const sameMonthItems = dataArray.filter((i) => {
					const d = dayjs(i.tanggal);
					return (
						i.tipe === item.tipe && d.month() === bulan && d.year() === tahun
					);
				});

				// Ambil nilai total tertinggi
				const maxTotal = Math.max(...sameMonthItems.map((i) => i.total ?? 0));

				grouped[key][item.tipe] = maxTotal;
			} else {
				grouped[key][item.tipe] += item.jumlah * item.saldo;
			}
		});

		const labels = Object.keys(grouped).sort((a, b) => {
			if (range === "MINGGU") {
				const parseWeek = (label) => {
					if (!label) return dayjs(0); // fallback
					const parts = label.split("-");
					if (parts.length < 2) return dayjs(0);
					const year = Number(parts[0]);
					const weekPart = parts[1];
					const weekMatch = weekPart.match(/Minggu (\d+)/);
					if (!weekMatch) return dayjs(0);
					const week = Number(weekMatch[1]);
					return dayjs().year(year).isoWeek(week).startOf("isoWeek");
				};

				const dateA = parseWeek(a);
				const dateB = parseWeek(b);

				return dateA - dateB;
			} else if (range === "BULAN") {
				return dayjs(a, "MMMM YYYY").toDate() - dayjs(b, "MMMM YYYY").toDate();
			} else if (range === "TAHUN") {
				return Number(a) - Number(b);
			}
			return 0;
		});

		const pemasukkan = labels.map((label) => grouped[label].PEMASUKKAN || 0);
		const pengeluaran = labels.map((label) => grouped[label].PENGELUARAN || 0);

		setChartData({
			labels,
			datasets: [
				{
					label: "Pemasukkan",
					backgroundColor: "#4ade80",
					data: pemasukkan,
				},
				{
					label: "Pengeluaran",
					backgroundColor: "#f87171",
					data: pengeluaran,
				},
			],
		});

		setChartOptions({
			maintainAspectRatio: false,
			responsive: true,
			plugins: {
				legend: { position: "top" },
				tooltip: {
					callbacks: {
						label: (context) => `Rp${context.raw.toLocaleString("id-ID")}`,
					},
				},
			},
			scales: {
				y: {
					ticks: {
						callback: (value) => `Rp${value.toLocaleString("id-ID")}`,
					},
				},
			},
		});
	};

	const exportChartAsImage = () => {
		if (!chartRef.current) return;

		const chartInstance = chartRef.current.getChart(); // ⬅️ gunakan getChart()
		if (!chartInstance) return;

		const base64Image = chartInstance.toBase64Image(); // PNG by default
		const link = document.createElement("a");
		link.href = base64Image;
		link.download = `chart-${dayjs().format("YYYYMMDD-HHmmss")}.png`;
		link.click();
	};

	const exportToExcel = async () => {
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Laporan");

		// Header
		worksheet.columns = [
			{ header: "Keterangan", key: "keterangan", width: 25 },
			{ header: "Jumlah Barang", key: "jumlah", width: 15 },
			{ header: "Saldo", key: "saldo", width: 20 },
			{ header: "Saldo Total", key: "total", width: 20 },
			{ header: "Catatan", key: "catatan", width: 30 },
			{ header: "Tanggal", key: "tanggal", width: 18 },
			{ header: "Tipe", key: "tipe", width: 15 },
		];

		// Data
		filteredData.forEach((item) => {
			worksheet.addRow({
				keterangan: item.keterangan,
				jumlah: item.jumlah,
				saldo: item.saldo,
				total: item.total,
				catatan: item.catatan,
				tanggal: dayjs(item.tanggal).format("DD/MM/YYYY"),
				tipe: item.tipe,
			});
		});

		// Format kolom saldo
		["C", "D"].forEach((col) => {
			worksheet.getColumn(col).numFmt = '"Rp"#,##0;[Red]-"Rp"#,##0';
		});

		// Export ke file
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		saveAs(blob, `Laporan-Keuangan-${dayjs().format("YYYYMMDD-HHmmss")}.xlsx`);
	};

	return (
		<>
			<div className="card flex flex-col gap-3 w-full">
				<h2 className="text-xl font-bold">Grafik Keuangan</h2>
				<hr />
				<div className="flex gap-3">
					<Button
						label="Export Gambar"
						icon="pi pi-image"
						className="p-button-primary"
						onClick={exportChartAsImage}
					/>

					<select
						className="form-input ms-auto"
						value={tipeChart}
						onChange={(e) => setTipeChart(e.target.value)}
					>
						<option value={"bar"}>Bar Chart</option>
						<option value={"line"}>Line Chart</option>
						<option value={"pie"}>Pie Chart</option>
					</select>

					<Dropdown
						value={filterRange}
						options={filterRangeOptions}
						onChange={(e) => setFilterRange(e.value)}
						placeholder="Filter Waktu Chart"
						className="w-64"
					/>
				</div>
				<div className="card" style={{ height: "80vh", width: "100%" }}>
					<Chart
						ref={chartRef}
						type={tipeChart}
						data={chartData}
						options={chartOptions}
						style={{ width: "100%", height: "100%" }}
					/>
				</div>
			</div>
			<div className="card flex flex-col gap-3 mt-6">
				<h2 className="text-xl font-bold">Laporan Keuangan</h2>
				<hr />
				<div className="flex flex-col md:flex-row gap-4">
					<InputText
						placeholder="Cari data..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="w-full md:w-1/3"
					/>
					<Dropdown
						value={filterTipe}
						options={tipeOptions}
						onChange={(e) => setFilterTipe(e.value)}
						placeholder="Filter Tipe"
						className="w-full md:w-1/3"
					/>
					<button
						type="button"
						className="bg-green-500 hover:bg-green-700 cursor-pointer rounded p-2 text-white ms-auto"
						title="Export to Excel"
						onClick={exportToExcel}
					>
						<i className="fa-solid fa-file-excel me-3"></i>
						Export Excel
					</button>
				</div>

				<DataTable
					value={filteredData}
					paginator
					rows={5}
					rowsPerPageOptions={[5, 10, 20]}
					style={{ width: "100%" }}
				>
					<Column field="keterangan" header="Keterangan" />
					<Column field="jumlah" header="Jumlah Barang" />
					<Column field="saldo" header="Saldo" body={formatRupiah} />
					<Column field="total" header="Saldo Total" body={formatRupiahTotal} />
					<Column field="catatan" header="Catatan" />
					<Column field="tanggal" header="Tanggal" body={formatTanggal} />
					<Column field="tipe" header="Tipe" body={tipeTemplate} />
					<Column
						header="Aksi"
						body={actionTemplate}
						style={{ width: "120px" }}
					/>
				</DataTable>
			</div>
		</>
	);
}
