import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { faker } from "@faker-js/faker";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	isVerified: boolean;
	verificationCode?: string;
	selectedCategories: string[];
}

export interface Category {
	id: string;
	name: string;
	description: string;
	icon: string;
}

// In-memory storage (in production, use a real database)
export const users: User[] = [];
export const sessions: Map<string, string> = new Map(); // token -> userId

// Generate 100 categories using faker.js
export const categories: Category[] = Array.from({ length: 100 }, (_, i) => {
	faker.seed(i + 1); // Ensure consistent data
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

export function getUserFromToken(token: string | undefined): User | null {
	if (!token || !sessions.has(token)) {
		return null;
	}
	const userId = sessions.get(token)!;
	return users.find((u) => u.id === userId) || null;
}
