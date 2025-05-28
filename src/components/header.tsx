"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
	name: string;
	email: string;
}

export default function Header() {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			if (!localStorage.getItem("user")) {
				return;
			}
			const userData = JSON.parse(localStorage.getItem("user")!);
			setUser(userData);
		} catch (error: any) {
			console.error("Failed to fetch user:", error);
		}
	};
	useEffect(() => {
		fetchUser();
	}, []);

	const handleLogout = async () => {
		try {
			await axios.post("/api/auth/logout");
			localStorage.removeItem("user");
			window.location.href = "/login";
		} catch (error: any) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<header className='w-full'>
			{/* Top bar */}
			<div className='bg-white border-b px-4 py-2'>
				<div className='max-w-7xl mx-auto flex justify-between items-center text-sm'>
					<div className='flex space-x-6'>
						<Link href='/help' className='hover:text-gray-600'>
							Help
						</Link>
						<Link href='/orders' className='hover:text-gray-600'>
							Orders & Returns
						</Link>
					</div>
					<div className='flex items-center space-x-4'>
						{user ? (
							<>
								<span>Hi, {user.name}</span>
								<button
									onClick={handleLogout}
									className='text-sm hover:text-gray-600'>
									Logout
								</button>
							</>
						) : (
							<Link href='/login' className='hover:text-gray-600'>
								Login
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* Main header */}
			<div className='bg-white border-b px-4 py-4'>
				<div className='max-w-7xl mx-auto flex justify-between items-center'>
					<Link href='/' className='text-2xl font-bold'>
						ECOMMERCE
					</Link>

					<nav className='flex space-x-8'>
						<Link
							href='/categories'
							className='hover:text-gray-600'>
							Categories
						</Link>
						<Link href='/sale' className='hover:text-gray-600'>
							Sale
						</Link>
						<Link href='/clearance' className='hover:text-gray-600'>
							Clearance
						</Link>
						<Link href='/new-stock' className='hover:text-gray-600'>
							New stock
						</Link>
						<Link href='/trending' className='hover:text-gray-600'>
							Trending
						</Link>
					</nav>

					<div className='flex items-center space-x-4'>
						<Search className='w-5 h-5 cursor-pointer hover:text-gray-600' />
						<ShoppingCart className='w-5 h-5 cursor-pointer hover:text-gray-600' />
					</div>
				</div>
			</div>

			{/* Promo banner */}
			<div className='bg-gray-100 py-3'>
				<div className='max-w-7xl mx-auto text-center'>
					<span className='text-sm'>
						Get 10% off on business sign up
					</span>
				</div>
			</div>
		</header>
	);
}
