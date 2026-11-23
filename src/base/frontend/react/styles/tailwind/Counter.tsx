import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <button
      className="inline-flex items-center gap-[18px] rounded-full border border-[#8250ff]/20 bg-[#0f0c1b]/85 px-6 py-3.5 text-[21px] text-white transition duration-200 hover:-translate-y-0.5 hover:border-[#7625ff] hover:bg-[#5b19b4]/20 active:scale-95"
      onClick={() => setCount((prev) => prev + 1)}
      aria-label={`Counter: ${count}`}
    >
      <span className="h-[17px] w-[17px] rounded-full bg-[#20e879] shadow-[0_0_12px_rgba(32,232,121,0.3)]" />
      <span>count is {count}</span>
    </button>
  );
}
