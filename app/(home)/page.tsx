"use client";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Box, Typography } from "@mui/material";

export default function SignIn() {
	const [isPending, startTransition] = useTransition();
	const onSubmit = async () => {
		startTransition(async () => {
			await login();
		});
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'black', px: 2 }}>
			<Box sx={{ backgroundColor: '#1F2937', boxShadow: 3, border: '1px solid #374151', borderRadius: 2, p: 4, textAlign: 'center', width: '90%', maxWidth: 400, color: 'white' }}>
				<Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, wordWrap: 'break-word' }}>
					Welcome to Daily Books
				</Typography>
				<Typography sx={{ mb: 2, wordWrap: 'break-word' }}>Please login to start using the app.</Typography>
				<form action={onSubmit}>
					<Button
						className="w-full flex items-center gap-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
						variant="outline"
					>
						Sign In
						<AiOutlineLoading3Quarters
							className={cn("animate-spin", { hidden: !isPending })}
						/>
					</Button>
				</form>
			</Box>
		</Box>
	);
}