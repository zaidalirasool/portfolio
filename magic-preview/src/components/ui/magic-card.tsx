import type { HTMLAttributes } from "react";

type MagicCardProps = HTMLAttributes<HTMLDivElement>;

export function MagicCard({ className = "", children, ...props }: MagicCardProps) {
  return (
    <div className={`magic-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
