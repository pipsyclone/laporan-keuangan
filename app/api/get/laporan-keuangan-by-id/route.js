import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const reportid = searchParams.get("reportid");

		const data = await prisma.reports.findFirst({
			where: { reportid: reportid },
		});

		return NextResponse.json({ status: 200, message: "OK", data });
	} catch (err) {
		console.error("PRISMA ERROR:", err);
		return NextResponse.json({
			status: 500,
			message: "Unknown Error: " + err.message,
		});
	}
}
