import React from "react";
import DailogForm from "./DialogForm";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import BookForm from "./BookForm";

export default function EditBook({ book }: { book: { id: string; title: string; status: string; description: string } }) {
	return (
		<DailogForm
			id={`update-trigger-${book.id}`}
			title="Edit Book"
			Trigger={
				<Button variant="outline">
					<Pencil1Icon />
					Edit
				</Button>
			}
			form={<BookForm isEdit={true} book={book} />}
		/>
	);
}
