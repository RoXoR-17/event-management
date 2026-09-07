import { useMemo } from "react";

export default function useInstallPrompt() {
  const showIosInstallInfo = useMemo<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }, []);

  return { showIosInstallInfo };
}
