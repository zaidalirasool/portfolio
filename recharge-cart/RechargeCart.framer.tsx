import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

// ── Self-contained styles (injected once) ────────────────────────────────
const RC_ID = "rc-framer-styles"
function CartStyles() {
    useEffect(() => {
        if (document.getElementById(RC_ID)) return
        const el = document.createElement("style")
        el.id = RC_ID
        el.textContent = `
      @keyframes rc-confetti-burst {
        0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.4); opacity: 0; }
      }
      .rc-confetti { position:absolute; width:7px; height:7px; border-radius:2px;
        animation: rc-confetti-burst 0.65s ease-out forwards; pointer-events:none; z-index:50; }
      .rc-scroll { height:100%; overflow-y:auto; scroll-behavior:smooth; }
      .rc-scroll::-webkit-scrollbar { display:none; }
      .rc-scroll { -ms-overflow-style:none; scrollbar-width:none; }
      .rc-qty-stepper:hover { border-color:#1a1a1a !important; }
      .rc-qty-btn:hover { background:#f0f0f0; border-radius:50%; }
      .rc-add-btn:hover { background:#f0f0f0 !important; transform:scale(1.05); }
      .rc-add-btn.rc-added:hover { background:#7a8f18 !important; }
      .rc-checkout-btn:hover { background:#f5f5f5 !important; }
      .rc-shoppay-btn:hover { background:#3d1fb8 !important; }
      .rc-arrow:hover { border-color:#1a1a1a !important; background:#f5f5f5 !important; }
      @keyframes rc-item-enter {
        0%   { opacity:0; max-height:0; transform:translateY(-8px); }
        100% { opacity:1; max-height:500px; transform:translateY(0); }
      }
      .rc-item-wrap { overflow:hidden; animation: rc-item-enter 0.38s cubic-bezier(0.4,0,0.2,1) forwards; }
    `
        document.head.appendChild(el)
    }, [])
    return null
}

// ── Shop Pay logo (official SVG, white) ──────────────────────────────────
const ShopPayLogo = () => (
    <svg width="683" height="164" viewBox="0 0 683 164" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: "22px", width: "auto" }} aria-label="Shop Pay">
        <path fillRule="evenodd" clipRule="evenodd" d="M454.942 0C441.175 0 430.015 11.1602 430.015 24.927V138.295C430.015 152.062 441.175 163.222 454.942 163.222H658.072C671.839 163.222 682.999 152.062 682.999 138.295V24.927C682.999 11.1602 671.839 0 658.072 0H454.942ZM490.023 113.902V85.1661H508.1C524.616 85.1661 533.399 75.9057 533.399 61.872C533.399 47.8383 524.616 39.4371 508.1 39.4371H478.376V113.902H490.023ZM490.023 50.5114H505.427C516.119 50.5114 521.37 54.9029 521.37 62.2539C521.37 69.6049 516.31 73.9964 505.904 73.9964H490.023V50.5114ZM553.933 115.429C562.811 115.429 568.635 111.515 571.308 104.832C572.071 112.279 576.558 116.098 586.296 113.52L586.391 105.596C582.477 105.978 581.714 104.546 581.714 100.441V80.9655C581.714 69.5094 574.172 62.7312 560.233 62.7312C546.486 62.7312 538.562 69.6049 538.562 81.2519H549.255C549.255 75.7148 553.169 72.3734 560.042 72.3734C567.298 72.3734 570.639 75.5239 570.544 80.9655V83.4477L558.229 84.7842C544.386 86.3117 536.748 91.5624 536.748 100.727C536.748 108.269 542.095 115.429 553.933 115.429ZM556.319 106.837C550.305 106.837 547.918 103.591 547.918 100.345C547.918 95.9539 552.882 93.9491 562.62 92.8035L570.257 91.9443C569.78 100.345 564.148 106.837 556.319 106.837ZM621.754 117.625C616.885 129.463 609.057 132.995 596.837 132.995H591.586V123.258H597.219C603.902 123.258 607.148 121.157 610.68 115.143L589.009 64.2587H601.038L616.504 101.396L630.251 64.2587H641.993L621.754 117.625Z" fill="white"/>
        <path d="M57.3945 71.7445C41.4471 68.2852 34.3427 66.9315 34.3427 60.7862C34.3427 55.0063 39.1506 52.127 48.7662 52.127C57.2228 52.127 63.4043 55.8228 67.9545 63.0638C68.2979 63.6225 69.0062 63.8159 69.5857 63.5151L87.5292 54.4476C88.1731 54.1253 88.4092 53.3088 88.0443 52.6857C80.5965 39.7721 66.8384 32.7029 48.7233 32.7029C24.9203 32.7029 10.132 44.4347 10.132 63.0853C10.132 82.8962 28.1398 87.9027 44.1086 91.3621C60.0774 94.8215 67.2033 96.1751 67.2033 102.32C67.2033 108.466 62.0091 111.366 51.6423 111.366C42.0696 111.366 34.9652 106.983 30.6725 98.4742C30.3505 97.8511 29.5993 97.5933 28.9769 97.9156L11.0764 106.79C10.4539 107.112 10.1964 107.864 10.5183 108.509C17.6227 122.797 32.1964 130.833 51.6637 130.833C76.454 130.833 91.4355 119.295 91.4355 100.064C91.4355 80.8335 73.3418 75.2469 57.3945 71.7875V71.7445Z" fill="white"/>
        <path d="M153.551 32.7032C143.377 32.7032 134.384 36.3129 127.924 42.7375C127.516 43.1243 126.85 42.845 126.85 42.2863V1.26785C126.85 0.558781 126.292 0.00012207 125.584 0.00012207H103.133C102.425 0.00012207 101.867 0.558781 101.867 1.26785V128.578C101.867 129.287 102.425 129.845 103.133 129.845H125.584C126.292 129.845 126.85 129.287 126.85 128.578V72.7332C126.85 61.9468 135.114 53.6743 146.253 53.6743C157.393 53.6743 165.463 61.7749 165.463 72.7332V128.578C165.463 129.287 166.021 129.845 166.729 129.845H189.18C189.889 129.845 190.447 129.287 190.447 128.578V72.7332C190.447 49.2695 175.079 32.7246 153.551 32.7246V32.7032Z" fill="white"/>
        <path d="M235.991 29.0505C223.8 29.0505 212.381 32.7893 204.182 38.1825C203.624 38.5477 203.431 39.2998 203.774 39.8799L213.669 56.7901C214.034 57.3917 214.806 57.6066 215.407 57.2413C221.632 53.4811 228.758 51.5258 236.034 51.5688C255.63 51.5688 270.032 65.4063 270.032 83.6917C270.032 99.2697 258.506 110.808 243.889 110.808C231.977 110.808 223.714 103.868 223.714 94.0698C223.714 88.4618 226.096 83.8636 232.299 80.619C232.943 80.2753 233.179 79.4802 232.793 78.8571L223.456 63.0428C223.156 62.5271 222.512 62.2907 221.932 62.5056C209.419 67.1468 200.641 78.3199 200.641 93.3178C200.641 116.008 218.691 132.94 243.868 132.94C273.273 132.94 294.414 112.549 294.414 83.3049C294.414 51.9556 269.817 29.0505 235.991 29.0505Z" fill="white"/>
        <path d="M360.069 32.5311C348.714 32.5311 338.584 36.7211 331.179 44.1126C330.771 44.5208 330.106 44.22 330.106 43.6613V34.7658C330.106 34.0567 329.548 33.498 328.839 33.498H306.968C306.26 33.498 305.702 34.0567 305.702 34.7658V161.882C305.702 162.591 306.26 163.15 306.968 163.15H329.419C330.127 163.15 330.685 162.591 330.685 161.882V120.198C330.685 119.639 331.351 119.36 331.758 119.725C339.142 126.601 348.908 130.619 360.09 130.619C386.426 130.619 406.966 109.282 406.966 81.5642C406.966 53.8461 386.404 32.5096 360.09 32.5096L360.069 32.5311ZM355.84 109.089C340.859 109.089 329.505 97.1637 329.505 81.3923C329.505 65.6209 340.837 53.6957 355.84 53.6957C370.843 53.6957 382.155 65.4275 382.155 81.3923C382.155 97.357 370.994 109.089 355.819 109.089H355.84Z" fill="white"/>
    </svg>
)

// ── Icons ───────────────────────────────────────────────────────────────
const MinusIcon = () => (
    <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
        <path d="M1 1H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)
const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)
const CheckIcon = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6.5 11.5L13 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const ChevronLeft = () => (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
        <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const ChevronRight = () => (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
        <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const TruckIcon = ({ color = "currentColor" }: { color?: string }) => (
    <svg width="19" height="17" viewBox="0 0 15 13" fill="none">
        <path d="M1 1.5h8v8H1V1.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M9 4h2.5l2 2.5v3H9V4z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="3.5" cy="11" r="1.5" stroke={color} strokeWidth="1.3" />
        <circle cx="11" cy="11" r="1.5" stroke={color} strokeWidth="1.3" />
    </svg>
)
const GiftBoxIcon = ({ color = "currentColor" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="6" width="12" height="7" rx="0.5" stroke={color} strokeWidth="1.3" />
        <path d="M7 6v7M1 9.5h12" stroke={color} strokeWidth="1.3" />
        <path d="M4.5 6C3.1 6 2 5.2 2 4.2 2 3.2 3.1 3 4.5 3.8 5.7 4.5 7 6 7 6H4.5z" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
        <path d="M9.5 6C10.9 6 12 5.2 12 4.2 12 3.2 10.9 3 9.5 3.8 8.3 4.5 7 6 7 6H9.5z" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    </svg>
)
const SupplementBottle = () => (
    <svg width="52" height="68" viewBox="0 0 52 68" fill="none">
        <rect x="16" y="6" width="20" height="6" rx="3" fill="#4a5568" />
        <rect x="10" y="10" width="32" height="52" rx="8" fill="#2d6a4f" />
        <rect x="14" y="18" width="24" height="28" rx="3" fill="white" fillOpacity="0.9" />
        <text x="26" y="30" textAnchor="middle" fontSize="6" fontWeight="700" fill="#2d6a4f" fontFamily="sans-serif">COGNITIVE</text>
        <text x="26" y="39" textAnchor="middle" fontSize="5" fill="#2d6a4f" fontFamily="sans-serif">ENHANCER</text>
        <rect x="14" y="50" width="24" height="3" rx="1.5" fill="white" fillOpacity="0.3" />
    </svg>
)

// ── Tiered progress bar ──────────────────────────────────────────────────
const TIERS = [
    { threshold: 40, label: "Free gift", icon: "gift" },
    { threshold: 80, label: "Free shipping", icon: "truck" },
]
const TIER_MAX = 120
const MARKER = 32

function TieredProgress({ total }: { total: number }) {
    const t1Done = total >= TIERS[0].threshold
    const t2Done = total >= TIERS[1].threshold
    const pct = t2Done ? 100 : Math.min((total / TIER_MAX) * 100, 100)
    const t1Pos = (TIERS[0].threshold / TIER_MAX) * 100  // 33.3%
    const t2Pos = (TIERS[1].threshold / TIER_MAX) * 100  // 66.7%

    let message: React.ReactNode
    if (!t1Done) {
        const rem = (TIERS[0].threshold - total).toFixed(2)
        message = <>Spend <strong>${rem}</strong> more for a free gift 🎁</>
    } else if (!t2Done) {
        const rem = (TIERS[1].threshold - total).toFixed(2)
        message = <>Spend <strong>${rem}</strong> more for free shipping 🚚</>
    } else {
        message = <>🎉 You've unlocked free shipping!</>
    }

    const markerStyle = (done: boolean): React.CSSProperties => ({
        position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
        width: `${MARKER}px`, height: `${MARKER}px`, borderRadius: "50%",
        background: done ? "#8a9e1a" : "#f9fce8",
        border: `1px solid ${done ? "#8a9e1a" : "#d0d0d0"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        lineHeight: 0, transition: "all 0.3s ease", zIndex: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    })

    return (
        <div style={{ border: "1.5px solid #8a9e1a", borderRadius: "8px", padding: "12px", marginBottom: "16px", background: "#f9fce8", direction: "ltr" }}>
            <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "500", color: "#2d2d2d", textAlign: "center", height: "20px", lineHeight: "20px", overflow: "hidden", whiteSpace: "nowrap" }}>
                {message}
            </p>
            <div style={{ position: "relative", height: `${MARKER}px`, margin: "0" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: "8px", background: "#e2e8c0", borderRadius: "4px" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: "#8a9e1a", borderRadius: "4px", transition: "width 0.6s ease" }} />
                </div>
                <div style={{ ...markerStyle(t1Done), left: `${t1Pos}%` }}>
                    <div style={{ marginBottom: "3px" }}><GiftBoxIcon color={t1Done ? "white" : "#bbb"} /></div>
                </div>
                <div style={{ ...markerStyle(t2Done), left: `${t2Pos}%` }}>
                    <TruckIcon color={t2Done ? "white" : "#bbb"} />
                </div>
            </div>
            <div style={{ position: "relative", height: "18px", margin: "4px 0 0" }}>
                <div style={{ position: "absolute", left: `${t1Pos}%`, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#2d2d2d" }}>${TIERS[0].threshold}.00</p>
                </div>
                <div style={{ position: "absolute", left: `${t2Pos}%`, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#2d2d2d" }}>${TIERS[1].threshold}.00</p>
                </div>
            </div>
        </div>
    )
}

// ── Subscribe & Save ─────────────────────────────────────────────────────
const SUBSCRIBE_OPTIONS = [
    { value: "every 1 month", label: "Every 1 month", discount: "10% OFF", pct: 0.10 },
    { value: "every 2 months", label: "Every 2 months", discount: "15% OFF", pct: 0.15 },
    { value: "every 3 months", label: "Every 3 months", discount: "20% OFF", pct: 0.20 },
]

const getDiscountedPrice = (price: number, frequency: string) => {
    const opt = SUBSCRIBE_OPTIONS.find(o => o.value === frequency)
    return opt ? price * (1 - opt.pct) : price
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
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
                transition: "background 0.2s ease",
                flexShrink: 0,
            }}
        >
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
        </button>
    )
}

// ── Cart item types ───────────────────────────────────────────────────────
interface CartItemData {
    id: number
    name: string
    size: string
    price: number
    originalPrice?: number
    qty: number
    isSubscription: boolean
    subscriptionLabel?: string
    frequency: string
    canUnsubscribe: boolean
    image: string
    isToteBag?: boolean
}

// ── Quantity selector ─────────────────────────────────────────────────────
const qtyBtnStyle: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "0", color: "#1a1a1a", lineHeight: 1,
}

function QuantitySelector({ qty, onDecrement, onIncrement }: { qty: number; onDecrement: () => void; onIncrement: () => void }) {
    return (
        <div className="rc-qty-stepper" style={{
            display: "flex", alignItems: "center", gap: "10px",
            border: "1.5px solid #d0d0d0", borderRadius: "999px",
            padding: "5px 8px", background: "#fff", transition: "border-color 0.15s",
        }}>
            <button onClick={onDecrement} className="rc-qty-btn" style={qtyBtnStyle}><MinusIcon /></button>
            <span style={{ fontSize: "15px", fontWeight: "600", minWidth: "14px", textAlign: "center", color: "#1a1a1a" }}>{qty}</span>
            <button onClick={onIncrement} className="rc-qty-btn" style={qtyBtnStyle}><PlusIcon /></button>
        </div>
    )
}

const CONFETTI_COLORS = ["#8a9e1a", "#c5d92e", "#f4c430", "#e8603c", "#5b9bd5", "#b07fd4", "#f28b82"]

function CartItem({ item, isNew, onQtyChange, onSubscribeToggle, onUnsubscribe, onFrequencyChange }: {
    item: CartItemData
    isNew?: boolean
    onQtyChange: (id: number, delta: number) => void
    onSubscribeToggle: (id: number) => void
    onUnsubscribe: (id: number) => void
    onFrequencyChange: (id: number, freq: string) => void
}) {
    const [particles, setParticles] = useState<Array<{ id: number; color: string; tx: string; ty: string; rot: string; size: string; delay: string }>>([])

    const handleToggle = () => {
        if (!item.isSubscription) {
            const newParticles = Array.from({ length: 20 }, (_, i) => {
                const angle = (i / 20) * 2 * Math.PI + (Math.random() - 0.5) * 0.6
                const dist = 40 + Math.random() * 55
                return {
                    id: Date.now() + i,
                    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    tx: `${Math.cos(angle) * dist}px`,
                    ty: `${Math.sin(angle) * dist - 20}px`,
                    rot: `${(Math.random() - 0.5) * 280}deg`,
                    size: `${5 + Math.random() * 4}px`,
                    delay: `${Math.random() * 80}ms`,
                }
            })
            setParticles(newParticles)
            setTimeout(() => setParticles([]), 750)
            onSubscribeToggle(item.id)
        } else {
            onUnsubscribe(item.id)
        }
    }

    return (
        <div className={isNew ? "rc-item-wrap" : ""}>
        <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{
                    width: "76px", height: "76px", borderRadius: "8px",
                    background: "#f2f2f2", flexShrink: 0, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    outline: "0.8px solid rgba(0,0,0,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>

                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "6px" }}>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a1a", lineHeight: 1.2 }}>{item.name}</p>
                    {!item.isToteBag && (
                        <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: 1.3 }}>{item.size}</p>
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

                <div style={{ flexShrink: 0, textAlign: "right" }}>
                    {item.isToteBag ? (
                        <>
                            <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1a1a1a", letterSpacing: "-0.3px" }}>FREE</p>
                            <p style={{ margin: 0, fontSize: "13px", color: "#aaa", textDecoration: "line-through" }}>${item.originalPrice?.toFixed(2)}</p>
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
                <div style={{ marginTop: "12px", position: "relative" }}>
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="rc-confetti"
                            style={{
                                background: p.color, width: p.size, height: p.size,
                                top: "50%", left: "80%",
                                marginTop: `-${parseFloat(p.size) / 2}px`,
                                marginLeft: `-${parseFloat(p.size) / 2}px`,
                                ["--tx" as string]: p.tx,
                                ["--ty" as string]: p.ty,
                                ["--rot" as string]: p.rot,
                                animationDelay: p.delay,
                            }}
                        />
                    ))}

                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 14px",
                        borderRadius: item.isSubscription ? "8px 8px 0 0" : "8px",
                        border: "1.5px solid #d0d0d0",
                        borderBottom: item.isSubscription ? "1px solid #f0f0f0" : "1.5px solid #d0d0d0",
                        background: "white", transition: "border-radius 0.15s",
                    }}>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>Subscribe & save up to 20%</span>
                        <Toggle on={item.isSubscription} onToggle={handleToggle} />
                    </div>

                    {item.isSubscription && (
                        <div style={{
                            border: "1.5px solid #d0d0d0", borderTop: "none",
                            borderRadius: "0 0 8px 8px", padding: "10px",
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
                                        padding: "11px 14px", borderRadius: "8px", textAlign: "left",
                                        border: `1.5px solid ${item.frequency === opt.value ? "#8a9e1a" : "#e8e8e8"}`,
                                        background: item.frequency === opt.value ? "#f9fce8" : "white",
                                        cursor: "pointer", width: "100%",
                                        transition: "border-color 0.15s, background 0.15s",
                                    }}
                                >
                                    <div style={{
                                        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                                        border: `2px solid ${item.frequency === opt.value ? "#8a9e1a" : "#ccc"}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        {item.frequency === opt.value && (
                                            <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#8a9e1a" }} />
                                        )}
                                    </div>
                                    <span style={{ flex: 1, fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>{opt.label}</span>
                                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#6a7a14" }}>{opt.discount}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
    )
}

interface RecItem {
    id: number
    name: string
    size: string
    price: number
    image: string
    isToteBag?: boolean
}

function RecommendedItem({ item, onAdd, added }: { item: RecItem; onAdd: () => void; added: boolean }) {
    return (
        <div style={{
            border: "1.5px solid #e8e8e8", borderRadius: "8px", padding: "12px 14px",
            display: "flex", alignItems: "center", gap: "12px", background: "#FAF8F6",
        }}>
            <div style={{
                width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", flexShrink: 0,
                background: "#f2f2f2", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                outline: "0.8px solid rgba(0,0,0,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "700", color: "#1a1a1a" }}>{item.name}</p>
                <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "700", color: "#1a1a1a" }}>${item.price.toFixed(2)}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.size}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <button
                    onClick={onAdd}
                    className={added ? "rc-add-btn rc-added" : "rc-add-btn"}
                    style={{
                        background: added ? "#8a9e1a" : "white",
                        border: `1.5px solid ${added ? "#8a9e1a" : "#1a1a1a"}`,
                        cursor: added ? "default" : "pointer",
                        padding: "5px 12px", borderRadius: "20px",
                        display: "flex", alignItems: "center", gap: "4px",
                        fontSize: "13px", fontWeight: "600",
                        color: added ? "white" : "#1a1a1a", transition: "all 0.2s",
                    }}
                >
                    {added ? <><CheckIcon size={13} color="white" /> Added</> : "Add now"}
                </button>
            </div>
        </div>
    )
}

function RecommendedCarousel({ items, addedMap, onAdd }: { items: RecItem[]; addedMap: Record<number, boolean>; onAdd: (id: number) => void }) {
    const [index, setIndex] = useState(0)
    const outerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    useEffect(() => {
        if (!outerRef.current) return
        const el = outerRef.current
        const update = () => setContainerWidth(el.offsetWidth)
        update()
        const ro = new ResizeObserver(update)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        setIndex(i => Math.min(i, Math.max(0, items.length - 1)))
    }, [items.length])

    const peek = 64, gap = 12
    const cardWidth = containerWidth ? containerWidth - peek : 0
    const translateX = -(index * (cardWidth + gap))

    return (
        <div ref={outerRef}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#555" }}>Recommended for you:</p>
                <div style={{ display: "flex", gap: "4px" }}>
                    {([[-1, ChevronLeft], [1, ChevronRight]] as [number, React.FC][]).map(([dir, Icon]) => {
                        const disabled = dir === -1 ? index === 0 : index === items.length - 1
                        return (
                            <button
                                key={dir}
                                onClick={() => setIndex(i => Math.max(0, Math.min(items.length - 1, i + dir)))}
                                disabled={disabled}
                                className={disabled ? "" : "rc-arrow"}
                                style={{
                                    width: "24px", height: "24px", borderRadius: "50%",
                                    border: "1.5px solid #d0d0d0", background: "white",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: disabled ? "default" : "pointer",
                                    opacity: disabled ? 0.3 : 1, transition: "all 0.15s", padding: 0,
                                }}
                            ><Icon /></button>
                        )
                    })}
                </div>
            </div>
            <div style={{ overflow: "hidden", marginRight: "-24px" }}>
                <div style={{ display: "flex", gap: `${gap}px`, transform: `translateX(${translateX}px)`, transition: "transform 0.3s ease" }}>
                    {items.map((item, i) => (
                        <div key={item.id} style={{ width: `${i === items.length - 1 ? cardWidth + peek : cardWidth}px`, flexShrink: 0 }}>
                            <RecommendedItem item={item} added={!!addedMap[item.id]} onAdd={() => onAdd(item.id)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Post-purchase modal ───────────────────────────────────────────────────
function PostPurchaseModal({ onClose }: { onClose: () => void }) {
    const [selected, setSelected] = useState("subscribe")
    const [seconds, setSeconds] = useState(276)

    useEffect(() => {
        const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000)
        return () => clearInterval(t)
    }, [])

    const mins = Math.floor(seconds / 60)
    const secs = String(seconds % 60).padStart(2, "0")

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ width: "360px", borderRadius: "44px", background: "#1a1a1a", padding: "12px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                    <div style={{ width: "120px", height: "28px", background: "#1a1a1a", borderRadius: "14px", position: "relative", zIndex: 2 }}>
                        <div style={{ position: "absolute", top: "6px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "16px", background: "#000", borderRadius: "8px" }} />
                    </div>
                </div>
                <div style={{ background: "white", borderRadius: "36px", overflow: "hidden" }}>
                    <div style={{ background: "#2d6a4f", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ color: "white", fontSize: "18px", fontWeight: "800", fontFamily: "Georgia, serif" }}>bettermel<span style={{ fontStyle: "italic" }}>o</span>n</span>
                    </div>
                    <div style={{ padding: "24px 20px 20px", background: "white" }}>
                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #2d6a4f", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                <CheckIcon size={20} color="#2d6a4f" />
                            </div>
                            <h2 style={{ margin: "0 0 12px", fontSize: "18px", fontWeight: "800", color: "#1a1a1a" }}>You've paid for your order</h2>
                            <div style={{ height: "1px", background: "#e8e8e8", margin: "0 0 16px" }} />
                            <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#555" }}>Before you go, add Cognitive Enhancer to your order and save 15%</p>
                            {seconds > 0 && (
                                <span style={{ display: "inline-block", background: "#ffe0e0", color: "#c0392b", fontSize: "12px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>
                                    Ends in {mins}m {secs}s
                                </span>
                            )}
                        </div>
                        <div style={{ border: "1.5px solid #e8e8e8", borderRadius: "8px", padding: "14px", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                <SupplementBottle />
                                <div>
                                    <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "700" }}>Cognitive Enhancer</p>
                                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>180 softgels</p>
                                </div>
                            </div>
                            <label
                                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "8px", border: selected === "once" ? "2px solid #2d6a4f" : "1.5px solid #e0e0e0" }}
                                onClick={() => setSelected("once")}
                            >
                                <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${selected === "once" ? "#2d6a4f" : "#ccc"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {selected === "once" && <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#2d6a4f" }} />}
                                </div>
                                <span style={{ flex: 1, fontSize: "13px" }}>One-time purchase</span>
                                <span style={{ fontSize: "14px", fontWeight: "700" }}>$25.20</span>
                            </label>
                            <div style={{ border: selected === "subscribe" ? "2px solid #2d6a4f" : "1.5px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", cursor: "pointer", background: selected === "subscribe" ? "#f0faf5" : "white" }} onClick={() => setSelected("subscribe")}>
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
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #ccc", background: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", color: "#555" }}>No, thank you</button>
                            <button onClick={onClose} style={{ flex: 1.5, padding: "12px", borderRadius: "8px", border: "none", background: "#8a9e1a", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Add to order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────
interface Props {
    signatureBlendImage: string
    decafBlendImage: string
    singleOriginImage: string
    worldAtlasImage: string
}

export default function RechargeCart({ signatureBlendImage, decafBlendImage, singleOriginImage, worldAtlasImage }: Props) {
    const initialItems: CartItemData[] = [
        {
            id: 1, name: "Signature Blend", size: "12oz (340g)", price: 24.95,
            qty: 1, isSubscription: false, subscriptionLabel: "Subscribe & Save 15% Today",
            frequency: "every 1 month", canUnsubscribe: true,
            image: signatureBlendImage || "https://i.imgur.com/6AZR7d6.jpeg",
        },
    ]

    const recommendedItems: RecItem[] = [
        { id: 3, name: "Decaf Blend", size: "12oz (340g)", price: 24.95, image: decafBlendImage || "https://i.imgur.com/Bjcv82j.jpeg" },
        { id: 4, name: "Single Origin", size: "12oz (340g)", price: 21.21, image: singleOriginImage || "https://i.imgur.com/f5FmFQs.jpeg" },
    ]

    const TOTE_BAG_ITEM: CartItemData = {
        id: 5, name: "The World Atlas of Coffee", size: "Free gift 🎁", price: 0, originalPrice: 24.95,
        qty: 1, isSubscription: false, frequency: "every 1 month",
        canUnsubscribe: false,
        image: worldAtlasImage || "https://i.imgur.com/k3evBTj.jpeg",
        isToteBag: true,
    }

    const [items, setItems] = useState<CartItemData[]>(initialItems)
    const [recommendedAdded, setRecommendedAdded] = useState<Record<number, boolean>>({})
    const [showPostPurchase, setShowPostPurchase] = useState(false)

    // Track which item ids have already been rendered so we only animate truly new items.
    // Initialized with the ids of the initial items so they never get the enter animation.
    const seenItemIdsRef = useRef(new Set<number>(initialItems.map(i => i.id)))
    useEffect(() => {
        items.forEach(i => seenItemIdsRef.current.add(i.id))
    }, [items])

    const handleQtyChange = (id: number, delta: number) => {
        setItems(prev => {
            const item = prev.find(i => i.id === id)
            if (!item) return prev
            const newQty = item.qty + delta
            if (newQty < 1) {
                const isRec = recommendedItems.some(r => r.id === id)
                if (isRec) setRecommendedAdded(a => { const next = { ...a }; delete next[id]; return next })
                return prev.filter(i => i.id !== id)
            }
            return prev.map(i => i.id === id ? { ...i, qty: newQty } : i)
        })
    }

    const handleSubscribeToggle = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, isSubscription: true } : i))
    const handleUnsubscribe = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, isSubscription: false } : i))
    const handleFrequencyChange = (id: number, freq: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, frequency: freq } : i))

    const handleAddRecommended = (id: number) => {
        const rec = recommendedItems.find(r => r.id === id)
        if (!rec) return
        setRecommendedAdded(prev => ({ ...prev, [id]: true }))
        setItems(prev => [...prev, { ...rec, qty: 1, isSubscription: false, frequency: "every 1 month", canUnsubscribe: true }])
    }

    const subtotal = items.reduce((sum, i) => {
        const price = i.isSubscription ? getDiscountedPrice(i.price, i.frequency) : i.price
        return sum + price * i.qty
    }, 0)

    const availableRecs = recommendedItems.filter(r => !recommendedAdded[r.id])

    useEffect(() => {
        const unlocked = subtotal >= TIERS[0].threshold
        setItems(prev => {
            const hasTote = prev.some(i => i.isToteBag)
            if (unlocked && !hasTote) return [...prev, TOTE_BAG_ITEM]
            if (!unlocked && hasTote) return prev.filter(i => !i.isToteBag)
            return prev
        })
    }, [subtotal])

    const shipping = subtotal >= TIERS[1].threshold ? 0 : 4.99
    const total = subtotal + shipping

    return (
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", display: "inline-block", direction: "ltr" }}>
            <CartStyles />
            <div style={{ background: "#c5d92e", borderRadius: "8px", padding: "32px 196px" }}>
                <div style={{ background: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", width: "472px", height: "944px" }}>
                    <h1 style={{ margin: "0 0 16px", fontSize: "20px", fontWeight: "800", color: "#1a1a1a", flexShrink: 0 }}>Your shopping cart</h1>
                    <div style={{ flexShrink: 0 }}>
                        <TieredProgress total={subtotal} />
                    </div>
                    <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
                        <div className="rc-scroll">
                            {items.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    isNew={!seenItemIdsRef.current.has(item.id)}
                                    onQtyChange={handleQtyChange}
                                    onSubscribeToggle={handleSubscribeToggle}
                                    onUnsubscribe={handleUnsubscribe}
                                    onFrequencyChange={handleFrequencyChange}
                                />
                            ))}
                        </div>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "56px", background: "linear-gradient(to bottom, transparent, white)", pointerEvents: "none" }} />
                    </div>
                    {availableRecs.length > 0 && (
                        <div style={{ marginTop: "16px", flexShrink: 0 }}>
                            <RecommendedCarousel items={availableRecs} addedMap={recommendedAdded} onAdd={handleAddRecommended} />
                        </div>
                    )}
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
                            className="rc-checkout-btn"
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #1a1a1a", background: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "10px", color: "#1a1a1a", letterSpacing: "-0.1px" }}
                        >
                            Proceed to checkout
                        </button>
                        <button
                            className="rc-shoppay-btn"
                            style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "none", background: "#5a31f4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <ShopPayLogo />
                        </button>
                    </div>
                </div>
            </div>
            {showPostPurchase && <PostPurchaseModal onClose={() => setShowPostPurchase(false)} />}
        </div>
    )
}

addPropertyControls(RechargeCart, {
    signatureBlendImage: {
        type: ControlType.Image,
        title: "Signature Blend",
    },
    decafBlendImage: {
        type: ControlType.Image,
        title: "Decaf Blend",
    },
    singleOriginImage: {
        type: ControlType.Image,
        title: "Single Origin",
    },
    worldAtlasImage: {
        type: ControlType.Image,
        title: "World Atlas (gift)",
    },
})
