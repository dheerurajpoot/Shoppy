import { NextResponse } from "next/server";

export const revalidate = 0;
export async function GET() {
	try {
		const response = new NextResponse();
		response.cookies.set("auth-token", "", {
			httpOnly: true,
			expires: new Date(0),
			path: "/",
		});

		return response;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(error);
			return NextResponse.json(
				{ message: error.message },
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
