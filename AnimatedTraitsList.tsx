// User request: animated list with emoji icons in rounded tiles
import { addPropertyControls, ControlType, useIsStaticRenderer } from 'framer'
import { AnimatePresence, motion, type MotionProps, useInView } from 'framer-motion'
import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from 'react'

interface AnimatedTraitsListProps {
    intervalMs: number
    itemBg: string
    textColor: string
    borderColor: string
    radius: number
    style?: CSSProperties
}

type TraitItem = {
    label: string
    emoji: string
    accent: string
}

const TRAITS: TraitItem[] = [
    { label: 'Owner mindset', emoji: '\u{1F9E0}', accent: '#EAD1C0' },
    { label: 'I bring structure', emoji: '\u{1F9EC}', accent: '#EAD1C0' },
    { label: 'Strategic partner', emoji: '\u{1F4A1}', accent: '#EAD1C0' },
    { label: 'Humility above all', emoji: '\u{1F91D}', accent: '#EAD1C0' },
]

const itemAnimations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: 'spring', stiffness: 350, damping: 40 },
}

const EMOJI_SHADOW =
    '0 2px 4px rgba(0,0,0,0.12), 0 10px 22px rgba(0,0,0,0.18), 0 24px 48px rgba(0,0,0,0.14), 0 40px 72px rgba(0,0,0,0.1)'

const EMOJI_TILE_RADIUS = 8

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function AnimatedTraitsList(props: AnimatedTraitsListProps) {
    const {
        intervalMs = 1600,
        itemBg = '#EAD1C0',
        textColor = '#111111',
        borderColor = 'rgba(0,0,0,0.08)',
        radius = 8,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const [index, setIndex] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const inView = useInView(rootRef, { amount: 0.55, once: true, margin: '0px 0px -12% 0px' })

    const startSequence = useCallback(() => {
        if (isStatic || hasStarted) return
        startTransition(() => {
            setIndex(0)
            setHasStarted(true)
        })
    }, [hasStarted, isStatic])

    useEffect(() => {
        if (isStatic) {
            startTransition(() => setIndex(TRAITS.length - 1))
            return
        }
        if (inView) startSequence()
    }, [inView, isStatic, startSequence])

    useEffect(() => {
        if (!hasStarted || isStatic) return
        if (index >= TRAITS.length - 1) return

        const timeout = window.setTimeout(() => {
            startTransition(() => setIndex((prev) => Math.min(prev + 1, TRAITS.length - 1)))
        }, Math.max(900, intervalMs))

        return () => window.clearTimeout(timeout)
    }, [index, hasStarted, intervalMs, isStatic])

    const itemsToShow = useMemo(() => {
        return TRAITS.slice(0, index + 1).reverse()
    }, [index])

    return (
        <div
            ref={rootRef}
            style={{
                ...style,
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: 120,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                padding: 8,
                backgroundColor: 'transparent',
            }}
            aria-label="Animated values list"
        >
            <AnimatePresence>
                {itemsToShow.map((item) => (
                    <motion.div
                        key={item.label}
                        {...itemAnimations}
                        layout
                        style={{
                            width: '100%',
                            maxWidth: 560,
                            transformOrigin: '50% 0%',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                background: itemBg,
                                color: textColor,
                                border: `1px solid ${borderColor}`,
                                borderRadius: radius,
                                padding: '16px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                boxShadow: 'none',
                                willChange: 'transform, opacity',
                            }}
                        >
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: EMOJI_TILE_RADIUS,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: 1,
                                    background: item.accent,
                                    flexShrink: 0,
                                    boxShadow: EMOJI_SHADOW,
                                    overflow: 'hidden',
                                }}
                                aria-hidden="true"
                            >
                                <span
                                    style={{
                                        fontSize: 24,
                                        lineHeight: 1,
                                        display: 'block',
                                        userSelect: 'none',
                                        fontFamily:
                                            '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
                                    }}
                                >
                                    {item.emoji}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    width: '100%',
                                    minWidth: 0,
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: 22,
                                        fontWeight: 500,
                                        fontStyle: 'normal',
                                        lineHeight: 1.2,
                                        textAlign: 'left',
                                        letterSpacing: '-0.01em',
                                        width: '100%',
                                    }}
                                >
                                    {item.label}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

addPropertyControls(AnimatedTraitsList, {
    intervalMs: {
        type: ControlType.Number,
        title: 'Interval',
        defaultValue: 1600,
        min: 900,
        max: 5000,
        step: 100,
    },
    itemBg: {
        type: ControlType.Color,
        title: 'Item BG',
        defaultValue: '#EAD1C0',
    },
    textColor: {
        type: ControlType.Color,
        title: 'Text',
        defaultValue: '#111111',
    },
    borderColor: {
        type: ControlType.Color,
        title: 'Border',
        defaultValue: 'rgba(0,0,0,0.08)',
    },
    radius: {
        type: ControlType.Number,
        title: 'Radius',
        defaultValue: 8,
        min: 0,
        max: 30,
        step: 1,
    },
})
