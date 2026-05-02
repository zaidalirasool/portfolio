// User request: Co-founded Rhizhome card — hover gallery + lens; A–C plus optional D–E, then a dedicated last-slide image URL.
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

function rhizhomeExtras(d: string, e: string): string[] {
    return [trimUrl(d), trimUrl(e)].filter((u) => u.length > 0)
}

interface RhizhomeHoverGalleryProps {
    imageAUrl: string
    imageBUrl: string
    imageCUrl: string
    imageDUrl: string
    imageEUrl: string
    /** Final slide (after optional D–E). Upload in Framer → paste URL here to swap art. */
    imageLastUrl: string
    stepDuration: number
    fadeDuration: number
    borderRadius: number
    hoverDelayMs: number
    sequenceStartDelayMs: number
    /**
     * Floor height when parent `%` height collapses (only absolute children → no intrinsic height).
     * Fixes hairline / thin-strip renders on the published site.
     */
    galleryMinHeightPx: number
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function RhizhomeHoverGallery(props: RhizhomeHoverGalleryProps) {
    const {
        imageAUrl = 'https://framerusercontent.com/images/y2GXcjQUBLlGUs8sP3DpyI5I.png',
        imageBUrl = 'https://framerusercontent.com/images/zFFm7Pxp2gJqwQa0ZwvMCjQyyg.png',
        imageCUrl = 'https://framerusercontent.com/images/20FaRI05cVD4zLF6fg892pOSD2M.png',
        imageDUrl = 'https://framerusercontent.com/images/IgLR5M3qITMfEUWfhgaUXxsvAxs.png',
        imageEUrl = 'https://framerusercontent.com/images/vPPUtj5xx65Tr4qe2ILhfErrhnk.png',
        imageLastUrl = 'https://files.catbox.moe/t08kix.png',
        stepDuration = 1.4,
        fadeDuration = 0.6,
        borderRadius = 8,
        hoverDelayMs = 160,
        sequenceStartDelayMs = 220,
        galleryMinHeightPx = 240,
        style,
    } = props

    const extras = useMemo(() => rhizhomeExtras(imageDUrl, imageEUrl), [imageDUrl, imageEUrl])

    const lastSlideSrc =
        trimUrl(imageLastUrl).length > 0 ? trimUrl(imageLastUrl) : imageAUrl

    const images = useMemo(
        () => [imageAUrl, imageBUrl, imageCUrl, ...extras, lastSlideSrc],
        [imageAUrl, imageBUrl, imageCUrl, extras, lastSlideSrc]
    )

    const isStatic = useIsStaticRenderer()
    const [hovered, setHovered] = useState(false)
    const [index, setIndex] = useState(0)
    const [lens, setLens] = useState({ x: 0, y: 0 })
    const hoverEnterTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const sequenceTimers = useRef<ReturnType<typeof setTimeout>[]>([])

    const clearSequenceTimers = () => {
        if (typeof window === 'undefined') return
        for (const t of sequenceTimers.current) window.clearTimeout(t)
        sequenceTimers.current = []
    }

    useEffect(
        () => () => {
            if (typeof window === 'undefined') return
            if (hoverEnterTimer.current) window.clearTimeout(hoverEnterTimer.current)
            clearSequenceTimers()
        },
        []
    )

    const stepMs = Math.max(350, stepDuration * 1000)
    const lastIdx = Math.max(0, images.length - 1)
    const safeIndex = Math.min(index, lastIdx)
    const activeImage = images[safeIndex]

    const onEnter = (e: PointerEvent<HTMLDivElement>) => {
        if (isStatic || typeof window === 'undefined') return
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
        if (typeof window === 'undefined') return
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
            aria-label="Co-founded Rhizhome photos"
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            onPointerMove={(e) => {
                if (!hovered && hoverEnterTimer.current === null) return
                const rect = e.currentTarget.getBoundingClientRect()
                setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top })
            }}
            style={{
                ...style,
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: galleryMinHeightPx,
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
                        objectPosition: 'center center',
                        borderRadius,
                        display: 'block',
                        opacity: i === safeIndex ? 1 : 0,
                        transition: `opacity ${fadeDuration}s ease`,
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
                            objectPosition: 'center center',
                            transform: 'scale(1.28)',
                            transformOrigin: `${lens.x}px ${lens.y}px`,
                            filter: 'saturate(1.03)',
                        }}
                    />
                </div>
            )}
        </div>
    )
}

addPropertyControls(RhizhomeHoverGallery, {
    imageAUrl: {
        type: ControlType.String,
        title: 'Image A URL',
        defaultValue: 'https://framerusercontent.com/images/y2GXcjQUBLlGUs8sP3DpyI5I.png',
    },
    imageBUrl: {
        type: ControlType.String,
        title: 'Image B URL',
        defaultValue: 'https://framerusercontent.com/images/zFFm7Pxp2gJqwQa0ZwvMCjQyyg.png',
    },
    imageCUrl: {
        type: ControlType.String,
        title: 'Image C URL',
        defaultValue: 'https://framerusercontent.com/images/20FaRI05cVD4zLF6fg892pOSD2M.png',
    },
    imageDUrl: {
        type: ControlType.String,
        title: 'Image D URL (optional)',
        defaultValue: 'https://framerusercontent.com/images/IgLR5M3qITMfEUWfhgaUXxsvAxs.png',
        placeholder: 'Append to gallery after C',
    },
    imageEUrl: {
        type: ControlType.String,
        title: 'Image E URL (optional)',
        defaultValue: 'https://framerusercontent.com/images/vPPUtj5xx65Tr4qe2ILhfErrhnk.png',
        placeholder: 'Append to gallery after D',
    },
    imageLastUrl: {
        type: ControlType.String,
        title: 'Last slide URL',
        defaultValue: 'https://files.catbox.moe/t08kix.png',
        placeholder: 'Portrait / final frame',
    },
    galleryMinHeightPx: {
        type: ControlType.Number,
        title: 'Min height (px)',
        defaultValue: 240,
        min: 80,
        max: 560,
        step: 4,
    },
    stepDuration: {
        type: ControlType.Number,
        title: 'Step gap (s)',
        defaultValue: 1.4,
        min: 0.35,
        max: 4,
        step: 0.05,
    },
    fadeDuration: {
        type: ControlType.Number,
        title: 'Fade (s)',
        defaultValue: 0.6,
        min: 0.1,
        max: 2,
        step: 0.05,
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
        defaultValue: 160,
        min: 0,
        max: 600,
        step: 10,
    },
    sequenceStartDelayMs: {
        type: ControlType.Number,
        title: 'Pause before A to B (ms)',
        defaultValue: 220,
        min: 0,
        max: 1200,
        step: 10,
    },
})
