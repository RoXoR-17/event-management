"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/db/server";

export async function login(email: string, password: string, redirectPath?: string | null) {
  const supabase = await createClient();

  const payload = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect(`/${redirectPath ?? "home"}`);
}

export async function logout() {
  const supabase = await createClient();

  supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
