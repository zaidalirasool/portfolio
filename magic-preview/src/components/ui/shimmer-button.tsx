import type { ButtonHTMLAttributes } from "react";

type ShimmerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ShimmerButton({ className = "", children, ...props }: ShimmerButtonProps) {
  return (
    <button className={`shimmer-button ${className}`.trim()} {...props}>
      <span>{children}</span>
    </button>
  );
}
