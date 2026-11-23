import { useState } from "react";

const API_URL =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_URL ?? "http://localhost:3000/api";

type PingState = "idle" | "loading" | "ok" | "error";

const labels: Record<PingState, string> = {
  idle: "Ping API",
  loading: "Pinging...",
  ok: "API OK",
  error: "API Error",
};

export default function PingButton() {
  const [state, setState] = useState<PingState>("idle");

  async function ping() {
    setState("loading");

    try {
      const response = await fetch(`${API_URL}/health`);

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      setState("ok");
    } catch {
      setState("error");
    }
  }

  return (
    <button
      className={`ping-button ping-${state}`}
      onClick={ping}
      disabled={state === "loading"}
      aria-live="polite"
    >
      {labels[state]}
    </button>
  );
}
