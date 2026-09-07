"use client";

import { Spin } from "antd";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Spin size="large" spinning />
    </div>
  );
}
