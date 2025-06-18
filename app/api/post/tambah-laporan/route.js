import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		const formData = await request.formData();
		const userid = formData.get("userid");
		const keterangan = formData.get("keterangan");
		const jumlah = parseInt(formData.get("jumlah"));
		const saldo = parseInt(formData.get("saldo"));
		const total = parseInt(formData.get("total"));
		const catatan = formData.get("catatan");
		const tanggal = new Date(formData.get("tanggal"));
		const tipe = formData.get("tipe");

		await prisma.Reports.create({
			data: {
				userid,
				keterangan,
				jumlah,
				saldo,
				total,
				catatan,
				tanggal,
				tipe,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "Berhasil Menambahkan " + tipe + "!",
		});
	} catch (err) {
		console.error("PRISMA ERROR:", err);
		return NextResponse.json({
			status: 500,
			message: "Unknown Error: " + err.message,
		});
	}
}
