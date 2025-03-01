import React from "react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store/user";
import { readMembers } from "../actions";
import { IPermission } from "@/lib/types";
import DeleteMember from "./DeleteMember";
import EditMember from "./edit/EditMember";
import { Paper, Typography, Stack } from "@mui/material";

export default async function ListOfMembers() {
  const { data: permissions, error } = await readMembers();

  if (error) {
    console.error("Failed to fetch members:", error);
    return <Typography className="!text-center !text-gray-400">Failed to load members.</Typography>;
  }

  const user = useUserStore.getState().user;
  const isAdmin = user?.user_metadata.role === "admin";

  return (
    <Paper elevation={0} className="!dark:bg-inherit !bg-transparent !mx-2 !rounded-none !p-4">
      {permissions?.length > 0 ? (
        permissions.map((permission, index) => (
          <Paper
            elevation={0}
            className="!grid !grid-cols-5 !rounded-none !p-3 !align-middle !font-normal !mb-2 !bg-transparent !border-b !border-gray-600"
            key={index}
          >
            <Typography variant="h6" className="!flex !items-center !text-white">
              {permission.members.name}
            </Typography>

            <div>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full shadow capitalize border-[.5px] text-sm ml-[-10px]",
                  {
                    "border-green-500 text-green-600 bg-green-200": permission.role === "admin",
                    "border-zinc-300 dark:text-yellow-300 dark:border-yellow-700 px-4 bg-yellow-50":
                      permission.role === "user",
                  }
                )}
              >
                {permission.role}
              </span>
            </div>

            <Typography variant="body2" className="!flex !items-center !text-white">
              {new Date(permission.created_at).toDateString()}
            </Typography>

            <div>
              <span
                className={cn(
                  "dark:bg-zinc-800 px-2 py-1 rounded-full capitalize text-sm border-zinc-300 border",
                  {
                    "text-green-600 px-4 dark:border-green-400 bg-green-200":
                      permission.status === "active",
                    "text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400":
                      permission.status === "resigned",
                  }
                )}
              >
                {permission.status}
              </span>
            </div>

            <Stack direction="row" spacing={1} className="!flex !gap-2 !items-center">
              {isAdmin && <DeleteMember user_id={permission.members.id} />}
              <EditMember isAdmin={isAdmin} permission={permission} />
            </Stack>
          </Paper>
        ))
      ) : (
        <Typography className="!text-center !text-gray-400">No members available.</Typography>
      )}
    </Paper>
  );
}
