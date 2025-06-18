"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { toast, Bounce } from "react-toastify";

export default function UpdateReportComponent() {
	const [isLoading, setIsLoading] = useState(false);
	const { lkid } = useParams();
	const route = useRouter();

	const [form, setForm] = useState({
		keterangan: "",
		jumlah: "",
		saldo: "",
		total: "",
		tanggal: dayjs().format("YYYY-MM-DD"),
		catatan: "",
		tipe: "",
	});

	const handleChange = async (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`/api/get/laporan-keuangan-by-id?lkid=${lkid}`
				);
				const data = res.data?.data;

				if (data) {
					setForm({
						keterangan: data.keterangan || "",
						jumlah: data.jumlah || "",
						saldo: data.saldo || "",
						total: data.total || "",
						tanggal: dayjs(data.tanggal).format("YYYY-MM-DD"),
						catatan: data.catatan || "",
						tipe: (data.tipe || "").toUpperCase().trim(),
					});
				}
			} catch (err) {
				console.error("Gagal memuat data:", err);
				toast.error("Data tidak ditemukan!", {
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
		};
		if (lkid) fetchData();
	}, [lkid]);

	const formData = new FormData();
	formData.append("keterangan", form.keterangan);
	formData.append("jumlah", form.jumlah || 0);
	formData.append("saldo", form.saldo || 0);
	formData.append("total", form.total || 0);
	formData.append("tanggal", form.tanggal);
	formData.append("catatan", form.catatan);
	formData.append("tipe", form.tipe);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		await axios
			.put(`/api/put/ubah-laporan?lkid=${lkid}`, formData)
			.then((res) => {
				console.log(res.data);
				toast.success("Berhasil ubah data!", {
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
				route.push("/");
			})
			.catch((error) => {
				console.error(error);
				toast.warning("Gagal ubah data!", {
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
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<>
			<div className="card flex flex-col gap-3">
				<h1 className="text-2xl font-bold">Ubah Laporan {form.tipe}</h1>
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
						{form.jumlah !== null && form.jumlah !== "" ? (
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
						) : (
							""
						)}
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
							<label>Saldo Total : </label>
							<input
								name="total"
								type="number"
								className="form-input"
								value={form.total ?? ""}
								onChange={handleChange}
								placeholder="Masukkan Total"
							/>
						</div>
						<div className="flex flex-col gap-1 flex-1">
							<label>Tipe :</label>
							<select
								name="tipe"
								className="form-input"
								value={form.tipe ?? ""}
								onChange={handleChange}
							>
								<option value={""}>- Pilih Tipe -</option>
								<option value={"PEMASUKKAN"}>PEMASUKKAN</option>
								<option value={"PENGELUARAN"}>PENGELUARAN</option>
							</select>
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
								isLoading
									? "disabled bg-blue-400 hover:bg-blue-400 cursor-none"
									: ""
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
