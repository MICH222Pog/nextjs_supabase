"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { borrowBook } from "../actions";

export default function BorrowBook({ book_id }: { book_id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleSelect = () => {
        startTransition(async () => {
            const result = JSON.parse(await borrowBook(book_id));
            
            if (result?.error?.message) {
                toast({
                    title: "Failed to borrow book",
                    description: result.error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Book borrowed successfully",
                });
            }
        });
    };

    return (
        <Button onClick={handleSelect} disabled={isPending} variant="outline">
            {isPending ? "Borrowing..." : "Borrow Book"}
        </Button>
    );
}