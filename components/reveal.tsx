"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { revealUp } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={revealUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
