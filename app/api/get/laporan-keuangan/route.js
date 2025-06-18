import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await prisma.reports.findMany();
		return NextResponse.json({ status: 200, message: "OK", data });
	} catch (err) {
		console.error("PRISMA ERROR:", err);
		return NextResponse.json({
			status: 500,
			message: "Unknown Error: " + err.message,
		});
	}
}
