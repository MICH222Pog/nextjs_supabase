"use server";

import { readUserSession } from "@/lib/actions";
import { createSupbaseAdmin, createSupbaseServerClient, createSupbaseServerClientReadOnly } from "@/lib/supabase";
import { IPermission } from "@/lib/types";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function createMember(data: {
    email: string;
    password: string;
    name: string;
    role: "user" | "admin";
    status: "active" | "resigned";
    confirm: string;
}) {

	const {data:userSession} = await readUserSession()

	// prevent non user to create
	if(userSession.session?.user.user_metadata.role !== "admin"){
		return JSON.stringify( {error: {message : "You are not allowed to do this"}});
	}

	const supabase = await createSupbaseAdmin()
	// create account
	const createResult = await supabase.auth.admin.createUser({email:data.email,
		password: data.password,
		email_confirm: true,
		user_metadata:{
			role:data.role
		}
	})

	if(createResult.error?.message){
		return JSON.stringify(createResult);
	}else{
		const memberResult = await supabase.from("members").insert({name: data.name, id:createResult.data.user?.id, email: data.email})

		if(memberResult.error?.message){
			return JSON.stringify(memberResult);
		}else{
			const permissionResult = await supabase.from("permission").insert({role: data.role, member_id:createResult.data.user?.id, status: data.status});

			revalidatePath("/dashboard/member")
			return JSON.stringify(permissionResult);
		}
	}
	

	
	
}
export async function updateMemberBasicById(id: string, data:
	{
		name: string;
	}
) {
	
	const supabase = await createSupbaseServerClient()

	const result = await supabase.from("members").update(data).eq("id", id)
	revalidatePath("/dashboard/member")
	return JSON.stringify(result);


}

export async function updateMemberAdvanceById(
	permission_id: string,
	user_id: string,
	data: {
	  role: "admin" | "user";
	  status: "active" | "resigned";
	}
  ) {
	// Read the current user session
	const { data: userSession } = await readUserSession();
  
	if (userSession.session?.user.user_metadata.role !== "admin") {
	  return JSON.stringify({ error: { message: "You are not allowed to do this" } });
	}
  
	// Use the admin client to update the user role
	const supabaseAdmin = await createSupbaseAdmin();
	const updatedResult = await supabaseAdmin.auth.admin.updateUserById(user_id, {
	  user_metadata: { role: data.role },
	});
  
	if (updatedResult.error?.message) {
	  return JSON.stringify(updatedResult);
	} else {
	  // Update the permissions in the database
	  const supabase = await createSupbaseServerClient();
	  const result = await supabase.from("permission").update(data).eq("id", permission_id);
  
	  // ✅ Force session refresh so UI updates immediately
	  await supabase.auth.refreshSession();
  
	  // ✅ Ensure UI revalidates the path
	  revalidatePath("/dashboard/member");
  
	  return JSON.stringify(result);
	}
  }
  

export async function updateMemberAccountById(
	user_id: string,
	data:
	{
		email: string;
		password?: string | undefined;
		confirm?: string | undefined;
	}
) {

	const {data:userSession} = await readUserSession()

	// prevent non user to create
	if(userSession.session?.user.user_metadata.role !== "admin"){
		return JSON.stringify( {error: {message : "You are not allowed to do this"}});
	}

	let updateObject:{
		email: string;
		password?: string | undefined;
	} =  {email: data.email }

	if(data.password){
		updateObject["password"] = data.password
	}

	const supabaseAdmin = await createSupbaseAdmin()
	
	const updatedResult = await supabaseAdmin.auth.admin.updateUserById(
		user_id, updateObject
	  );

	  if(updatedResult.error?.message){
		return JSON.stringify(updatedResult);
	}else{
		const supabase = await createSupbaseServerClient()

		const result = await supabase.from("members").update({email: data.email}).eq("id", user_id);
		revalidatePath("/dashboard/member")
		return JSON.stringify(result);
	}
  
}


export async function deleteMemberById(user_id: string) {
	const {data:userSession} = await readUserSession()

	
	if(userSession.session?.user.user_metadata.role !== "admin"){
		return JSON.stringify( {error: {message : "You are not allowed to do this"}});
	}

	// delete account
	const supabaseAdmin = await createSupbaseAdmin()

	const deleteResult = await supabaseAdmin.auth.admin.deleteUser(user_id)

	if(deleteResult.error?.message){
		return JSON.stringify(deleteResult);
	}else{
		const supabase = await createSupbaseServerClient()

		const result = await supabase.from("members").delete().eq("id", user_id);
		revalidatePath("/dashboard/member")
		return JSON.stringify(result);
	}
}

export async function readMembers() {
	unstable_noStore();

	const supabase = await createSupbaseServerClient()

	return await supabase.from("permission").select("*, members(*)");
}

export async function searchMembersByName(searchTerm: string) {
	unstable_noStore();
  
	const supabase = await createSupbaseServerClient();
  
	let query = supabase
    .from("permission")
    .select("*, members!inner(*)"); 

  if (searchTerm) {
    query = query
      .ilike("members.name", `%${searchTerm}%`)
      .ilike("role", `%${searchTerm}%`);
  }

  const { data, error } = await query;
  
	if (error) {
	  console.error("Error fetching members:", error);
	  return [];
	}
  
	return data;
  }
  