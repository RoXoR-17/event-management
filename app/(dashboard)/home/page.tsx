"use client";

import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/modules/Home"), { ssr: false });

export default function HomePage() {
  return <Home />;
}
