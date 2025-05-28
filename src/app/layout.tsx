import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "ECOMMERCE - The Next Gen Business Marketplace",
		template: "%s | ECOMMERCE",
	},
	description:
		"Discover amazing products and mark your interests in our next-generation business marketplace. Join thousands of users exploring categories from fashion to electronics.",
	keywords: [
		"ecommerce",
		"marketplace",
		"shopping",
		"business",
		"categories",
		"interests",
	],
	authors: [{ name: "ECOMMERCE Team" }],
	creator: "ECOMMERCE",
	publisher: "ECOMMERCE",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link rel='canonical' href='https://ecommerce.dheeru.org' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<meta name='theme-color' content='#000000' />
			</head>
			<body className={inter.className} suppressHydrationWarning>
				<Header />
				<Toaster />
				<main>{children}</main>
			</body>
		</html>
	);
}
