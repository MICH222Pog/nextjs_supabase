"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import React, { useTransition } from "react";
import { deleteBookById } from "../actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function DeleteBook({ book_id }: { book_id: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter(); 

    const onSubmit = () => {
        startTransition(async () => {
            const result = JSON.parse(await deleteBookById(book_id));

            if (result?.error?.message) {
                toast({
                    title: "Failed to delete book",
                    description: result.error.message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Successfully deleted book",
                });

                router.refresh();
            }
        });
    };

    return (
        <form action={onSubmit}>
            <Button variant="outline" disabled={isPending}>
                <TrashIcon />
                {isPending ? "Deleting..." : "Delete"}
            </Button>
        </form>
    );
}
