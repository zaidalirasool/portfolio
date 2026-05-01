import { useState, useEffect, useRef } from "react";

// ── Confetti keyframes injected once ──────────────────────────────────────
const ConfettiStyles = () => (
  <style>{`
    @keyframes confetti-burst {
      0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.4); opacity: 0; }
    }
    .confetti-piece {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 2px;
      animation: confetti-burst 0.65s ease-out forwards;
      pointer-events: none;
      z-index: 50;
    }
  `}</style>
);

// ── Icons ──────────────────────────────────────────────────────────────────
const MinusIcon = () => (
  <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
    <path d="M1 1H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const CheckIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8L6.5 11.5L13 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShopPayIcon = () => (
  <img
    src="/shop-pay-white.png"
    alt="Shop Pay"
    style={{ height: "20px", display: "block" }}
  />
);

// ── Coffee bag real image ──────────────────────────────────────────────────
const CoffeeBag = ({ src = "/coffee-bag.png" }) => (
  <img
    src={src}
    alt="Coffee bag"
    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
  />
);

const SupplementBottle = () => (
  <svg width="52" height="68" viewBox="0 0 52 68" fill="none">
    <rect x="16" y="6" width="20" height="6" rx="3" fill="#4a5568" />
    <rect x="10" y="10" width="32" height="52" rx="8" fill="#2d6a4f" />
    <rect x="14" y="18" width="24" height="28" rx="3" fill="white" fillOpacity="0.9" />
    <text x="26" y="30" textAnchor="middle" fontSize="6" fontWeight="700" fill="#2d6a4f" fontFamily="sans-serif">COGNITIVE</text>
    <text x="26" y="39" textAnchor="middle" fontSize="5" fill="#2d6a4f" fontFamily="sans-serif">ENHANCER</text>
    <rect x="14" y="50" width="24" height="3" rx="1.5" fill="white" fillOpacity="0.3" />
  </svg>
);

// ── Tier icons ─────────────────────────────────────────────────────────────
const TruckIcon = ({ color = "currentColor" }) => (
  <svg width="19" height="17" viewBox="0 0 15 13" fill="none">
    <path d="M1 1.5h8v8H1V1.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M9 4h2.5l2 2.5v3H9V4z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
    <circle cx="3.5" cy="11" r="1.5" stroke={color} strokeWidth="1.3"/>
    <circle cx="11" cy="11" r="1.5" stroke={color} strokeWidth="1.3"/>
  </svg>
);

const GiftBoxIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="6" width="12" height="7" rx="0.5" stroke={color} strokeWidth="1.3"/>
    <path d="M7 6v7M1 9.5h12" stroke={color} strokeWidth="1.3"/>
    <path d="M4.5 6C3.1 6 2 5.2 2 4.2 2 3.2 3.1 3 4.5 3.8 5.7 4.5 7 6 7 6H4.5z" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
    <path d="M9.5 6C10.9 6 12 5.2 12 4.2 12 3.2 10.9 3 9.5 3.8 8.3 4.5 7 6 7 6H9.5z" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
  </svg>
);

const ToteBagSVG = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <path d="M18 20V16a8 8 0 0 1 16 0v4" stroke="#b09070" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <rect x="10" y="20" width="32" height="24" rx="3" fill="#e8d9c4" stroke="#c4a882" strokeWidth="1.5"/>
    <path d="M20 30h12" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── Tiered progress ────────────────────────────────────────────────────────
const TIERS = [
  { threshold: 40, label: "Free gift",     icon: "gift"  },
  { threshold: 80, label: "Free shipping", icon: "truck" },
];
const TIER_MAX = 120; // tiers at 1/3 and 2/3 of the bar
const MARKER = 32;

function TieredProgress({ total }) {
  const t1Done = total >= TIERS[0].threshold;
  const t2Done = total >= TIERS[1].threshold;
  const pct    = t2Done ? 100 : Math.min((total / TIER_MAX) * 100, 100);
  const t1Pos  = (TIERS[0].threshold / TIER_MAX) * 100; // 33.3%
  const t2Pos  = (TIERS[1].threshold / TIER_MAX) * 100; // 66.7%

  let message;
  if (!t1Done) {
    const rem = (TIERS[0].threshold - total).toFixed(2);
    message = <>Spend <strong>${rem}</strong> more for a free gift 🎁</>;
  } else if (!t2Done) {
    const rem = (TIERS[1].threshold - total).toFixed(2);
    message = <>Spend <strong>${rem}</strong> more for free shipping</>;
  } else {
    message = <>🎉 You've unlocked free shipping!</>;
  }

  const markerStyle = (done) => ({
    position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
    width: `${MARKER}px`, height: `${MARKER}px`, borderRadius: "50%",
    background: done ? "#8a9e1a" : "#f9fce8",
    border: `1px solid ${done ? "#8a9e1a" : "#d0d0d0"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 0,
    transition: "all 0.3s ease", zIndex: 2,
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  });

  return (
    <div style={{
      border: "1.5px solid #8a9e1a", borderRadius: "10px",
      padding: "12px", marginBottom: "16px",
      background: "#f9fce8",
    }}>
      <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "500", color: "#2d2d2d", textAlign: "center" }}>
        {message}
      </p>

      {/* Track + milestone markers */}
      <div style={{ position: "relative", height: `${MARKER}px`, margin: "0" }}>
        {/* Track */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "50%",
          transform: "translateY(-50%)",           height: "8px",
          background: "#e2e8c0", borderRadius: "4px",
        }}>
          {/* Fill */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${pct}%`, background: "#8a9e1a", borderRadius: "4px",
            transition: "width 0.4s ease",
          }} />
        </div>

        {/* Tier 1 — gift */}
        <div style={{ ...markerStyle(t1Done), left: `${t1Pos}%` }}>
          <div style={{ marginBottom: "3px" }}>
            <GiftBoxIcon color={t1Done ? "white" : "#bbb"} />
          </div>
        </div>

        {/* Tier 2 — truck */}
        <div style={{ ...markerStyle(t2Done), left: `${t2Pos}%` }}>
          <TruckIcon color={t2Done ? "white" : "#bbb"} />
        </div>
      </div>

      {/* Labels */}
      <div style={{ position: "relative", height: "18px", margin: "4px 0 0" }}>
        <div style={{ position: "absolute", left: `${t1Pos}%`, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#2d2d2d" }}>${TIERS[0].threshold}.00</p>
        </div>
        <div style={{ position: "absolute", left: `${t2Pos}%`, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#2d2d2d" }}>${TIERS[1].threshold}.00</p>
        </div>
      </div>
    </div>
  );
}

// ── Subscribe frequency options ────────────────────────────────────────────
const SUBSCRIBE_OPTIONS = [
  { value: "every 1 month",  label: "Every 1 month",  discount: "10% OFF", pct: 0.10 },
  { value: "every 2 months", label: "Every 2 months", discount: "15% OFF", pct: 0.15 },
  { value: "every 3 months", label: "Every 3 months", discount: "20% OFF", pct: 0.20 },
];

const getDiscountedPrice = (price, frequency) => {
  const opt = SUBSCRIBE_OPTIONS.find(o => o.value === frequency);
  return opt ? price * (1 - opt.pct) : price;
};

// ── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      style={{
        width: "44px", height: "26px", borderRadius: "13px",
        background: on ? "#8a9e1a" : "#d0d0d0",
        border: "none", cursor: "pointer", padding: "3px",
        display: "flex", alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background 0.2s ease, justify-content 0s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%",
        background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        transition: "transform 0.2s ease",
      }} />
    </button>
  );
}

// ── Chevron icons ──────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
    <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
const initialCartItems = [
  {
    id: 1,
    name: "Signature Blend",
    size: "12oz (340g)",
    price: 24.95,
    qty: 1,
    isSubscription: false,
    subscriptionLabel: "Subscribe & Save 15% Today",
    frequency: "every 1 month",
    canUnsubscribe: true,
    image: "/signature-blend.png",
  },
];

const recommendedItems = [
  { id: 3, name: "Decaf Blend",   size: "12oz (340g)", price: 24.95, image: "/decaf-blend.png" },
  { id: 4, name: "Single Origin", size: "12oz (340g)", price: 21.21, image: "/single-origin.png" },
];

const TOTE_BAG_ITEM = {
  id: 5, name: "The World Atlas of Coffee", size: "Free gift 🎁", price: 0, originalPrice: 24.95,
  qty: 1, isSubscription: false, frequency: "every 1 month",
  canUnsubscribe: false,
  image: "/world-atlas-coffee.png",
  isToteBag: true,
};

const FREE_SHIPPING_THRESHOLD = TIERS[1].threshold;

function QuantitySelector({ qty, onDecrement, onIncrement }) {
  return (
    <div className="qty-stepper" style={{
      display: "flex", alignItems: "center", gap: "10px",
      border: "1.5px solid #d0d0d0", borderRadius: "999px",
      padding: "5px 8px", background: "#fff",
      transition: "border-color 0.15s",
    }}>
      <button onClick={onDecrement} className="qty-btn" style={qtyBtnStyle}><MinusIcon /></button>
      <span style={{ fontSize: "15px", fontWeight: "600", minWidth: "14px", textAlign: "center", color: "#1a1a1a" }}>{qty}</span>
      <button onClick={onIncrement} className="qty-btn" style={qtyBtnStyle}><PlusIcon /></button>
    </div>
  );
}

const qtyBtnStyle = {
  background: "none", border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "0", color: "#1a1a1a", lineHeight: 1,
};

const CONFETTI_COLORS = ["#8a9e1a", "#c5d92e", "#f4c430", "#e8603c", "#5b9bd5", "#b07fd4", "#f28b82"];

function CartItem({ item, onQtyChange, onSubscribeToggle, onUnsubscribe, onFrequencyChange }) {
  const [particles, setParticles] = useState([]);
  const toggleRowRef = useRef(null);

  const handleToggle = () => {
    if (!item.isSubscription) {
      // Turning on — burst confetti from toggle row
      const newParticles = Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * 2 * Math.PI + (Math.random() - 0.5) * 0.6;
        const dist = 40 + Math.random() * 55;
        return {
          id: Date.now() + i,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          tx: `${Math.cos(angle) * dist}px`,
          ty: `${Math.sin(angle) * dist - 20}px`,
          rot: `${(Math.random() - 0.5) * 280}deg`,
          size: `${5 + Math.random() * 4}px`,
          delay: `${Math.random() * 80}ms`,
        };
      });
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 750);
      onSubscribeToggle(item.id);
    } else {
      onUnsubscribe(item.id);
    }
  };

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Top row: image + text + price/qty */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        {/* Image tile */}
        <div style={{
          width: "76px", height: "76px", borderRadius: "8px",
          background: "#f2f2f2", flexShrink: 0, overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          outline: "0.8px solid rgba(0,0,0,0.10)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Left: name + size + qty — independent of price height */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "6px" }}>
          <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a1a", lineHeight: 1.2 }}>
            {item.name}
          </p>
          {!item.isToteBag && (
            <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: 1.3 }}>
              {item.size}
            </p>
          )}
          {!item.isToteBag && (
            <div style={{ alignSelf: "flex-start" }}>
              <QuantitySelector
                qty={item.qty}
                onDecrement={() => onQtyChange(item.id, -1)}
                onIncrement={() => onQtyChange(item.id, 1)}
              />
            </div>
          )}
        </div>

        {/* Right: price — aligned to top, independent column */}
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          {item.isToteBag ? (
            <>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a1a", letterSpacing: "-0.3px" }}>FREE</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#aaa", textDecoration: "line-through" }}>${item.originalPrice.toFixed(2)}</p>
            </>
          ) : item.isSubscription ? (
            <>
              <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a1a", letterSpacing: "-0.3px" }}>${getDiscountedPrice(item.price, item.frequency).toFixed(2)}</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#aaa", textDecoration: "line-through" }}>${item.price.toFixed(2)}</p>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a1a", letterSpacing: "-0.3px" }}>${item.price.toFixed(2)}</p>
          )}
        </div>

      </div>

      {!item.isToteBag && (
      <div style={{ marginTop: "12px", position: "relative" }} ref={toggleRowRef}>
        {/* Confetti origin */}
        {particles.map(p => (
          <div
            key={p.id}
            className="confetti-piece"
            style={{
              background: p.color,
              width: p.size, height: p.size,
              top: "50%", left: "80%",
              marginTop: `-${parseFloat(p.size) / 2}px`,
              marginLeft: `-${parseFloat(p.size) / 2}px`,
              "--tx": p.tx, "--ty": p.ty, "--rot": p.rot,
              animationDelay: p.delay,
            }}
          />
        ))}

        {/* Toggle row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "11px 14px", borderRadius: item.isSubscription ? "12px 12px 0 0" : "12px",
          border: "1.5px solid #d0d0d0",
          borderBottom: item.isSubscription ? "1px solid #f0f0f0" : "1.5px solid #d0d0d0",
          background: "white",
          transition: "border-radius 0.15s",
        }}>
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>
            Subscribe & Save up to 20%
          </span>
          <Toggle on={item.isSubscription} onToggle={handleToggle} />
        </div>

        {/* Expanded frequency options */}
        {item.isSubscription && (
          <div style={{
            border: "1.5px solid #d0d0d0", borderTop: "none",
            borderRadius: "0 0 12px 12px",
            padding: "10px 10px 10px",
            display: "flex", flexDirection: "column", gap: "8px",
            background: "white",
          }}>
            {SUBSCRIBE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFrequencyChange(item.id, opt.value)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "11px 14px", borderRadius: "10px", textAlign: "left",
                  border: `1.5px solid ${item.frequency === opt.value ? "#8a9e1a" : "#e8e8e8"}`,
                  background: item.frequency === opt.value ? "#f9fce8" : "white",
                  cursor: "pointer", width: "100%",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                {/* Radio indicator */}
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${item.frequency === opt.value ? "#8a9e1a" : "#ccc"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.frequency === opt.value && (
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#8a9e1a" }} />
                  )}
                </div>
                <span style={{ flex: 1, fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#6a7a14" }}>
                  {opt.discount}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

function RecommendedCarousel({ items, addedMap, onAdd }) {
  const [index, setIndex] = useState(0);
  const outerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!outerRef.current) return;
    const el = outerRef.current;
    const update = () => setContainerWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Clamp index when items shrink
  useEffect(() => {
    setIndex(i => Math.min(i, Math.max(0, items.length - 1)));
  }, [items.length]);

  const CARD_PADDING = 24;
  const peek = 64;
  const gap = 12;
  const cardWidth = containerWidth ? containerWidth - peek : 0;
  const translateX = -(index * (cardWidth + gap));

  return (
    <div ref={outerRef}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#555" }}>Recommended for you:</p>
        <div style={{ display: "flex", gap: "4px" }}>
          {[[-1, ChevronLeft], [1, ChevronRight]].map(([dir, Icon]) => {
            const disabled = dir === -1 ? index === 0 : index === items.length - 1;
            return (
              <button
                key={dir}
                onClick={() => setIndex(i => Math.max(0, Math.min(items.length - 1, i + dir)))}
                disabled={disabled}
                style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  border: "1.5px solid #d0d0d0", background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: disabled ? "default" : "pointer",
                  opacity: disabled ? 0.3 : 1, transition: "all 0.15s",
                  padding: 0,
                }}
                className={disabled ? "" : "carousel-arrow"}
              ><Icon /></button>
            );
          })}
        </div>
      </div>

      <div style={{ overflow: "hidden", marginRight: `-${CARD_PADDING}px` }}>
        <div style={{
          display: "flex",
          gap: `${gap}px`,
          transform: `translateX(${translateX}px)`,
          transition: "transform 0.3s ease",
        }}>
          {items.map((item, i) => (
            <div key={item.id} style={{ width: `${i === items.length - 1 ? cardWidth + peek : cardWidth}px`, flexShrink: 0 }}>
              <RecommendedItem item={item} added={!!addedMap[item.id]} onAdd={() => onAdd(item.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecommendedItem({ item, onAdd, added }) {
  return (
    <div style={{
      border: "1.5px solid #e8e8e8", borderRadius: "12px", padding: "12px 14px",
      display: "flex", alignItems: "center", gap: "12px", background: "#FAF8F6",
    }}>
      <div style={{ width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: item.isToteBag ? "#f5efe6" : "#f2f2f2", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", outline: "0.8px solid rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {item.isToteBag ? <ToteBagSVG /> : <CoffeeBag src={item.image} />}
      </div>
      {/* Left: name, price, size stacked */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "700", color: "#1a1a1a" }}>{item.name}</p>
        <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "700", color: item.isToteBag ? "#8a9e1a" : "#1a1a1a" }}>
          {item.isToteBag ? "FREE" : `$${item.price.toFixed(2)}`}
        </p>
        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.size}</p>
      </div>
      {/* Right: action button centered */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={onAdd}
          className={added ? "add-btn added" : "add-btn"}
          style={{
            background: added ? "#8a9e1a" : item.isToteBag ? "#8a9e1a" : "white",
            border: `1.5px solid ${added ? "#8a9e1a" : item.isToteBag ? "#8a9e1a" : "#1a1a1a"}`,
            cursor: added ? "default" : "pointer",
            padding: "5px 12px",
            borderRadius: "20px",
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "13px", fontWeight: "600",
            color: added ? "white" : item.isToteBag ? "white" : "#1a1a1a",
            transition: "all 0.2s",
          }}
        >
          {added ? <><CheckIcon size={13} color="white" /> Added</> : item.isToteBag ? "Claim" : "Add now"}
        </button>
      </div>
    </div>
  );
}

// ── Post-purchase (bettermelon) modal ──────────────────────────────────────
function PostPurchaseModal({ onClose }) {
  const [selected, setSelected] = useState("subscribe");
  const [seconds, setSeconds] = useState(276); // 4m 36s

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}>
      {/* Phone shell */}
      <div style={{
        width: "360px", borderRadius: "44px", background: "#1a1a1a",
        padding: "12px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        position: "relative",
      }}>
        {/* Notch */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <div style={{ width: "120px", height: "28px", background: "#1a1a1a", borderRadius: "14px", position: "relative", zIndex: 2 }}>
            <div style={{ position: "absolute", top: "6px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "16px", background: "#000", borderRadius: "8px" }} />
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "36px", overflow: "hidden" }}>
          {/* App header */}
          <div style={{ background: "#2d6a4f", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "white", fontSize: "18px", fontWeight: "800", fontFamily: "Georgia, serif" }}>bettermel<span style={{ fontStyle: "italic" }}>o</span>n</span>
            <button onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                {[0, 6, 12].map(y => <rect key={y} x="0" y={y} width="20" height="2" rx="1" fill="white" />)}
              </svg>
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: "24px 20px 20px", background: "white" }}>
            {/* Success */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <CheckIcon size={20} color="#2d6a4f" />
              </div>
              <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "800", color: "#1a1a1a" }}>You've paid for your order</h2>
              <div style={{ height: "1px", background: "#e8e8e8", margin: "0 0 16px" }} />
              <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#555" }}>
                Before you go, add Cognitive Enhancer to your order and save 15%
              </p>
              {seconds > 0 && (
                <span style={{ display: "inline-block", background: "#ffe0e0", color: "#c0392b", fontSize: "12px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>
                  Ends in {mins}m {secs}s
                </span>
              )}
            </div>

            {/* Product */}
            <div style={{ border: "1.5px solid #e8e8e8", borderRadius: "12px", padding: "14px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <SupplementBottle />
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "700" }}>Cognitive Enhancer</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>180 softgels</p>
                </div>
              </div>

              {/* One-time */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "8px", border: selected === "once" ? "2px solid #2d6a4f" : "1.5px solid #e0e0e0" }}
                onClick={() => setSelected("once")}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${selected === "once" ? "#2d6a4f" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {selected === "once" && <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#2d6a4f" }} />}
                </div>
                <span style={{ flex: 1, fontSize: "13px" }}>One-time purchase</span>
                <span style={{ fontSize: "14px", fontWeight: "700" }}>$25.20</span>
              </label>

              {/* Subscribe */}
              <div style={{ border: selected === "subscribe" ? "2px solid #2d6a4f" : "1.5px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", cursor: "pointer", background: selected === "subscribe" ? "#f0faf5" : "white" }}
                  onClick={() => setSelected("subscribe")}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: selected === "subscribe" ? "#2d6a4f" : "white", border: `2px solid ${selected === "subscribe" ? "#2d6a4f" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selected === "subscribe" && <CheckIcon size={11} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "13px", fontWeight: "600" }}>Subscribe and save 15%</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "12px", color: "#aaa", textDecoration: "line-through", display: "block" }}>$25.20</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a1a" }}>$21.42</span>
                  </div>
                </label>
                {selected === "subscribe" && (
                  <div style={{ padding: "8px 12px 12px 40px", background: "#f0faf5" }}>
                    {["Ships free monthly", "VIP discounts & perks", "Pause, edit or cancel anytime"].map(b => (
                      <div key={b} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <CheckIcon size={12} color="#2d6a4f" />
                        <span style={{ fontSize: "12px", color: "#555" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #ccc", background: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", color: "#555" }}>
                No, thank you
              </button>
              <button onClick={onClose} style={{ flex: 1.5, padding: "12px", borderRadius: "8px", border: "none", background: "#8a9e1a", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                Add to order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Cart Component ────────────────────────────────────────────────────
export default function RechargeCart() {
  const [items, setItems] = useState(initialCartItems);
  const [recommendedAdded, setRecommendedAdded] = useState({});
  const [showPostPurchase, setShowPostPurchase] = useState(false);

  const handleQtyChange = (id, delta) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty < 1) {
        const isRec = recommendedItems.some(r => r.id === id);
        if (isRec) {
          setRecommendedAdded(a => { const next = { ...a }; delete next[id]; return next; });
        }
        return prev.filter(i => i.id !== id);
      }
      return prev.map(i => i.id === id ? { ...i, qty: newQty } : i);
    });
  };

  const handleSubscribeToggle = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isSubscription: true, subscriptionLabel: "Delivery every month" } : i));
  };

  const handleUnsubscribe = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isSubscription: false, subscriptionLabel: "Subscribe & Save 15% Today" } : i));
  };

  const handleFrequencyChange = (id, freq) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, frequency: freq } : i));
  };

  const handleAddRecommended = (id) => {
    const rec = recommendedItems.find(r => r.id === id);
    if (!rec) return;
    setRecommendedAdded(prev => ({ ...prev, [id]: true }));
    setItems(prev => [...prev, {
      id: rec.id,
      name: rec.name,
      size: rec.size,
      price: rec.price,
      qty: 1,
      isSubscription: false,
      subscriptionLabel: "Subscribe & Save 15% Today",
      frequency: "every 1 month",
      canUnsubscribe: true,
      image: rec.image,
      isToteBag: rec.isToteBag || false,
    }]);
  };

  const subtotal = items.reduce((sum, i) => {
    const price = i.isSubscription ? getDiscountedPrice(i.price, i.frequency) : i.price;
    return sum + price * i.qty;
  }, 0);
  const availableRecs = recommendedItems.filter(r => !recommendedAdded[r.id]);

  // Auto-add / auto-remove tote bag when gift tier is crossed
  useEffect(() => {
    const unlocked = subtotal >= TIERS[0].threshold;
    setItems(prev => {
      const hasTote = prev.some(i => i.isToteBag);
      if (unlocked && !hasTote) return [...prev, TOTE_BAG_ITEM];
      if (!unlocked && hasTote) return prev.filter(i => !i.isToteBag);
      return prev;
    });
  }, [subtotal]);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e8edff 0%, #f5f0ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <ConfettiStyles />

      {/* Cart card */}
      <div style={{ background: "#c5d92e", borderRadius: "24px", padding: "32px", maxWidth: "536px", width: "100%" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", height: "944px" }}>
          <h1 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "800", color: "#1a1a1a", flexShrink: 0 }}>Your shopping cart</h1>

          <div style={{ flexShrink: 0 }}>
            <TieredProgress total={subtotal} />
          </div>

          {/* Items — flex-grows to fill space, scrolls when needed */}
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            <div className="cart-items-scroll">
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQtyChange={handleQtyChange}
                  onSubscribeToggle={handleSubscribeToggle}
                  onUnsubscribe={handleUnsubscribe}
                  onFrequencyChange={handleFrequencyChange}
                />
              ))}
            </div>
            {/* Shadow sits at the separator line */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "56px",
              background: "linear-gradient(to bottom, transparent, white)",
              pointerEvents: "none",
            }} />
          </div>

          {/* Recommended */}
          {availableRecs.length > 0 && (
            <div style={{ marginTop: "16px", flexShrink: 0 }}>
              <RecommendedCarousel
                items={availableRecs}
                addedMap={recommendedAdded}
                onAdd={handleAddRecommended}
              />
            </div>
          )}

          {/* Order summary */}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f0f0f0", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "14px", color: "#666" }}>Shipping</span>
              <span style={{ fontSize: "14px", color: shipping === 0 ? "#8a9e1a" : "#1a1a1a", fontWeight: shipping === 0 ? "700" : "400" }}>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "16px", fontWeight: "700" }}>Total</span>
              <span style={{ fontSize: "16px", fontWeight: "700" }}>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setShowPostPurchase(true)}
              className="checkout-btn"
              style={{
                width: "100%", padding: "12px", borderRadius: "12px",
                border: "2px solid #1a1a1a", background: "white",
                fontSize: "16px", fontWeight: "700", cursor: "pointer",
                marginBottom: "10px", color: "#1a1a1a", letterSpacing: "-0.1px",
              }}
            >
              Proceed to checkout
            </button>

            <button
              className="shop-pay-btn"
              style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                border: "none", background: "#5a31f4", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "12px",
              }}
            >
              <ShopPayIcon />
            </button>
          </div>
        </div>
      </div>

      {showPostPurchase && <PostPurchaseModal onClose={() => setShowPostPurchase(false)} />}
    </div>
  );
}
