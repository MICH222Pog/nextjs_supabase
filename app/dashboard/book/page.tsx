import React from "react";
import BookTable from "./components/BookTable";
import Searchbook from "./components/SearchBook";
import CreateBook from "./components/CreateBook";
import { useUserStore } from "@/lib/store/user";

export default function Todo() {

	const user = useUserStore.getState().user;
	
	const isAdmin = user?.user_metadata.role === "admin"
	

	return (
		<div className="space-y-5 w-full overflow-y-auto px-3">
			<h1 className="text-3xl font-bold">BookList</h1>
			{isAdmin && (
				<div className="flex gap-2">
					<Searchbook />
					<CreateBook />
				</div>
				)}
			
			<BookTable />
		</div>
	);
}
