import { type NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
	try {
		await connectDb();
		const { email, password } = await request.json();

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		if (!user.isVerified) {
			return NextResponse.json(
				{ error: "Please verify your email first" },
				{ status: 401 }
			);
		}

		// Create session
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

		const response = NextResponse.json({
			success: true,
			message: "Login successful",
			user,
		});
		response.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return response;
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
