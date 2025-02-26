"use client";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SignIn() {
	const [isPending, startTransition] = useTransition();
	const onSubmit = async () => {
		startTransition(async () => {
			await login();
		});
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-black">
			<div className="bg-gray-800 shadow-lg border border-gray-700 rounded-lg p-6 text-center w-96 text-white">
				<h2 className="text-lg font-semibold mb-4">Welcome to Daily Books</h2>
				<p className="mb-4">Please login to start using the app.</p>
				<form action={onSubmit}>
					<Button
						className="w-full flex items-center gap-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
						variant="outline"
					>
						Sign In{" "}
						<AiOutlineLoading3Quarters
							className={cn("animate-spin", { hidden: !isPending })}
						/>
					</Button>
				</form>
			</div>
		</div>
	);
}
