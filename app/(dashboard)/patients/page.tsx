"use client";

import dynamic from "next/dynamic";

const Patients = dynamic(() => import("@/modules/Patients"), { ssr: false });

export default function PatientsPage() {
  return <Patients />;
}
