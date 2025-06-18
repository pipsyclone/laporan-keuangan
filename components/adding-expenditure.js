"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast, Bounce } from "react-toastify";
import { useSession } from "next-auth/react";

export default function AddingIncomeComponents() {
	const { data: session } = useSession();
	const today = dayjs().format("YYYY-MM-DD"); // "2025-06-02"
	const [isLoading, setIsLoading] = useState(false);

	const [lastTotal, setLastTotal] = useState(0);
	const [form, setForm] = useState({
		userid: "",
		keterangan: "",
		jumlah: "",
		saldo: "",
		total: "",
		tanggal: today,
		catatan: "",
		tipe: "PENGELUARAN",
	});

	const handleChange = async (e) => {
		const { name, value } = e.target;
		if (name === "tanggal") {
			const selectedDate = dayjs(value);
			const bulan = selectedDate.month() + 1;
			const tahun = selectedDate.year();
			await axios
				.get(
					`/api/get/load-saldo-total-terakhir-pengeluaran?bulan=${bulan}&tahun=${tahun}`
				)
				.then((res) => {
					console.log(res.data.saldo_tertinggi);
					setLastTotal(res.data.saldo_tertinggi);
				});
		}
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const loadLastTotal = async () => {
		const tanggal = dayjs().format("YYYY-MM-DD");
		const selectedDate = dayjs(tanggal);
		const bulan = selectedDate.month() + 1;
		const tahun = selectedDate.year();

		try {
			const res = await axios.get(
				`/api/get/load-saldo-total-terakhir-pengeluaran?bulan=${bulan}&tahun=${tahun}`
			);
			setLastTotal(res.data.saldo_tertinggi);
		} catch (err) {
			console.error("Gagal memuat saldo terakhir:", err);
			setLastTotal(0); // fallback
		}
	};

	const formData = new FormData();
	formData.append("userid", session?.user?.userid);
	formData.append("keterangan", form.keterangan);
	formData.append("jumlah", form.jumlah || 0);
	formData.append("saldo", form.saldo);
	formData.append(
		"total",
		Number(form.jumlah) === 0
			? Number(form.saldo) + Number(lastTotal)
			: Number(form.jumlah) * Number(form.saldo) + Number(lastTotal)
	);
	formData.append("tanggal", form.tanggal);
	formData.append("catatan", form.catatan);
	formData.append("tipe", form.tipe);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);

		if (
			formData.get("keterangan") === "" ||
			formData.get("jumlah") === "" ||
			formData.get("saldo") === "" ||
			formData.get("total") === "" ||
			formData.get("tanggal") === "" ||
			formData.get("catatan") === ""
		) {
			toast.warning("Masih terdapat form yang kosong!", {
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
			setIsLoading(false);
		} else {
			await axios
				.post("/api/post/tambah-laporan", formData)
				.then((res) => {
					if (res.data.status === 200) {
						toast.success(res.data.message, {
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

						setForm({
							keterangan: "",
							jumlah: 0,
							saldo: 0,
							total: formData.get("total"),
							tanggal: today,
							catatan: "",
							tipe: "PENGELUARAN",
						});
						loadLastTotal();
					} else {
						toast.warning("Cek kembali xampp anda, pastikan sudah menyala!", {
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
					}
				})
				.catch((err) => {
					console.log(err.message);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	useEffect(() => {
		loadLastTotal();
	}, []);

	return (
		<>
			<div className="card flex flex-col gap-3">
				<h1 className="text-2xl font-bold">Tambahkan Pengeluaran</h1>
				<hr />
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="flex sm:flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-1 flex-1">
							<label>Keterangan :</label>
							<input
								name="keterangan"
								className="form-input"
								value={form.keterangan ?? ""}
								onChange={handleChange}
								placeholder="Masukkan Keterangan"
							/>
						</div>
						<div className="flex flex-col gap-1 flex-1">
							<label>Tanggal :</label>
							<input
								name="tanggal"
								type="date"
								className="form-input"
								value={form.tanggal ?? ""}
								onChange={handleChange}
								placeholder="Masukkan Tanggal"
							/>
						</div>
					</div>
					<div className="flex sm:flex-col md:flex-row gap-3">
						<div className="flex flex-col gap-1 flex-1">
							<label>Jumlah :</label>
							<input
								name="jumlah"
								type="number"
								className="form-input"
								value={form.jumlah ?? ""}
								onChange={handleChange}
								placeholder="Masukkan Jumlah"
							/>
						</div>
						<div className="flex flex-col gap-1 flex-1">
							<label>Saldo :</label>
							<input
								name="saldo"
								type="number"
								className="form-input"
								value={form.saldo ?? ""}
								onChange={handleChange}
								placeholder="Masukkan Saldo"
							/>
						</div>
						<div className="flex flex-col gap-1 flex-1">
							<label>Total Saldo Terakhir Bulan Ini : </label>
							<input
								name="total"
								type="number"
								className="form-input"
								value={lastTotal ?? ""}
								readOnly
								placeholder="Saldo Total Terakhir Bulan Ini"
							/>
						</div>
					</div>
					<div className="flex flex-col gap-1 flex-1">
						<label>Catatan :</label>
						<textarea
							name="catatan"
							className="form-input"
							rows={7}
							value={form.catatan ?? ""}
							onChange={handleChange}
							placeholder="Masukkan Catatan..."
						></textarea>
					</div>
					<div className="ms-auto">
						<button
							className={`bg-blue-500 hover:bg-blue-700 transition ease-in-out text-white text-sm p-2 rounded cursor-pointer ${
								isLoading ? "disabled" : ""
							}`}
						>
							{isLoading ? (
								<>
									<i className="fa-solid fa-spinner animate-spin me-3"></i>
									Loading...
								</>
							) : (
								"Simpan"
							)}
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
