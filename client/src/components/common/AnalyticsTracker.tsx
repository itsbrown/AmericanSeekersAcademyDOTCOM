import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

function getSimplifiedReferrer(referrer: string): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return null;
  }
}

export default function AnalyticsTracker() {
  const [location] = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (location === lastTrackedPath.current) return;
    if (location.startsWith("/admin")) return;
    if (location.startsWith("/blog/admin")) return;
    
    lastTrackedPath.current = location;

    const trackPageView = async () => {
      try {
        await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: location,
            referrer: getSimplifiedReferrer(document.referrer),
            userAgent: null,
          }),
        });
      } catch {}
    };

    trackPageView();
  }, [location]);

  return null;
}
