import { useRef, type HTMLAttributes, type PointerEvent } from "react";

export type MagicCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Match static site `data-tilt` — subtle perspective on pointer move. */
  tilt?: boolean;
};

export function MagicCard({
  className = "",
  children,
  tilt = false,
  onPointerMove,
  onPointerLeave,
  ...props
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
    if (tilt) {
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${py * -5}deg) rotateY(${px * 5}deg)`;
    }
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event);
    const card = ref.current;
    if (!card) return;
    if (tilt) card.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className={`magic-card ${className}`.trim()}
      {...props}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
