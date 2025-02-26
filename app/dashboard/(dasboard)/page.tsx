import React from "react";
import { fetchUserBooks } from "../book/actions";
import { readMembers } from "../members/actions";
import { useUserStore } from "@/lib/store/user";
import { cn } from "@/lib/utils";

export default async function Dashboard() {
    const { data: permissions } = await readMembers();
    const { books, error } = await fetchUserBooks();
    const user = useUserStore.getState().user;
    const isAdmin = user?.user_metadata.role === "admin";

    const usersOnly = (permissions || []).filter((permission) => permission.role === "user");

    return (
        <div className="max-w-2xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">
                {isAdmin ? "👥 User List" : "📚 My Books"}
            </h1>

            {isAdmin ? (
                usersOnly.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No users found.</p>
                ) : (
                    <div className="space-y-4">
                        {usersOnly.map((permission, index) => (
                            <div
                                className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700"
                                key={index}
                            >
                                <h3 className="text-lg font-semibold">{permission.members.name}</h3>
                                <p className="text-gray-400">{new Date(permission.created_at).toDateString()}</p>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                error ? (
                    <p className="text-red-400 text-center mt-5">Error loading books: {error}</p>
                ) : books.length === 0 ? (
                    <p className="text-gray-400">You have not selected any books yet.</p>
                ) : (
                    <div className="space-y-4">
                        {books.map((book) => (
                            <div 
                                key={book.id} 
                                className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700"
                            >
                                <h3 className="text-lg font-semibold">{book.title}</h3>
                                <p className="text-gray-300">{book.description}</p>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
