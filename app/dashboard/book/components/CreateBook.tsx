import { Button } from "@/components/ui/button";
import React from "react";
import DailogForm from "./DialogForm";
import BookForm from "./BookForm";

export default function CreateBook() {
	return (
		<DailogForm
			id="create-trigger"
			title="Add Book"
			Trigger={
				<Button variant="outline" size="lg" className="px-6 py-3 text-lg">
					Add
				</Button>
			}
			form={<BookForm isEdit={false} />}
		/>
	);
}

