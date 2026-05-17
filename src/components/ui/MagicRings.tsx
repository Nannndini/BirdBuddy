import { useEffect, useRef } from "react";

export default function MagicRings() {
  const r1 = useRef<HTMLDivElement | null>(null);
  const r2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (r1.current) r1.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (r2.current) r2.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="rings" aria-hidden="true">
      <div ref={r1} className="ring ring1" />
      <div ref={r2} className="ring ring2" />
    </div>
  );
}
