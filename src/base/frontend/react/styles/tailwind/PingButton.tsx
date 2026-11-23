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

const stateClasses: Record<PingState, string> = {
  idle: "border-[#8250ff]/30 bg-[#7b30ff]/15 text-white hover:border-[#9b42ff]",
  loading: "border-[#b9b2d2]/30 bg-[#b9b2d2]/10 text-[#b9b2d2]",
  ok: "border-[#20e879]/40 bg-[#20e879]/15 text-[#20e879]",
  error: "border-[#ff5c7a]/40 bg-[#ff5c7a]/15 text-[#ff5c7a]",
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
      className={`inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-semibold transition ${stateClasses[state]}`}
      onClick={ping}
      disabled={state === "loading"}
      aria-live="polite"
    >
      {labels[state]}
    </button>
  );
}
