"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
interface Category {
	id: string;
	name: string;
	description: string;
	icon: string;
}

interface CategoriesResponse {
	categories: Category[];
	currentPage: number;
	totalPages: number;
	total: number;
}

export default function HomePage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			fetchCategories(currentPage);
			fetchUserInterests();
		}
	}, [currentPage, isAuthenticated]);

	const checkAuth = () => {
		try {
			const user = localStorage.getItem("user");
			if (user) {
				setIsAuthenticated(true);
			} else {
				router.push("/login");
			}
		} catch (error) {
			router.push("/login");
		}
	};

	const fetchCategories = async (page: number) => {
		try {
			const response = await axios.get(`/api/categories?page=${page}`);
			if (response.status === 200) {
				const data: CategoriesResponse = await response.data;
				setCategories(data.categories);
				setTotalPages(data.totalPages);
			}
		} catch (error) {
			console.error("Failed to fetch categories:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchUserInterests = async () => {
		try {
			const response = await axios.get("/api/user/interests");
			if (response.status === 200) {
				const data = await response.data;
				setSelectedCategories(data.selectedCategories);
			}
		} catch (error) {
			console.error("Failed to fetch user interests:", error);
		}
	};

	const handleCategoryToggle = async (categoryId: string) => {
		const newSelected = selectedCategories?.includes(categoryId)
			? selectedCategories.filter((id) => id !== categoryId)
			: [...selectedCategories, categoryId];

		setSelectedCategories(newSelected);

		// Save to backend
		try {
			await axios.post("/api/categories", {
				selectedCategories: newSelected,
			});
		} catch (error) {
			console.error("Failed to save interests:", error);
		}
	};

	const renderPagination = () => {
		const pages = [];
		const maxVisiblePages = 7;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 4) {
				pages.push(1, 2, 3, 4, 5, "...", totalPages);
			} else if (currentPage >= totalPages - 3) {
				pages.push(
					1,
					"...",
					totalPages - 4,
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages
				);
			} else {
				pages.push(
					1,
					"...",
					currentPage - 1,
					currentPage,
					currentPage + 1,
					"...",
					totalPages
				);
			}
		}

		return (
			<div className='flex justify-center items-center space-x-2 mt-8'>
				<Button
					variant='ghost'
					onClick={() => setCurrentPage(1)}
					disabled={currentPage === 1}
					className='px-2'>
					{"<<"}
				</Button>
				<Button
					variant='ghost'
					onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
					className='px-2'>
					{"<"}
				</Button>

				{pages.map((page, index) => (
					<Button
						key={index}
						variant={page === currentPage ? "default" : "ghost"}
						onClick={() =>
							typeof page === "number" && setCurrentPage(page)
						}
						disabled={typeof page !== "number"}
						className='px-3'>
						{page}
					</Button>
				))}

				<Button
					variant='ghost'
					onClick={() =>
						setCurrentPage(Math.min(totalPages, currentPage + 1))
					}
					disabled={currentPage === totalPages}
					className='px-2'>
					{">"}
				</Button>
				<Button
					variant='ghost'
					onClick={() => setCurrentPage(totalPages)}
					disabled={currentPage === totalPages}
					className='px-2'>
					{">>"}
				</Button>
			</div>
		);
	};

	if (!isAuthenticated || isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 flex justify-center items-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4'></div>
					<p>Loading your interests...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center items-center py-16'>
				<div className='bg-white rounded-lg border p-8 w-full max-w-md'>
					<div className='text-center mb-8'>
						<h1 className='text-2xl font-semibold mb-2'>
							Please mark your interests!
						</h1>
						<p className='text-gray-600'>
							We will keep you notified.
						</p>
					</div>

					<div className='mb-6'>
						<h2 className='text-lg font-medium mb-4'>
							My saved interests!
						</h2>
						<div className='space-y-3'>
							{categories.map((category) => (
								<div
									key={category.id}
									className='flex items-center space-x-3'>
									<Checkbox
										id={category.id}
										checked={selectedCategories?.includes(
											category.id
										)}
										onCheckedChange={() =>
											handleCategoryToggle(category.id)
										}
										className='data-[state=checked]:bg-black data-[state=checked]:border-black'
									/>
									<label
										htmlFor={category.id}
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2'>
										<span className='text-lg'>
											{category.icon}
										</span>
										<span>{category.name}</span>
									</label>
								</div>
							))}
						</div>
					</div>

					{renderPagination()}
				</div>
			</div>
		</div>
	);
}
