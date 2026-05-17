import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

export default function ScrollReveal({ children }: PropsWithChildren) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.62, ease: [0.2, 0.9, 0.1, 1] }}
    >
      {children}
    </motion.div>
  );
}
