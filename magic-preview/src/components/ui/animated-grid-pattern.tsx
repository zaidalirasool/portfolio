import type { HTMLAttributes } from "react";

type AnimatedGridPatternProps = HTMLAttributes<HTMLDivElement>;

export function AnimatedGridPattern({ className = "", ...props }: AnimatedGridPatternProps) {
  return <div className={`animated-grid-pattern ${className}`.trim()} {...props} />;
}
