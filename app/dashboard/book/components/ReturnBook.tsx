"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { returnBook } from "../actions";

export default function ReturnBook({ book_id }: { book_id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleSelect = () => {
        startTransition(async () => {
            const result = JSON.parse(await returnBook(book_id));
            
            if (result?.error?.message) {
                toast({
                    title: "Failed to return book",
                    description: result.error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Book returned successfully",
                });
            }
        });
    };

    return (
        <Button onClick={handleSelect} disabled={isPending} variant="outline">
            {isPending ? "Returning..." : "Return Book"}
        </Button>
    );
}