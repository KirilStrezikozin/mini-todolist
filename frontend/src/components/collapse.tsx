import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";

interface CollapseProps {
  children: ReactNode,
  show?: boolean,
  layout?: boolean,
}

export function Collapse({
  children, show = true, layout = false }: CollapseProps
) {
  return (
    <AnimatePresence>
      {show && <motion.div
        layout={layout}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>}
    </AnimatePresence>
  );
}