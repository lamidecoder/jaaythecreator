"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type CursorContextValue = {
  setLabel: (label: string | null) => void;
};

const CursorContext = createContext<CursorContextValue>({ setLabel: () => {} });

/** Sets the custom cursor's label for as long as the calling component is hovered. Desktop only, a no-op on touch. */
export function useCursorLabel() {
  return useContext(CursorContext).setLabel;
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    document.documentElement.classList.add("has-custom-cursor");

    function handleMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
    }
    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  return (
    <CursorContext.Provider value={{ setLabel }}>
      {children}
      {enabled ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center rounded-full border border-paper/40 bg-ink/70 font-sans text-[11px] uppercase tracking-[0.15em] text-paper backdrop-blur-sm"
          style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
          animate={{
            width: label ? 108 : 10,
            height: label ? 108 : 10,
            opacity: 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <motion.span
            animate={{ opacity: label ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="px-2 text-center leading-tight"
          >
            {label}
          </motion.span>
        </motion.div>
      ) : null}
    </CursorContext.Provider>
  );
}
