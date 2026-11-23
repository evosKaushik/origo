import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <button
      className="btn btn-lg counter-button rounded-pill d-inline-flex align-items-center gap-3"
      onClick={() => setCount((prev) => prev + 1)}
      aria-label={`Counter: ${count}`}
    >
      <span className="status-dot" />
      <span>count is {count}</span>
    </button>
  );
}
