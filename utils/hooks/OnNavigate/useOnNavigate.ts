"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { appPathnames } from "@/components/DashboardLayout/constant";

function isFetchingNewPath(url: string, pathWhenClicked: string) {
  try {
    const pathname = new URL(url).pathname;
    return appPathnames
      .filter((pathname) => pathname !== pathWhenClicked)
      .includes(pathname as (typeof appPathnames)[number]);
  } catch (error) {
    console.error("url error", error);
  }
  return false;
}

let clickTime = 0;
let pathWhenClicked = "";

export function useOnNavigate() {
  const curPath = usePathname();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clickTime = 0;
    if (curPath !== pathWhenClicked) {
      // schedule the state update asynchronously to avoid synchronous setState in the effect
      const id = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(id);
    }
  }, [curPath]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const onMessage = ({ data }: MessageEvent) => {
      if (!clickTime || !data?.fetchUrl || data.dest !== "") return;

      if (isFetchingNewPath(data.fetchUrl, pathWhenClicked)) {
        clickTime = 0;
        setLoading(true);
      }
    };

    const sw = navigator.serviceWorker;
    sw?.addEventListener("message", onMessage);

    const onClick = () => {
      clickTime = Date.now();
      pathWhenClicked = location.pathname;
    };

    addEventListener("click", onClick, true);

    return () => {
      sw?.removeEventListener("message", onMessage);
      removeEventListener("click", onClick, true);
    };
  }, []);

  return loading;
}
