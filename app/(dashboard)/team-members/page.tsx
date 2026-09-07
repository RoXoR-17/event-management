"use client";

import dynamic from "next/dynamic";

const TeamMembers = dynamic(() => import("@/modules/TeamMembers"), { ssr: false });

export default function TeamMembersPage() {
  return <TeamMembers />;
}
