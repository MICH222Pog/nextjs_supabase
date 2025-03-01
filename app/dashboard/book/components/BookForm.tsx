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
import { Checkbox } from "@/components/ui/checkbox";
import { createBook, updateBookById } from "../actions";
import { useTransition, useEffect } from "react";
import TextField from "@mui/material/TextField";

const FormSchema = z.object({
	title: z.string().min(2, { message: "Title must be at least 2 characters." }),
	description: z.string().min(10, { message: "Description must be at least 10 characters." }),
	completed: z.boolean(),
});

export default function BookForm({
	isEdit,
	book,
}: {
	isEdit: boolean;
	book?: { id: string; title: string; description: string; status: string };
}) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: book?.title || "",
			description: book?.description || "",
			completed: book?.status === "available",
		},
	});

	useEffect(() => {
		if (book) {
			form.reset({
				title: book.title,
				description: book.description,
				completed: book.status === "available",
			});
		}
	}, [book, form]);

	const handleCreateBook = async (data: z.infer<typeof FormSchema>) => {
		await createBook({
			title: data.title,
			description: data.description,
			status: data.completed ? "available" : "not available",
		});
		toast({ title: "Book Created!" });
	};

	const handleUpdateBook = async (data: z.infer<typeof FormSchema>) => {
		if (!book?.id) {
			toast({
				title: "Error",
				description: "Book ID is required for updating.",
				variant: "destructive",
			});
			return;
		}

		await updateBookById(book.id, {
			title: data.title,
			description: data.description,
			status: data.completed ? "available" : "unavailable",
		});
		toast({ title: "Book Updated!" });
	};

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		if (isEdit) {
			await handleUpdateBook(data);
		} else {
			await handleCreateBook(data);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<TextField
									{...field}
									type="text"
									placeholder="Enter book title"
									variant="outlined"
									className="w-full bg-transparent text-white"
									InputProps={{
										className: "h-[40px] border border-gray-600 rounded-md px-3 text-white",
										style: { color: "white" },
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<TextField
									{...field}
									type="text"
									placeholder="Enter book description"
									variant="outlined"
									className="w-full bg-transparent text-white"
									InputProps={{
										className: "h-[40px] border border-gray-600 rounded-md px-3 text-white",
										style: { color: "white" },
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="completed"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex items-center space-x-3 border border-gray-600 rounded-md p-4">
									<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									<FormLabel className="text-white">Available</FormLabel>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" variant="outline">
					{isEdit ? "Update Book" : "Add Book"}
				</Button>
			</form>
		</Form>
	);
}
