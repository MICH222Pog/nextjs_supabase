import React from "react";
import ListOfBook from "./ListOfBook";
import Table from "@/components/ui/Table";

export default function BookTable() {
	const tableHeader = ["Title", "Description", "Status", "Created at"];

	return (
		<Table headers={tableHeader}>
			<ListOfBook />
		</Table>
	);
}
