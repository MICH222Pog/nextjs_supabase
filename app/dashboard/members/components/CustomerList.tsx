"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from "react";
import { Paper, Typography, CircularProgress } from "@mui/material";
import { cn } from "@/lib/utils";
import { searchMembersByName } from "../actions"; // Import the server function
import SearchBar from "../../components/SearchBar";

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]); // Allow dynamic data
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadCustomers("");
  }, []);

  const loadCustomers = async (searchTerm: string) => {
    setLoading(true);
    const data = await searchMembersByName(searchTerm);
    console.log("🚀 Customers Data:", data); // Check if correct data is fetched
    setCustomers(data || []); 
    setLoading(false);
  };

  return (
    <Paper elevation={0} className="!dark:bg-inherit !bg-transparent !mx-2 !rounded-none !p-4">
      <SearchBar onSearch={loadCustomers} />
      {loading ? (
        <CircularProgress className="!text-center" />
      ) : customers.length > 0 ? (
        customers.map((customer) => (
          <Paper
            elevation={0}
            className="!grid !grid-cols-5 !rounded-none !p-3 !align-middle !font-normal !mb-2 !bg-transparent !border-b !border-gray-600"
            key={customer.id}
          >
            <Typography variant="h6" className="!flex !items-center !text-white">
              {customer.members?.name ?? "Unknown"}
            </Typography>

            <div>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize border-[.5px] text-sm ml-[-10px]",
                  {
                    "border-green-500 text-green-600 bg-green-200": customer.role === "admin",
                    "border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50":
                      customer.role === "user",
                  }
                )}
              >
                {customer.role}
              </span>
            </div>

            <Typography variant="body2" className="!flex !items-center !text-white">
              {customer.members?.created_at ? new Date(customer.members.created_at).toDateString() : "N/A"}
            </Typography>

            <div>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full capitalize text-sm border-zinc-300 border",
                  {
                    "text-green-600 px-4 dark:border-green-400 bg-green-200": customer.status === "active",
                    "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400": customer.status === "resigned",
                  }
                )}
              >
                {customer.status}
              </span>
            </div>
          </Paper>
        ))
      ) : (
        <Typography className="!text-center !text-gray-400">No customers available.</Typography>
      )}
    </Paper>
  );
};

export default CustomerList;
