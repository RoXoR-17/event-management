"use client";

import dynamic from "next/dynamic";

const MainProvider = dynamic(() => import("@/components/MainProvider"), { ssr: false });

export default MainProvider;
