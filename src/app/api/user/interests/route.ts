import { type NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/utils";

export async function GET(request: NextRequest) {
	const user = await getUserFromToken(request);

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({
		selectedCategories: user.selectedCategories,
	});
}
