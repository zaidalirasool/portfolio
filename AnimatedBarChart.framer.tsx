import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView } from "framer-motion"
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react"

const INK = "#191D48"
const MUTED = "#606373"
const ACCENT = "#3901F1"
const CANVAS = "#9680E0"
const STICKER = "#D63333"
const DESIGN_WIDTH = 2004
const DESIGN_HEIGHT = 654.64
const CARD_RADIUS = 8
const BAR_RADIUS = 8
const SHADOW_GUTTER = 16

interface AnimatedBarChartProps {
    duration: number
    stagger: number
    startDelay: number
    background: string
    style?: CSSProperties
}

type BarSpec = {
    className: string
    height: number
    width: number
    color: string
    label: string
    valueLabel?: string
    valueColor?: string
    valueHeight?: number
    valueLineHeight?: number
}

const axisLabels = ["50%", "40%", "30%", "20%", "10%", "0%"]

const crossSellValueStyle = {
    valueColor: "#4D5164",
    valueHeight: 30,
    valueLineHeight: 29.48,
}

const barGroups: Array<{ className: string; height: number; bars: BarSpec[] }> = [
    {
        className: "bar",
        height: 377,
        bars: [
            { className: "barChild", height: 73, width: 156, color: ACCENT, label: "Upsell All, Guided wizard", valueLabel: "≈9%" },
            { className: "barItem", height: 333, width: 156, color: CANVAS, label: "Upsell All, Canvas builder", valueLabel: "≈38%" },
        ],
    },
    {
        className: "bar2",
        height: 411,
        bars: [
            { className: "barInner", height: 200, width: 156, color: ACCENT, label: "Cross-Sell, Guided wizard", valueLabel: "≈22%", ...crossSellValueStyle },
            { className: "rectangleDiv", height: 411, width: 156, color: CANVAS, label: "Cross-Sell, Canvas builder", valueLabel: "≈47%", ...crossSellValueStyle },
        ],
    },
    {
        className: "bar3",
        height: 365,
        bars: [
            { className: "barChild2", height: 111, width: 156, color: ACCENT, label: "Subscription Widget, Guided wizard", valueLabel: "≈11.7%", valueColor: "#4D5164", valueHeight: 30 },
            { className: "barChild3", height: 111, width: 156, color: CANVAS, label: "Subscription Widget, Canvas builder", valueLabel: "≈11.7%", valueColor: "#4D5164", valueHeight: 30 },
        ],
    },
]

const stickers = [
    { className: "xSticker", label: "2.2x sticker", left: 932, top: 594.64, width: 110, zIndex: 1, textAlign: "left" as const },
    { className: "xSticker2", label: "4.2x sticker", left: 278, top: 594.64, width: 110, zIndex: 2, textAlign: "left" as const },
    { className: "noChange", label: "No change", left: 1607, top: 594.64, width: 102, zIndex: 3, textAlign: "right" as const },
]

const labels = ["Upsell All", "Cross-Sell", "Subscription Widget"]

function useFitScale(ref: React.RefObject<HTMLDivElement | null>) {
    const [scale, setScale] = useState(1)

    useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return

        const measure = () => {
            const rect = el.getBoundingClientRect()
            if (rect.width <= 0 || rect.height <= 0) return
            const availableWidth = Math.max(0, rect.width - SHADOW_GUTTER * 2)
            const availableHeight = Math.max(0, rect.height - SHADOW_GUTTER * 2)
            setScale(Math.min(availableWidth / DESIGN_WIDTH, availableHeight / DESIGN_HEIGHT))
        }

        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])

    return scale
}

function ToggleSelector({ color }: { color: string }) {
    return (
        <div
            style={{
                height: 22,
                width: 22,
                position: "relative",
                borderRadius: 33.16,
                overflow: "hidden",
                flexShrink: 0,
            }}
        >
            <div style={{ position: "absolute", inset: 0 }}>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 46.05,
                        backgroundColor: color,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        height: "80%",
                        width: "44.55%",
                        top: "10%",
                        right: "5.45%",
                        bottom: "10%",
                        left: "50%",
                        boxShadow: "0px 1.8421878814697266px 7.37px rgba(25, 29, 72, 0.2)",
                        borderRadius: 46.05,
                        backgroundColor: "#fff",
                        display: "none",
                    }}
                />
            </div>
        </div>
    )
}

function LegendElement({ color, children, gap = 14.7 }: { color: string; children: ReactNode; gap?: number }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap }}>
            <ToggleSelector color={color} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <div
                    style={{
                        alignSelf: "stretch",
                        position: "relative",
                        lineHeight: "22px",
                        flexShrink: 0,
                    }}
                >
                    {children}
                </div>
                <div
                    style={{
                        width: 2571.7,
                        position: "relative",
                        fontSize: 25.79,
                        lineHeight: "36.84px",
                        color: "#6e7381",
                        display: "none",
                        flexShrink: 0,
                    }}
                >
                    Optional element-level helper text lorem ipsum dolor sit.
                </div>
                <div style={{ width: 2571.7, height: 29.5, position: "relative", display: "none", flexShrink: 0 }} />
            </div>
        </div>
    )
}

function Frame3860Legend() {
    return (
        <div
            style={{
                width: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                textAlign: "left",
                fontSize: 22,
                color: INK,
                fontFamily: "Avenir, Arial, sans-serif",
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <LegendElement color={ACCENT}>Guided wizard</LegendElement>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <LegendElement color="#9C80F8" gap={8}>
                        Canvas builder
                    </LegendElement>
                </div>
            </div>
        </div>
    )
}

function AxisLine({ label, wideLabel = false, tall = false }: { label: string; wideLabel?: boolean; tall?: boolean }) {
    return (
        <div
            style={{
                alignSelf: "stretch",
                height: tall ? 31.3 : 27.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 14.7,
            }}
        >
            <div
                style={{
                    width: wideLabel ? 64.5 : undefined,
                    position: "relative",
                    lineHeight: "29.48px",
                    display: wideLabel ? "inline-block" : undefined,
                    flexShrink: 0,
                }}
            >
                {label}
            </div>
            <div
                aria-hidden="true"
                style={{
                    height: 0,
                    width: wideLabel ? undefined : 1851,
                    flex: wideLabel ? 1 : undefined,
                    position: "relative",
                    borderTop: "1.8px dashed #F0F0F3",
                    borderImage: "repeating-linear-gradient(to right, #F0F0F3 0 4px, transparent 4px 8px) 1",
                    maxWidth: "100%",
                    overflow: "hidden",
                    maxHeight: "100%",
                    flexShrink: 0,
                }}
            />
        </div>
    )
}

/**
 * Animated Bar Chart
 *
 * Uses the supplied Graph layout and animates each bar upward from the x-axis.
 *
 * @framerIntrinsicWidth 2004
 * @framerIntrinsicHeight 678
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function AnimatedBarChart(props: AnimatedBarChartProps) {
    const {
        duration = 1700,
        stagger = 160,
        startDelay = 260,
        background = "#FFFFFF",
        style,
    } = props

    const rootRef = useRef<HTMLDivElement>(null)
    const scale = useFitScale(rootRef)
    const isStatic = useIsStaticRenderer()
    const inView = useInView(rootRef, { amount: 0.45, once: true, margin: "0px 0px -8% 0px" })
    const [hasStarted, setHasStarted] = useState(isStatic)

    useEffect(() => {
        if (isStatic || inView) setHasStarted(true)
    }, [inView, isStatic])

    const barTransition = useMemo(
        () => ({
            duration: duration / 1000,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }),
        [duration],
    )

    return (
        <div
            ref={rootRef}
            style={{
                width: "100%",
                height: "100%",
                minWidth: 320,
                minHeight: 220,
                position: "relative",
                overflow: "hidden",
                ...style,
            }}
            aria-label="Animated comparison bar chart"
        >
            <div
                style={{
                    width: DESIGN_WIDTH,
                    height: DESIGN_HEIGHT,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    transformOrigin: "center",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        boxShadow: "0px 1.8421878814697266px 7.37px rgba(25, 29, 72, 0.2)",
                        borderRadius: CARD_RADIUS,
                        backgroundColor: background,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: 36,
                        boxSizing: "border-box",
                        isolation: "isolate",
                        gap: 18.4,
                        textAlign: "left",
                        fontSize: 20,
                        color: STICKER,
                        fontFamily: "Avenir, Arial, sans-serif",
                    }}
                >
                    <div
                        style={{
                            alignSelf: "stretch",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 32,
                            zIndex: 0,
                            flexShrink: 0,
                            fontSize: 25.79,
                            color: INK,
                        }}
                    >
                        <Frame3860Legend />

                        <div
                            style={{
                                width: 1932,
                                height: 501.2,
                                position: "relative",
                                flexShrink: 0,
                                textAlign: "right",
                                fontSize: 22.11,
                                color: MUTED,
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0.16,
                                    left: 0,
                                    width: 1931,
                                    height: 470,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    justifyContent: "space-between",
                                    gap: 20,
                                }}
                            >
                                {axisLabels.map((label, index) => (
                                    <AxisLine
                                        key={label}
                                        label={label}
                                        wideLabel={index >= 2}
                                        tall={index === 4}
                                    />
                                ))}
                            </div>

                            <div
                                style={{
                                    position: "absolute",
                                    top: 471.16,
                                    left: 69.97,
                                    display: "flex",
                                    alignItems: "flex-start",
                                    padding: "0 180px",
                                    gap: 553,
                                    textAlign: "left",
                                }}
                            >
                                {labels.map((label) => (
                                    <div key={label} style={{ position: "relative", lineHeight: "29.48px" }}>
                                        {label}
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 79.52,
                                    width: 1852,
                                    height: 455,
                                    display: "flex",
                                    alignItems: "flex-end",
                                    padding: "0 56px",
                                    boxSizing: "border-box",
                                    gap: 323,
                                }}
                            >
                                {barGroups.map((group, groupIndex) => (
                                    <div
                                        key={group.className}
                                        style={{
                                            height: group.height,
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "flex-end",
                                            gap: 16,
                                        }}
                                    >
                                        {group.bars.map((bar, barIndex) => {
                                            const delay =
                                                (startDelay + (groupIndex * 2 + barIndex) * stagger) / 1000

                                            return (
                                                <motion.div
                                                    key={bar.className}
                                                    initial={false}
                                                    animate={{ scaleY: hasStarted ? 1 : 0 }}
                                                    transition={{ ...barTransition, delay: hasStarted ? delay : 0 }}
                                                    style={{
                                                        height: bar.height,
                                                        width: bar.width,
                                                        position: "relative",
                                                        borderRadius: `${BAR_RADIUS}px ${BAR_RADIUS}px 0 0`,
                                                        backgroundColor: bar.color,
                                                        transformOrigin: "bottom center",
                                                        willChange: "transform",
                                                    }}
                                                    aria-label={bar.label}
                                                />
                                            )
                                        })}

                                        {group.bars.map((bar, barIndex) => {
                                            if (!bar.valueLabel) return null

                                            const x = barGroups[groupIndex].bars
                                                .slice(0, barIndex)
                                                .reduce((sum, prev) => sum + prev.width + 16, 0)
                                            const delay =
                                                (startDelay + (groupIndex * 2 + barIndex) * stagger) / 1000

                                            return (
                                                <motion.div
                                                    key={`${bar.className}-value`}
                                                    initial={false}
                                                    animate={{
                                                        opacity: hasStarted ? 1 : 0,
                                                        y: hasStarted ? -(bar.height + 4) : 0,
                                                    }}
                                                    transition={{ ...barTransition, delay: hasStarted ? delay : 0 }}
                                                    style={{
                                                        width: bar.width,
                                                        height: bar.valueHeight ?? 24,
                                                        position: "absolute",
                                                        left: x,
                                                        bottom: 0,
                                                        color: bar.valueColor ?? INK,
                                                        fontSize: 20,
                                                        fontFamily: "Avenir, Arial, sans-serif",
                                                        fontWeight: 900,
                                                        lineHeight: `${bar.valueLineHeight ?? bar.valueHeight ?? 24}px`,
                                                        textAlign: "center",
                                                        display: "inline-block",
                                                        pointerEvents: "none",
                                                        willChange: "transform, opacity",
                                                        zIndex: 4,
                                                    }}
                                                >
                                                    {bar.valueLabel}
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            style={{
                                width: 1834.8,
                                display: "none",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                alignContent: "flex-start",
                                gap: 14.7,
                                flexShrink: 0,
                            }}
                        />
                    </div>

                    {stickers.map((sticker, index) => (
                        <motion.div
                            key={sticker.label}
                            initial={false}
                            animate={{
                                opacity: hasStarted ? 1 : 0,
                                scale: hasStarted ? 1 : 0.68,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 360,
                                damping: 16,
                                mass: 0.72,
                                delay: hasStarted ? (startDelay + duration * 0.6 + index * 130) / 1000 : 0,
                            }}
                            style={{
                                width: sticker.width,
                                height: 24,
                                position: "absolute",
                                margin: "0",
                                top: sticker.top,
                                left: sticker.left,
                                lineHeight: "24px",
                                fontWeight: 900,
                                display: "inline-block",
                                zIndex: sticker.zIndex,
                                flexShrink: 0,
                                textAlign: sticker.textAlign,
                                color: STICKER,
                                fontSize: 20,
                                fontFamily: "Avenir, Arial, sans-serif",
                                transformOrigin: "center",
                                pointerEvents: "none",
                            }}
                        >
                            {sticker.label}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

addPropertyControls(AnimatedBarChart, {
    duration: {
        type: ControlType.Number,
        title: "Duration",
        defaultValue: 1700,
        min: 500,
        max: 4200,
        step: 50,
        unit: "ms",
    },
    stagger: {
        type: ControlType.Number,
        title: "Stagger",
        defaultValue: 160,
        min: 0,
        max: 800,
        step: 10,
        unit: "ms",
    },
    startDelay: {
        type: ControlType.Number,
        title: "Delay",
        defaultValue: 260,
        min: 0,
        max: 2000,
        step: 50,
        unit: "ms",
    },
    background: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
})
