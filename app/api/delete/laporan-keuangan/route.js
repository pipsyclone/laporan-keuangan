import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request) {
	try {
		// Gunakan URL native
		const id = request.nextUrl.searchParams.get("reportid");

		if (!id) {
			return NextResponse.json({ status: 400, message: "ID tidak valid" });
		}

		await prisma.reports.delete({ where: { reportid: id } });

		return NextResponse.json({
			status: 200,
			message: "Berhasil menghapus data!",
			id,
		});
	} catch (err) {
		return NextResponse.json({
			status: 500,
			message: "Unknown error : " + err,
		});
	}
}
