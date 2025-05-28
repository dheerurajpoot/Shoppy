import { type NextRequest, NextResponse } from "next/server";
import { generateVerificationCode } from "@/lib/utils";
import { connectDb } from "@/lib/db";
import { User } from "@/models/user";
import { sendMail } from "@/lib/mails";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
	try {
		await connectDb();
		const { name, email, password } = await request.json();

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 }
			);
		}

		// Create new user
		const verificationCode = generateVerificationCode();

		// hash password
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			isVerified: false,
			verificationCode,
		});

		await sendMail({ email, userId: newUser._id, verificationCode });

		return NextResponse.json({
			success: true,
			message: "Verification otp sent successfully",
			email: email,
		});
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
