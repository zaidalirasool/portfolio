// Hover: crossfade through A → B → (optional C) with magnifying lens on cursor.
import { addPropertyControls, ControlType, useIsStaticRenderer } from 'framer'
import {
    startTransition,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type PointerEvent,
} from 'react'

function trimUrl(url: string | undefined): string {
    return (url ?? '').trim()
}

interface CanadaHoverCrossfadeProps {
    imageAUrl: string
    imageBUrl: string
    imageCUrl: string
    duration: number
    stepGap: number
    sequenceStartDelayMs: number
    borderRadius: number
    hoverDelayMs: number
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function CanadaHoverCrossfade(props: CanadaHoverCrossfadeProps) {
    const {
        imageAUrl,
        imageBUrl,
        imageCUrl = '',
        duration = 0.9,
        stepGap = 1.2,
        sequenceStartDelayMs = 180,
        borderRadius = 8,
        hoverDelayMs = 140,
        style,
    } = props

    const images = useMemo(
        () => [imageAUrl, imageBUrl, trimUrl(imageCUrl)].filter((u) => u.length > 0),
        [imageAUrl, imageBUrl, imageCUrl]
    )

    const isStatic = useIsStaticRenderer()
    const [hovered, setHovered] = useState(false)
    const [index, setIndex] = useState(0)
    const [lens, setLens] = useState({ x: 0, y: 0 })
    const hoverEnterTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const sequenceTimers = useRef<ReturnType<typeof setTimeout>[]>([])

    const clearSequenceTimers = () => {
        for (const t of sequenceTimers.current) window.clearTimeout(t)
        sequenceTimers.current = []
    }

    useEffect(
        () => () => {
            if (hoverEnterTimer.current) window.clearTimeout(hoverEnterTimer.current)
            clearSequenceTimers()
        },
        []
    )

    const stepMs = Math.max(350, stepGap * 1000)
    const safeIndex = Math.min(index, Math.max(0, images.length - 1))
    const activeImage = images[safeIndex]

    const onEnter = (e: PointerEvent<HTMLDivElement>) => {
        if (isStatic) return
        const rect = e.currentTarget.getBoundingClientRect()
        const lx = e.clientX - rect.left
        const ly = e.clientY - rect.top
        clearSequenceTimers()
        if (hoverEnterTimer.current) window.clearTimeout(hoverEnterTimer.current)
        hoverEnterTimer.current = window.setTimeout(() => {
            hoverEnterTimer.current = null
            startTransition(() => {
                setHovered(true)
                setIndex(0)
                setLens({ x: lx, y: ly })
            })
            const lead = Math.max(0, sequenceStartDelayMs)
            const timers: ReturnType<typeof setTimeout>[] = []
            for (let k = 1; k < images.length; k++) {
                const t = window.setTimeout(() => {
                    startTransition(() => setIndex(k))
                }, lead + (k - 1) * stepMs)
                timers.push(t)
            }
            sequenceTimers.current = timers
        }, Math.max(0, hoverDelayMs))
    }

    const onLeave = () => {
        if (hoverEnterTimer.current) {
            window.clearTimeout(hoverEnterTimer.current)
            hoverEnterTimer.current = null
        }
        clearSequenceTimers()
        startTransition(() => {
            setHovered(false)
            setIndex(0)
        })
    }

    return (
        <div
            role="img"
            aria-label="Immigrated to Canada photos"
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top })
            }}
            style={{
                ...style,
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius,
                cursor: 'pointer',
            }}
        >
            {images.map((src, i) => (
                <img
                    key={`${src}-${i}`}
                    src={src}
                    alt=""
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius,
                        display: 'block',
                        opacity: i === safeIndex ? 1 : 0,
                        transition: `opacity ${duration}s ease`,
                        willChange: 'opacity',
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {hovered && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        maskImage: `radial-gradient(circle 36px at ${lens.x}px ${lens.y}px, black 98%, transparent 100%)`,
                        WebkitMaskImage: `radial-gradient(circle 36px at ${lens.x}px ${lens.y}px, black 98%, transparent 100%)`,
                    }}
                >
                    <img
                        src={activeImage}
                        alt=""
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: `scale(1.28)`,
                            transformOrigin: `${lens.x}px ${lens.y}px`,
                            filter: 'saturate(1.03)',
                        }}
                    />
                </div>
            )}
        </div>
    )
}

addPropertyControls(CanadaHoverCrossfade, {
    imageAUrl: {
        type: ControlType.String,
        title: 'Image A URL',
        defaultValue: 'https://framerusercontent.com/images/7RHGbkUt5ZnQM2bNNu0DIEcIc.png',
    },
    imageBUrl: {
        type: ControlType.String,
        title: 'Image B URL',
        defaultValue: 'https://framerusercontent.com/images/sJ4qVG6LgHqv8HiRf7xVGi9PTv0.png',
    },
    imageCUrl: {
        type: ControlType.String,
        title: 'Image C URL (optional)',
        defaultValue: 'https://framerusercontent.com/images/acHO0LgAcyCMyCSumQQc7LdmMAA.png',
        placeholder: 'Third frame in hover sequence',
    },
    duration: {
        type: ControlType.Number,
        title: 'Fade (s)',
        defaultValue: 0.9,
        min: 0.1,
        max: 3,
        step: 0.05,
    },
    stepGap: {
        type: ControlType.Number,
        title: 'Step gap (s)',
        defaultValue: 1.2,
        min: 0.35,
        max: 4,
        step: 0.05,
    },
    sequenceStartDelayMs: {
        type: ControlType.Number,
        title: 'Pause before A→B (ms)',
        defaultValue: 180,
        min: 0,
        max: 1200,
        step: 10,
    },
    borderRadius: {
        type: ControlType.Number,
        title: 'Radius',
        defaultValue: 8,
        min: 0,
        max: 32,
        step: 1,
    },
    hoverDelayMs: {
        type: ControlType.Number,
        title: 'Hover delay (ms)',
        defaultValue: 140,
        min: 0,
        max: 600,
        step: 10,
    },
})
