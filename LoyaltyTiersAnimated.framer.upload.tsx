import { addPropertyControls, ControlType } from "framer"
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"

const ACCENT = "#3901F1"
/** RGB for ACCENT — #3901F1 */
const ACCENT_RGB = "57, 1, 241"
const DOT_SIZE = 16
const LINE_CENTER_X = DOT_SIZE / 2

const THIRD_ORDER_ICON_BASE64_CHUNKS = [
        "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",
]

const THIRD_ORDER_ICON_SRC =
    "data:image/png;base64," + THIRD_ORDER_ICON_BASE64_CHUNKS.join("")

/** Vertical center of `el` relative to `root`'s padding edge (ignores CSS transforms on ancestors). */
function centerYRelativeToRoot(el: HTMLElement, root: HTMLElement): number {
    let top = 0
    let n: HTMLElement | null = el
    while (n && n !== root) {
        top += n.offsetTop
        n = n.offsetParent as HTMLElement | null
    }
    if (n === root) return top + el.offsetHeight / 2
    const er = el.getBoundingClientRect()
    const rr = root.getBoundingClientRect()
    return er.top + er.height / 2 - rr.top
}

const DiscountTagIcon = ({ color }: { color: string }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2.5 2.5h5.8l7.2 7.2-5.8 5.8-7.2-7.2V2.5z" stroke={color} strokeWidth="1.4" fill={color} fillOpacity="0.18" strokeLinejoin="round" />
        <circle cx="5.5" cy="5.5" r="1.1" fill={color} />
        <path d="M8.5 8.5l2.5 2.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
)

const CoinIcon = ({ color }: { color: string }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke={color} strokeWidth="1.4" fill={color} fillOpacity="0.15" />
        <path d="M9 5.5v7M6.5 7.5h5M6.5 10.5h5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
)

const GiftIcon = ({ color }: { color: string }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="8" width="14" height="8" rx="1" stroke={color} strokeWidth="1.4" fill={color} fillOpacity="0.15" />
        <path d="M2 11h14M9 8v8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M9 8C9 8 7 5.5 5.5 5.5 4 5.5 4 7 5.5 7.5 7 8 9 8 9 8z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" strokeLinejoin="round" />
        <path d="M9 8C9 8 11 5.5 12.5 5.5 14 5.5 14 7 12.5 7.5 11 8 9 8 9 8z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" strokeLinejoin="round" />
    </svg>
)

/** Raster composite icon — `color` unused (keeps ORDERS row shape). */
const ThirdOrderIcon = ({ color: _color }: { color: string }) => (
    <img
        src={THIRD_ORDER_ICON_SRC}
        alt=""
        width={32}
        height={32}
        draggable={false}
        style={{ display: "block", objectFit: "contain" }}
    />
)

const ORDERS = [
    { label: "1st order",  reward: "10% discount",                 iconBg: "#ede8f5", iconColor: "#6c4db8", Icon: DiscountTagIcon, cardBg: "#ffffff" },
    { label: "2nd order",  reward: "3% credits",                   iconBg: "#fef3e2", iconColor: "#c97a10", Icon: CoinIcon,        cardBg: "#ffffff" },
    { label: "3rd order",  reward: "3% credits + free scrunchie",  iconBg: "#ffffff", iconColor: "#c97a10", Icon: ThirdOrderIcon,  cardBg: "#ffffff" },
    { label: "4th order",  reward: "Free tote bag",                iconBg: "#e8f5ef", iconColor: "#2d7a4f", Icon: GiftIcon,        cardBg: "#ffffff" },
    { label: "5th order",  reward: "4% credits",                   iconBg: "#fef3e2", iconColor: "#c97a10", Icon: CoinIcon,        cardBg: "#ffffff" },
    { label: "6th order+", reward: "Lifetime 10% discount",        iconBg: "#ede8f5", iconColor: "#6c4db8", Icon: DiscountTagIcon, cardBg: "#ffffff" },
]

const lineRailStyle: CSSProperties = {
    position: "absolute",
    left: `${LINE_CENTER_X}px`,
    transform: "translateX(-50%)",
    width: "2px",
    borderRadius: "1px",
    pointerEvents: "none",
}

/** Viewport size for intersection checks when `rootBounds` is missing (Safari / some embeds). */
function viewportSize(entry: IntersectionObserverEntry): { vh: number; vw: number } {
    const root = entry.rootBounds
    if (root && root.width > 0 && root.height > 0) {
        return { vh: root.height, vw: root.width }
    }
    if (typeof window !== "undefined") {
        return { vh: window.innerHeight, vw: window.innerWidth }
    }
    return { vh: 1, vw: 1 }
}

const VIS_TOL = 3

/** Entire node fits in root, or root is fully covered by the node (taller/wider sections). */
function isSectionFullyRevealed(entry: IntersectionObserverEntry): boolean {
    if (!entry.isIntersecting) return false

    if (entry.intersectionRatio >= 0.98) return true

    const { vh, vw } = viewportSize(entry)
    if (vh <= 0 || vw <= 0) return false

    const br = entry.boundingClientRect
    const ir = entry.intersectionRect
    const fitsInside = br.height <= vh + 1 && br.width <= vw + 1
    if (fitsInside) {
        return ir.height >= br.height - VIS_TOL && ir.width >= br.width - VIS_TOL
    }
    return ir.height >= vh - VIS_TOL && ir.width >= vw - VIS_TOL
}

/** Same rules using layout rects — for sync checks when IO hasn't fired yet / rootBounds null. */
function isElementFullyRevealed(el: HTMLElement): boolean {
    if (typeof window === "undefined") return false
    const vh = window.innerHeight
    const vw = window.innerWidth
    if (vh <= 0 || vw <= 0) return false
    const r = el.getBoundingClientRect()
    if (r.width <= 0 || r.height <= 0) return false
    const fitsInside = r.height <= vh + 1 && r.width <= vw + 1
    if (fitsInside) {
        return (
            r.top >= -VIS_TOL &&
            r.left >= -VIS_TOL &&
            r.bottom <= vh + VIS_TOL &&
            r.right <= vw + VIS_TOL
        )
    }
    const ih = Math.min(r.bottom, vh) - Math.max(r.top, 0)
    const iw = Math.min(r.right, vw) - Math.max(r.left, 0)
    return ih >= vh - VIS_TOL && iw >= vw - VIS_TOL
}

/**
 * Loyalty Tiers Animated
 * @framerIntrinsicWidth 420
 * @framerIntrinsicHeight 500
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function LoyaltyTiersAnimated({
    stepDuration = 600,
}: {
    stepDuration?: number
}) {
    const [activeCount, setActiveCount] = useState(0)
    const [glowIndex, setGlowIndex] = useState(-1)
    const [rail, setRail] = useState<{ top: number; height: number } | null>(null)
    const [sectionFullyInView, setSectionFullyInView] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)
    const columnRef = useRef<HTMLDivElement>(null)
    const dotRefs = useRef<Map<number, HTMLDivElement>>(new Map())
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

    const measureRail = () => {
        const col = columnRef.current
        const first = dotRefs.current.get(0)
        const last = dotRefs.current.get(ORDERS.length - 1)
        if (!col || !first || !last) return
        const yTop = centerYRelativeToRoot(first, col)
        const yBot = centerYRelativeToRoot(last, col)
        setRail({ top: yTop, height: Math.max(0, yBot - yTop) })
    }

    const scheduleMeasure = () => {
        measureRail()
        requestAnimationFrame(() => {
            measureRail()
            requestAnimationFrame(measureRail)
        })
    }

    useLayoutEffect(() => {
        scheduleMeasure()
        const col = columnRef.current
        if (!col) return
        const ro = new ResizeObserver(() => scheduleMeasure())
        ro.observe(col)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const el = rootRef.current
        if (!el) return
        if (typeof IntersectionObserver === "undefined") {
            setSectionFullyInView(true)
            return
        }

        let disconnected = false
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry || disconnected) return
                if (isSectionFullyRevealed(entry)) {
                    disconnected = true
                    io.disconnect()
                    setSectionFullyInView(true)
                }
            },
            {
                threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
                rootMargin: "0px",
            },
        )

        const trySync = () => {
            if (disconnected) return
            if (isElementFullyRevealed(el)) {
                disconnected = true
                io.disconnect()
                setSectionFullyInView(true)
            }
        }

        io.observe(el)
        trySync()
        requestAnimationFrame(trySync)
        requestAnimationFrame(() => requestAnimationFrame(trySync))

        return () => {
            disconnected = true
            io.disconnect()
        }
    }, [])

    const clearAll = () => {
        timersRef.current.forEach(clearTimeout)
        timersRef.current = []
    }

    useEffect(() => {
        if (!sectionFullyInView) return

        const schedule = (fn: () => void, ms: number) => {
            const t = setTimeout(fn, ms)
            timersRef.current.push(t)
        }

        clearAll()
        setActiveCount(0)
        setGlowIndex(-1)

        const startDelay = 400
        ORDERS.forEach((_, i) => {
            schedule(() => {
                setActiveCount(i + 1)
                setGlowIndex(i)
                schedule(() => setGlowIndex(-1), 350)
            }, startDelay + i * stepDuration)
        })

        return () => clearAll()
    }, [stepDuration, sectionFullyInView])

    useLayoutEffect(() => {
        scheduleMeasure()
    }, [activeCount])

    const progress = ORDERS.length <= 1 ? 0 : Math.max(0, Math.min(1, (activeCount - 1) / (ORDERS.length - 1)))
    const fillHeightPx = rail ? rail.height * progress : 0

    const setDotRef = (i: number, el: HTMLDivElement | null) => {
        if (el) dotRefs.current.set(i, el)
        else dotRefs.current.delete(i)
    }

    const glowRing = `0 0 0 5px rgba(${ACCENT_RGB},0.22), 0 0 14px rgba(${ACCENT_RGB},0.55)`
    const cardGlow = `0 0 0 1.5px ${ACCENT}, 0 4px 18px rgba(${ACCENT_RGB},0.20)`

    return (
        <div ref={rootRef} style={{
            background: "transparent",
            borderRadius: "16px",
            padding: "28px 24px 28px 20px",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            overflow: "hidden",
        }}>
            <div
                ref={columnRef}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    width: "100%",
                    maxWidth: "360px",
                }}
            >
                {ORDERS.map((order, i) => {
                    const isActive = i < activeCount
                    const isGlowing = i === glowIndex
                    const { Icon } = order

                    return (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                marginBottom: i < ORDERS.length - 1 ? "10px" : "0",
                                opacity: isActive ? 1 : 0.28,
                                transition: `opacity ${stepDuration * 0.5}ms ease`,
                            }}
                        >
                            <div
                                ref={(el) => setDotRef(i, el)}
                                aria-hidden={!isActive}
                                style={{
                                    width: `${DOT_SIZE}px`,
                                    height: `${DOT_SIZE}px`,
                                    flexShrink: 0,
                                    zIndex: 1,
                                    visibility: isActive ? "visible" : "hidden",
                                    borderRadius: "50%",
                                    background: ACCENT,
                                    transition: `box-shadow 0.3s ease`,
                                    boxShadow: isActive && isGlowing ? glowRing : "none",
                                }}
                            />

                            <div style={{
                                flex: 1,
                                transform: `translateX(${isActive ? 0 : -5}px)`,
                                transition: `transform ${stepDuration * 0.5}ms ease, box-shadow 0.35s ease`,
                                background: order.cardBg,
                                borderRadius: "8px",
                                padding: "10px 14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                boxShadow: isGlowing ? cardGlow : isActive ? "0 2px 8px rgba(0,0,0,0.10)" : "none",
                            }}>
                                <div style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    background: order.iconBg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    overflow: "hidden",
                                    ...(i === 3 ? { transform: "translateY(-3px)" } : {}),
                                }}>
                                    <Icon color={order.iconColor} />
                                </div>

                                <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: "12px", color: "#777", fontWeight: 500, lineHeight: 1.3 }}>{order.label}</p>
                                    <p style={{ margin: 0, fontSize: "14px", color: "#1a1a1a", fontWeight: 500, lineHeight: 1.3 }}>{order.reward}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {rail !== null && rail.height > 0 && (
                    <div style={{
                        ...lineRailStyle,
                        top: `${rail.top}px`,
                        height: `${fillHeightPx}px`,
                        background: ACCENT,
                        transition: `height ${stepDuration * 0.55}ms ease`,
                        zIndex: 0,
                    }} />
                )}
            </div>
        </div>
    )
}

addPropertyControls(LoyaltyTiersAnimated, {
    stepDuration: {
        type: ControlType.Number,
        title: "Step (ms)",
        defaultValue: 600,
        min: 200,
        max: 2000,
        step: 50,
    },
})
