import React from "react";
import { fetchUserBooks } from "../book/actions";
import { readMembers } from "../members/actions";
import { useUserStore } from "@/lib/store/user";
import { Box, Typography, Paper } from "@mui/material";

export default async function Dashboard() {
    const { data: permissions } = await readMembers();
    const { books, error } = await fetchUserBooks();
    const user = useUserStore.getState().user;
    const isAdmin = user?.user_metadata.role === "admin";

    const usersOnly = (permissions || []).filter((permission) => permission.role === "user");

    return (
        <Box maxWidth="md" mx="auto" p={3} color="white">
            <Typography variant="h4" fontWeight="bold" mb={3}>
                {isAdmin ? "👥 User List" : "📚 My Books"}
            </Typography>

            {isAdmin ? (
                usersOnly.length === 0 ? (
                    <Typography color="gray" textAlign="center" py={4}>
                        No users found.
                    </Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {usersOnly.map((permission, index) => (
                            <Paper 
                                key={index} 
                                sx={{ bgcolor: "#1E293B", p: 2, borderRadius: 2, border: "1px solid #334155" }}
                            >
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    {permission.members.name}
                                </Typography>
                                <Typography color="gray">
                                    {new Date(permission.created_at).toDateString()}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )
            ) : (
                error ? (
                    <Typography color="red" textAlign="center" mt={3}>
                        Error loading books: {error}
                    </Typography>
                ) : books.length === 0 ? (
                    <Typography color="gray">You have not selected any books yet.</Typography>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {books.map((book) => (
                            <Paper 
                                key={book.id} 
                                sx={{ bgcolor: "#1E293B", p: 2, borderRadius: 2, border: "1px solid #334155" }}
                            >
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    {book.title}
                                </Typography>
                                <Typography color="gray">{book.description}</Typography>
                            </Paper>
                        ))}
                    </Box>
                )
            )}
        </Box>
    );
}