import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  as?: React.ElementType;
  text: string;
  className?: string;
};

export default function SplitText({ as = "div", text, className }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ").map((w) => w.trim()).filter(Boolean);

  const content = (
    <>
      <span className="srOnly">{text}</span>
      <span aria-hidden="true" style={{ display: "inline-block" }}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            style={{ display: "inline-block", marginRight: i === words.length - 1 ? 0 : "0.25em" }}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18, rotateX: 55, filter: "blur(8px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.05 * i, ease: [0.2, 0.9, 0.1, 1] }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    </>
  );

  return React.createElement(as as any, { className, "aria-label": text } as any, content);
}
