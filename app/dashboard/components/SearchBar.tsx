"use client"

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === "dark" ? "inherit" : "white",
    borderRadius: "4px",
    "&:hover fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#555" : "#ccc",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.mode === "dark" ? "#888" : "#999",
    },
  },
}));

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <StyledTextField
      variant="outlined"
      placeholder="Search by name or role"
      fullWidth
      value={query}
      onChange={handleSearch}
    />
  );
};

export default SearchBar;
