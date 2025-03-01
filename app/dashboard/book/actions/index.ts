"use server";

import { readUserSession } from "@/lib/actions";
import { createSupbaseAdmin, createSupbaseServerClient, createSupbaseServerClientReadOnly } from "@/lib/supabase";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function createBook(data: {
    title: string;
    description: string;
    status: "available" | "not available";
}) {
    const { data: userSession } = await readUserSession();

    // Only admins can create books
    if (userSession.session?.user.user_metadata.role !== "admin") {
        return JSON.stringify({ error: { message: "You are not allowed to do this" } });
    }

    const supabase = await createSupbaseServerClient();
    const result = await supabase.from("books").insert(data);
    revalidatePath("/dashboard/books");
    return JSON.stringify(result);
}

export async function readBooks() {
    unstable_noStore();
    const supabase = await createSupbaseServerClient();
    return await supabase.from("books").select("*");
}

export async function updateBookById(
    book_id: string,
    data: {
        title?: string;
        description?: string;
        status?: "available" | "unavailable";
    }
) {
    const { data: userSession } = await readUserSession();

    // Only admins can update books
    if (userSession.session?.user.user_metadata.role !== "admin") {
        return JSON.stringify({ error: { message: "You are not allowed to do this" } });
    }

    const supabase = await createSupbaseServerClient();
    const result = await supabase.from("books").update(data).eq("id", book_id);
    revalidatePath("/dashboard/books");
    return JSON.stringify(result);
}

export async function deleteBookById(book_id: string) {
    const { data: userSession } = await readUserSession();

    // Only admins can delete books
    if (userSession.session?.user.user_metadata.role !== "admin") {
        return JSON.stringify({ error: { message: "You are not allowed to do this" } });
    }

    const supabase = await createSupbaseServerClient();
    const result = await supabase.from("books").delete().eq("id", book_id);
    revalidatePath("/dashboard/books");
    return JSON.stringify(result);
}

export async function borrowBook(book_id: string) {
    const { data: userSession } = await readUserSession();

    if (!userSession.session?.user.id) {
        return JSON.stringify({ error: { message: "You must be logged in to select a book" } });
    }

    const member_id = userSession.session.user.id;
    console.log("Updating book with member_id:", member_id);

    const supabase = await createSupbaseServerClient();
    
    const { data: book, error: fetchError } = await supabase
        .from("books")
        .select("id, status")
        .eq("id", book_id)
        .single();

    if (fetchError) {
        console.error("Failed to fetch book:", fetchError);
        return JSON.stringify({ error: { message: "Failed to fetch book data" } });
    }

    console.log("Book before update:", book);

    if (book?.status !== "available") {
        return JSON.stringify({ error: { message: "Book is not available" } });
    }

   
    const { data, error } = await supabase
        .from("books")
        .update({ status: "unavailable", member_id })
        .eq("id", book_id)
        .eq("status", "available")
		.is("member_id", null)  
		.select(); 

    console.log("Supabase Update Result:", data, error);
    if (error) {
        console.error("Supabase Error:", error);
        return JSON.stringify({ error });
    }

    revalidatePath("/dashboard/books");
    return JSON.stringify({ data });
}

export async function returnBook(book_id: string) {
    const { data: userSession } = await readUserSession();

    if (!userSession.session?.user.id) {
        return JSON.stringify({ error: { message: "You must be logged in to select a book" } });
    }

    console.log("Returning book with ID:", book_id);

    const supabase = await createSupbaseServerClient();
    
    const { data: book, error: fetchError } = await supabase
        .from("books")
        .select("id, status")
        .eq("id", book_id)
        .single();

    if (fetchError) {
        console.error("Failed to fetch book:", fetchError);
        return JSON.stringify({ error: { message: "Failed to fetch book data" } });
    }

    console.log("Book before update:", book);

    if (book?.status !== "unavailable") {
        return JSON.stringify({ error: { message: "Book is not borrowed" } });
    }

    const { data, error } = await supabase
        .from("books")
        .update({ status: "available", member_id: null })
        .eq("id", book_id)
        .eq("status", "unavailable")
        .select(); 

    console.log("Supabase Update Result:", data, error);
    if (error) {
        console.error("Supabase Error:", error);
        return JSON.stringify({ error });
    }

    revalidatePath("/dashboard/books");
    return JSON.stringify({ data });
}

export async function fetchUserBooks() {
    const { data: userSession } = await readUserSession();
    const user_id = userSession?.session?.user?.id;

    if (!user_id) {
        return { error: "User not logged in", books: [] };
    }

    const supabase = await createSupbaseServerClient();
    const { data: books, error } = await supabase
        .from("books")
        .select("*")
        .eq("member_id", user_id);

    if (error) {
        console.error("Error fetching books:", error);
        return { error: error.message, books: [] };
    }

    return { books };
}

