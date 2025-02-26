import { Button } from "@/components/ui/button";
import React from "react";
import DailogForm from "./DialogForm";
import BookForm from "./BookForm";

export default function CreateBook() {
	return (
		<DailogForm
			id="create-trigger"
			title="Create Todo"
			Trigger={<Button variant="outline">Create+</Button>}
			form={<BookForm isEdit={false} />}
		/>
	);
}
