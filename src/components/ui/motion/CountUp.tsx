import { useEffect, useMemo, useState } from "react";

export default function CountUp({ to, durationMs = 900 }: { to: number; durationMs?: number }) {
  const [v, setV] = useState(0);
  const start = useMemo(() => performance.now(), []);
  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setV(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs, start]);

  return <>{v}</>;
}
