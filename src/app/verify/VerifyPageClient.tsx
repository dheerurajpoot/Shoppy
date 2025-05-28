"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyPageClient() {
	const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";

	const handleCodeChange = (index: number, value: string) => {
		if (value.length <= 1) {
			const newCode = [...code];
			newCode[index] = value;
			setCode(newCode);

			// Auto-focus next input
			if (value && index < 7) {
				const nextInput = document.getElementById(`code-${index + 1}`);
				nextInput?.focus();
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const verificationCode = code.join("");

		if (verificationCode.length !== 8) {
			setError("Please enter all 8 digits");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const response = await axios.post("/api/auth/verify", {
				email,
				code: verificationCode,
			});

			const data = await response.data;

			if (response.status === 200) {
				router.push("/login");
				toast.success(response.data.message);
			} else {
				setError(data.error || "Verification failed");
				toast.error(data.error || "Verification failed");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Verification error:", error);
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
						<h1 className='text-2xl font-semibold mb-4'>
							Verify your email
						</h1>
						<p className='text-gray-600'>
							Enter the 8 digit code you have received on your
							email
						</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label className='text-sm font-medium'>
								Enter Verification Code
							</label>
							<div className='flex gap-2 mt-2'>
								{code.map((digit, index) => (
									<input
										key={index}
										id={`code-${index}`}
										type='text'
										maxLength={1}
										value={digit}
										onChange={(e) =>
											handleCodeChange(
												index,
												e.target.value
											)
										}
										className='md:w-10 md:h-10 w-8 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
									/>
								))}
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
							{isLoading ? "VERIFYING..." : "VERIFY"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
