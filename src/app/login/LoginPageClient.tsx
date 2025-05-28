"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPageClient() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await axios.post("/api/auth/login", {
				email,
				password,
			});

			const data = await response.data;

			if (response.status === 200) {
				localStorage.setItem("user", JSON.stringify(data.user));
				router.push("/");
				toast.success(response.data.message);
			} else {
				setError(data.error || "Login failed");
				toast.error(data.error || "Login failed");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Login error:", error);
				setError("An error occurred. Please try again.");
				toast.error(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center items-center py-16'>
				<div className='bg-white rounded-lg border p-8 w-full max-w-md'>
					<div className='text-center mb-8'>
						<h1 className='text-2xl font-semibold mb-2'>Login</h1>
						<p className='text-lg font-medium'>
							Welcome back to ECOMMERCE
						</p>
						<p className='text-gray-600 text-sm'>
							The next gen business marketplace
						</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<Label
								htmlFor='email'
								className='text-sm font-medium'>
								Email
							</Label>
							<Input
								id='email'
								type='email'
								placeholder='Enter'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className='mt-1'
							/>
						</div>

						<div>
							<Label
								htmlFor='password'
								className='text-sm font-medium'>
								Password
							</Label>
							<div className='relative mt-1'>
								<Input
									id='password'
									type={showPassword ? "text" : "password"}
									placeholder='Enter'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
								<button
									type='button'
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600'>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{error && (
							<div className='text-red-600 text-sm text-center'>
								{error}
							</div>
						)}

						<Button
							type='submit'
							disabled={isLoading}
							className='w-full bg-black hover:bg-gray-800 text-white py-3'>
							{isLoading ? "LOGGING IN..." : "LOGIN"}
						</Button>
					</form>

					<div className='text-center mt-6'>
						<span className='text-gray-600'>
							Don't have an Account?{" "}
						</span>
						<Link
							href='/register'
							className='font-semibold hover:underline'>
							SIGN UP
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
