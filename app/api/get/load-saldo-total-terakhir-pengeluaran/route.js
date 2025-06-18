import dayjs from "dayjs";
import prisma from "@/libs/prisma";

export async function GET(request) {
	const { searchParams } = new URL(request.url);

	// Ambil dari query jika ada, atau gunakan hari ini
	const now = dayjs();
	const bulan = parseInt(searchParams.get("bulan")) || now.month() + 1; // bulan: 1-12
	const tahun = parseInt(searchParams.get("tahun")) || now.year();

	// Validasi akhir (pastikan nilai masuk akal)
	if (bulan < 1 || bulan > 12 || tahun < 2000 || tahun > 3000) {
		return Response.json({
			status: 400,
			message: "Parameter bulan/tahun tidak valid.",
		});
	}

	// Awal dan akhir bulan
	const awalBulan = dayjs(`${tahun}-${bulan}-01`).startOf("month").toDate();
	const akhirBulan = dayjs(`${tahun}-${bulan}-01`).endOf("month").toDate();

	try {
		const tertinggi = await prisma.reports.findFirst({
			where: {
				tipe: "PENGELUARAN",
				tanggal: {
					gte: awalBulan,
					lte: akhirBulan,
				},
			},
			orderBy: {
				total: "desc", // ambil nilai tertinggi
			},
			select: {
				total: true,
			},
		});

		return Response.json({
			saldo_tertinggi: tertinggi?.total ?? 0,
			status: 200,
			bulan,
			tahun,
		});
	} catch (err) {
		return Response.json({
			status: 500,
			message: "Gagal mengambil saldo tertinggi: " + err.message,
		});
	}
}
