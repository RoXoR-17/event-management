import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { createClient } from "@/utils/db/server";

const DashboardLayout = dynamic(() => import("./DashboardLayout"));

export default async function ProtectedDashboardLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  console.log(data, error, "data2");

  if (error || !data?.user) {
    redirect("/");
  }

  return <DashboardLayout user={data.user}>{children}</DashboardLayout>;
}
