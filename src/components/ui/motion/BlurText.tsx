import { motion, useReducedMotion } from "framer-motion";

export default function BlurText({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(14px)" }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.2, 0.9, 0.1, 1] }}
    >
      {text}
    </motion.div>
  );
}
