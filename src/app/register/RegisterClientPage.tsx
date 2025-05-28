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

export default function RegisterClientPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await axios.post("/api/auth/register", {
				name,
				email,
				password,
			});

			const data = await response.data;

			if (response.status === 200) {
				toast.success(data.message);
				router.push(`/verify?email=${encodeURIComponent(email)}`);
			} else {
				setError(data.error || "Registration failed");
				toast.error(data.error || "Registration failed");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Registration error:", error);
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
						<h1 className='text-2xl font-semibold'>
							Create your account
						</h1>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<Label
								htmlFor='name'
								className='text-sm font-medium'>
								Name
							</Label>
							<Input
								id='name'
								type='text'
								placeholder='Enter your name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className='mt-1'
							/>
						</div>

						<div>
							<Label
								htmlFor='email'
								className='text-sm font-medium'>
								Email
							</Label>
							<Input
								id='email'
								type='email'
								placeholder='Enter your email'
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
							<Input
								id='password'
								type='password'
								placeholder='Enter your password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className='mt-1'
							/>
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
							{isLoading
								? "CREATING ACCOUNT..."
								: "CREATE ACCOUNT"}
						</Button>
					</form>

					<div className='text-center mt-6'>
						<span className='text-gray-600'>Have an Account? </span>
						<Link
							href='/login'
							className='font-semibold hover:underline'>
							LOGIN
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
