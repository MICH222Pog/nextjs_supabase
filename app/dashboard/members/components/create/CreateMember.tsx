import { Button } from "@/components/ui/button";
import React from "react";
import DailogForm from "../DialogForm";
import CreateForm from "./CreateForm";

export default function CreateMember() {
	return (
		<DailogForm
			id="create-trigger"
			title="Add Member"
			Trigger={
				<Button variant="outline" size="lg" className="px-6 py-3 text-lg">
					Add
				</Button>
			}
			form={<CreateForm />}
		/>
	);
}

