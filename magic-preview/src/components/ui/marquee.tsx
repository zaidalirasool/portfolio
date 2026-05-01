import type { HTMLAttributes } from "react";

type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({
  className = "",
  children,
  repeat = 2,
  reverse = false,
  pauseOnHover = false,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={`marquee ${reverse ? "marquee-reverse" : ""} ${pauseOnHover ? "marquee-pause-on-hover" : ""} ${className}`.trim()}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div className="marquee-track" key={index}>
          {children}
        </div>
      ))}
    </div>
  );
}
