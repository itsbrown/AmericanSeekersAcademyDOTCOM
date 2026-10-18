import { useEffect, useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileLoader: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (turnstileLoader) return turnstileLoader;
  turnstileLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      turnstileLoader = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return turnstileLoader;
}

export function useFormSpamFields(active = true) {
  const startedRef = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [widgetKey, setWidgetKey] = useState(0);
  const protection = useQuery<{ turnstileSiteKey: string | null }>({
    queryKey: ["/api/form-protection"],
  });
  const siteKey = protection.data?.turnstileSiteKey ?? null;

  useEffect(() => {
    if (!active) return;
    startedRef.current = Date.now();
    setTurnstileToken("");
    setWidgetKey((current) => current + 1);
  }, [active]);

  return {
    honeypot,
    setHoneypot,
    siteKey,
    widgetKey,
    setTurnstileToken,
    pendingToken: protection.isLoading || (Boolean(siteKey) && !turnstileToken),
    payload: () => ({
      asa_hp: honeypot,
      formStartedAt: startedRef.current,
      ...(turnstileToken ? { turnstileToken } : {}),
    }),
  };
}

function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let widgetId = "";
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !container || !window.turnstile) return;
        widgetId = window.turnstile.render(container, {
          sitekey: siteKey,
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
      })
      .catch(() => onToken(""));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, onToken]);

  return <div ref={containerRef} className="min-h-[65px]" data-testid="turnstile-widget" />;
}

export default function FormSpamFields({
  honeypot,
  onHoneypot,
  siteKey,
  onToken,
}: {
  honeypot: string;
  onHoneypot: (value: string) => void;
  siteKey: string | null;
  onToken: (token: string) => void;
}) {
  const fieldId = useId();
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={fieldId}>Website</label>
        <input
          id={fieldId}
          name="asa_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => onHoneypot(event.target.value)}
        />
      </div>
      {siteKey ? <TurnstileWidget siteKey={siteKey} onToken={onToken} /> : null}
    </>
  );
}
