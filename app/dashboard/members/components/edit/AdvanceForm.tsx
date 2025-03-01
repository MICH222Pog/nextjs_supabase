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
	FormDescription,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { IPermission } from "@/lib/types";
import { updateMemberAdvanceById } from "../../actions";
import { useTransition } from "react";

const FormSchema = z.object({
	role: z.enum(["admin", "user"]),
	status: z.enum(["active", "resigned"]),
});

export default function AdvanceForm({ permission }: { permission: IPermission }) {
	const [isPending, startTransition] = useTransition();

	const roles = ["admin", "user"];
	const statuses = ["active", "resigned"];

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			role: permission.role,
			status: permission.status,
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		startTransition(async () => {
			const { error } = JSON.parse(await updateMemberAdvanceById(permission.id, permission.member_id, data));

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
				toast({ title: "Successfully updated" });
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full h-[56px] border border-gray-600 rounded-md bg-transparent text-white">
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
								</FormControl>
								<SelectContent className="text-base">
									{roles.map((role) => (
										<SelectItem key={role} value={role} className="text-base">
											{role}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField 
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full h-[56px] border border-gray-600 rounded-md bg-transparent !text-base" >
										<SelectValue placeholder="Select user status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent className="text-base">
									{statuses.map((status) => (
										<SelectItem key={status} value={status} className="text-base">
											{status}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>Status "resigned" means the user no longer works here.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="flex gap-2 items-center w-full" variant="outline" disabled={isPending}>
					{isPending && <AiOutlineLoading3Quarters className="animate-spin" />}
					Update
				</Button>
			</form>
		</Form>
	);
}
