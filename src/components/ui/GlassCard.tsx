import type { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<{ className?: string }>;

export default function GlassCard({ className, children }: Props) {
  return <div className={clsx("glass", className)}>{children}</div>;
}
