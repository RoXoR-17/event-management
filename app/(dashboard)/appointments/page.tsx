"use client";

import dynamic from "next/dynamic";

const Appointments = dynamic(() => import("@/modules/Appointments"), { ssr: false });

export default function AppointmentsPage() {
  return <Appointments />;
}
