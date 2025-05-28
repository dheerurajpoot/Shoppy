import { type NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import { connectDb } from "@/lib/db";

export async function POST(request: NextRequest) {
	try {
		await connectDb();
		const { email, code } = await request.json();

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		if (code.length === 8) {
			if (user.verificationCode !== code) {
				return NextResponse.json(
					{ error: "Invalid verification code" },
					{ status: 400 }
				);
			}
			user.isVerified = true;
			user.verificationCode = undefined;
			await user.save();

			const response = NextResponse.json({
				success: true,
				message: "User verified successfully",
			});

			return response;
		}

		return NextResponse.json(
			{ error: "Invalid verification code" },
			{ status: 400 }
		);
	} catch (error) {
		console.error("Verification error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
