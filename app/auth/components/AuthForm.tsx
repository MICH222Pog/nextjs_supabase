"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTransition } from "react";
import { loginWithEmailAndPassword } from "../actions";
import { AuthTokenResponse } from "@supabase/supabase-js";
import { TextField, Box, Typography, Paper } from "@mui/material";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

export default function AuthForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { error } = JSON.parse(
        await loginWithEmailAndPassword(data)
      ) as AuthTokenResponse;

      if (error) {
        toast({
          title: "Failed to login",
          description: error.message,
        });
      } else {
        toast({
          title: "Successfully logged in 🎉",
        });
      }
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 4,
          bgcolor: "#1E293B",
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid #334155",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#E2E8F0", mb: 1 }}
        >
          Welcome Back
        </Typography>
        <Typography sx={{ mb: 3, color: "#94A3B8" }}>
          Sign in to continue
        </Typography>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              {...form.register("email")}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
              sx={{
                input: { color: "#E2E8F0" },
                label: { color: "#94A3B8" },
                fieldset: { borderColor: "#334155" },
                '&:hover fieldset': { borderColor: "#E2E8F0" },
              }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              {...form.register("password")}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
              sx={{
                input: { color: "#E2E8F0" },
                label: { color: "#94A3B8" },
                fieldset: { borderColor: "#334155" },
                '&:hover fieldset': { borderColor: "#E2E8F0" },
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: "#94A3B8", mb: 2, display: 'block' }}>
            Forgot password? Contact your admin.
          </Typography>
          <Button
            type="submit"
            variant="outline"
            className="w-full flex items-center gap-2 bg-[#334155] text-[#E2E8F0] hover:bg-[#475569] border border-[#64748B]"
          >
            Login
            {isPending && (
              <AiOutlineLoading3Quarters className="animate-spin" />
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
