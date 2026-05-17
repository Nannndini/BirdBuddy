import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type Props = {
  href: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
};

export default function MagneticButton({ href, className, ariaLabel, children }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const max = Math.max(r.width, r.height);
      setStyle({ transform: `translate3d(${(dx / max) * 10}px, ${(dy / max) * 10}px, 0)`, transition: "transform 120ms ease" });
    };

    const onLeave = () => setStyle({ transform: "translate3d(0,0,0)", transition: "transform 220ms ease" });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className={clsx(className)} aria-label={ariaLabel} style={style}>
      {children}
    </a>
  );
}
