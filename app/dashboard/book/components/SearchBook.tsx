import { Input } from "@/components/ui/input";
import React from "react";

export default function SearchBook() {
	return (
		<Input
			placeholder="search by title"
			className=" border-zinc-600  focus:border-zinc-600"
		/>
	);
}
