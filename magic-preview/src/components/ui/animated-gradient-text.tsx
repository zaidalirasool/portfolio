import type { ComponentPropsWithoutRef } from "react";

type AnimatedGradientTextProps = ComponentPropsWithoutRef<"span"> & {
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
};

export function AnimatedGradientText({
  children,
  className = "",
  speed = 1,
  colorFrom = "#ff6f4d",
  colorTo = "#2738d8",
  style,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      className={`animated-gradient-text ${className}`.trim()}
      style={
        {
          ...style,
          "--agt-duration": `${Math.max(2, 8 / speed)}s`,
          "--agt-from": colorFrom,
          "--agt-to": colorTo,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </span>
  );
}
