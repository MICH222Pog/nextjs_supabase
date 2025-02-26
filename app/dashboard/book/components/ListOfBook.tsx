import React from "react";
import { cn } from "@/lib/utils";
import { readBooks } from "../actions";
import { IBook } from "@/lib/types";
import DeleteBook from "./DeleteBook";
import EditBook from "./EditBook";
import BorrowBook from "./BorrowBook";
import ReturnBook from "./ReturnBook";
import { useUserStore } from "@/lib/store/user";

export default async function ListOfBook() {
  const { data: books, error } = await readBooks();

  if (error) {
    console.error("Failed to fetch books:", error);
    return <p className="text-center text-gray-500">Failed to load books.</p>;
  }
  const user = useUserStore.getState().user
  const isAdmin = user?.user_metadata?.role === "admin";
  const isUser = user?.user_metadata?.role === "user";

  return (
    <div className="dark:bg-inherit bg-white mx-2 rounded-sm">
      {books?.length > 0 ? (
        books.map((book: IBook) => (
          <div
            className="grid grid-cols-5 rounded-sm p-3 align-middle font-normal"
            key={book.id}
          >
            <h1 className="flex items-center dark:text-white text-lg">{book.title}</h1>

            <h1 className="flex items-center dark:text-white text-lg">{book.description}</h1>

            <div>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize border-[.5px] text-sm",
                  {
                    "border-green-500 bg-green-400 dark:text-green-400": book.status === "available",
                    "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400": book.status === "unavailable",
                  }
                )}
              >
                {book.status}
              </span>
            </div>

            <h1 className="flex items-center dark:text-white text-lg">
              {new Date(book.created_at).toDateString()}
            </h1>

            <div className="flex gap-2 items-center">
              {isAdmin && (
                <>
                  <DeleteBook book_id={book.id} />
                  <EditBook book={book} />
                </>
              )}

              {isUser && (
                <>
                <BorrowBook book_id={book.id} />
                <ReturnBook book_id={book.id} />
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No books available.</p>
      )}
    </div>
  );
}
