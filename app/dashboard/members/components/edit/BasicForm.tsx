"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { IPermission } from "@/lib/types";
import { updateMemberBasicById } from "../../actions";
import { useTransition } from "react";

// MUI Imports
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

const FormSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
});

export default function BasicForm({ permission }: { permission: IPermission }) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: permission.members.name,
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		startTransition(async () => {
			const { error } = JSON.parse(await updateMemberBasicById(permission.member_id, data));

			if (error?.message) {
				toast({
					title: "Failed to update",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
							<code className="text-white">{error?.message}</code>
						</pre>
					),
				});
			} else {
				toast({
					title: "Successfully updated",
				});
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Display Name</FormLabel>
							<FormControl>
								<TextField
									{...field}
									placeholder="shadcn"
									variant="outlined"
									fullWidth
									InputProps={{
										className: "border border-gray-600 rounded-md bg-transparent text-white",
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="flex gap-2 items-center w-full border border-gray-600 hover:border-white"
					variant="outline"
					disabled={isPending}
				>
					{isPending ? <CircularProgress size={20} color="inherit" /> : "Update"}
				</Button>
			</form>
		</Form>
	);
}
