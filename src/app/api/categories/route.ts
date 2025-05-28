import { type NextRequest, NextResponse } from "next/server";
import { categories, getUserFromToken } from "@/lib/utils";

export async function GET(request: NextRequest) {
	const user = await getUserFromToken(request);

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const page = Number.parseInt(
		request.nextUrl.searchParams.get("page") || "1"
	);
	const limit = 6;
	const offset = (page - 1) * limit;

	const paginatedCategories = categories.slice(offset, offset + limit);
	const totalPages = Math.ceil(categories.length / limit);

	return NextResponse.json({
		categories: paginatedCategories,
		currentPage: page,
		totalPages,
		total: categories.length,
	});
}

export async function POST(request: NextRequest) {
	const user = await getUserFromToken(request);

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { selectedCategories } = await request.json();
	user.selectedCategories = selectedCategories;

	await user.save();

	return NextResponse.json({ success: true });
}
