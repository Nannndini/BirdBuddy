import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;

export function ArrowRight(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function Sparkles(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 2l1.2 4.3L17.5 8l-4.3 1.2L12 13.5l-1.2-4.3L6.5 8l4.3-1.7L12 2z" fill="currentColor" opacity="0.9" />
      <path d="M19 12l.7 2.5L22 15l-2.3.5L19 18l-.7-2.5L16 15l2.3-.5L19 12z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
export function MapPin(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 22s7-4.6 7-12a7 7 0 10-14 0c0 7.4 7 12 7 12z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
export function Radar(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 21a9 9 0 109-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
