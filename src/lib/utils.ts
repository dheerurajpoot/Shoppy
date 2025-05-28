import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { faker } from "@faker-js/faker";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { connectDb } from "./db";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface Category {
	id: string;
	name: string;
	description: string;
	icon: string;
}

// Generate 100 categories using faker.js
export const categories: Category[] = Array.from({ length: 100 }, (_, i) => {
	faker.seed(i + 1);
	return {
		id: `cat-${i + 1}`,
		name: faker.commerce.department(),
		description: faker.commerce.productDescription(),
		icon: faker.helpers.arrayElement([
			"👕",
			"👗",
			"👠",
			"👜",
			"💄",
			"💍",
			"📱",
			"💻",
			"🎮",
			"📚",
			"🏠",
			"🚗",
			"⚽",
			"🎵",
			"🎬",
			"🍔",
			"☕",
			"🌿",
			"🧸",
			"✈️",
		]),
	};
});

export function generateVerificationCode(): string {
	return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export async function getUserFromToken(request: NextRequest) {
	await connectDb();
	const token = request.cookies.get("auth-token")?.value;
	if (!token) {
		return NextResponse.json({
			success: false,
			message: "No token found",
		});
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
		userId: string;
	};
	const user = await User.findById(decoded.userId).select("-password");
	if (!user) {
		return NextResponse.json({
			success: false,
			message: "User not found",
		});
	}

	return user;
}
