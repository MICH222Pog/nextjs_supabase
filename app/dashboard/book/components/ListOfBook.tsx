import React from "react";
import { cn } from "@/lib/utils";
import { readBooks } from "../actions";
import { IBook } from "@/lib/types";
import DeleteBook from "./DeleteBook";
import EditBook from "./EditBook";
import BorrowBook from "./BorrowBook";
import ReturnBook from "./ReturnBook";
import { useUserStore } from "@/lib/store/user";
import { Paper, Typography, Stack } from "@mui/material";

export default async function ListOfBook() {
  const { data: books, error } = await readBooks();

  if (error) {
    console.error("Failed to fetch books:", error);
    return <Typography className="!text-center !text-gray-400">Failed to load books.</Typography>;
  }

  const user = useUserStore.getState().user;
  const isAdmin = user?.user_metadata?.role === "admin";
  const isUser = user?.user_metadata?.role === "user";

  return (
    <Paper elevation={0} className="!dark:bg-inherit !bg-transparent !mx-2 !rounded-none !p-4 ">
      {books?.length > 0 ? (
        books.map((book: IBook) => (
          <Paper
            elevation={0}
            className="!grid !grid-cols-5 !rounded-none !p-3 !align-middle !font-normal !mb-2 !bg-transparent !border-b !border-gray-600"
            key={book.id}
          >
            <Typography variant="h6" className="!flex !items-center !text-white">
              {book.title}
            </Typography>

            <Typography variant="body1" className="!flex !items-center !text-white !ml-[-10px]">
              {book.description}
            </Typography>
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

            <Typography variant="body2" className="!flex !items-center !text-white">
              {new Date(book.created_at).toDateString()}
            </Typography>

            <Stack direction="row" spacing={1} className="!flex !gap-2 !items-center">
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
            </Stack>
          </Paper>
        ))
      ) : (
        <Typography className="!text-center !text-gray-400">No books available.</Typography>
      )}
    </Paper>
  );
}
