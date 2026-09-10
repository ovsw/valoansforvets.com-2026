import { useSyncExternalStore } from "react";
const query = "(max-width: 767px)";
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
// Same shadcn breakpoint, subscribed through React's external-store API.
export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
