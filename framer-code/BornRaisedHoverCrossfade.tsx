// User request: 'Born and raised' — hover crossfade + lens; optional C–E append to a hover gallery (A→B→…); empty extras = classic A/B only.
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

function galleryExtrasFromProps(c: string, d: string, e: string): string[] {
    return [trimUrl(c), trimUrl(d), trimUrl(e)].filter((u) => u.length > 0)
}

function hasGalleryExtras(props: {
    imageCUrl?: string
    imageDUrl?: string
    imageEUrl?: string
}): boolean {
    return galleryExtrasFromProps(
        props.imageCUrl ?? '',
        props.imageDUrl ?? '',
        props.imageEUrl ?? ''
    ).length > 0
}

const OBJECT_FIT_POS = 'left center'

interface BornRaisedHoverCrossfadeProps {
    imageAUrl: string
    imageBUrl: string
    /** Any of C–E set enables multi-image hover gallery after A and B. */
    imageCUrl: string
    imageDUrl: string
    imageEUrl: string
    duration: number
    /** Gap between gallery steps (seconds). */
    stepDuration: number
    /** Crossfade duration between gallery frames. */
    fadeDuration: number
    borderRadius: number
    /** Delay before crossfade / lens starts (avoids instant flicker on edge hover). */
    hoverDelayMs: number
    /** Pause before advancing to the second frame (ms). */
    sequenceStartDelayMs: number
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function BornRaisedHoverCrossfade(props: BornRaisedHoverCrossfadeProps) {
    const {
        imageAUrl = 'https://framerusercontent.com/images/TUk31SMddNEZ6hA4bQatZmXLU.png',
        imageBUrl = 'https://framerusercontent.com/images/IYH16bOIKExooroyH77gVLFxuI.png',
        imageCUrl = '',
        imageDUrl = '',
        imageEUrl = '',
        duration = 0.9,
        stepDuration = 1.4,
        fadeDuration = 0.6,
        borderRadius = 8,
        hoverDelayMs = 140,
        sequenceStartDelayMs = 220,
        style,
    } = props

    const extras = useMemo(
        () => galleryExtrasFromProps(imageCUrl, imageDUrl, imageEUrl),
        [imageCUrl, imageDUrl, imageEUrl]
    )
    const galleryMode = extras.length > 0

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

    const stepMs = Math.max(350, stepDuration * 1000)

    const images = useMemo(
        () => (galleryMode ? [imageAUrl, imageBUrl, ...extras] : [imageAUrl, imageBUrl]),
        [galleryMode, imageAUrl, imageBUrl, extras]
    )
    const safeIndex = Math.min(index, Math.max(0, images.length - 1))
    const activeImage = galleryMode ? images[safeIndex] : hovered ? imageBUrl : imageAUrl

    const secondOpacity = useMemo(
        () => (galleryMode ? 0 : isStatic ? 0 : hovered ? 1 : 0),
        [galleryMode, hovered, isStatic]
    )

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
                setLens({ x: lx, y: ly })
                if (galleryMode) setIndex(0)
            })
            if (!galleryMode) return
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
            aria-label="Born and raised photos"
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
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.048), 0 1px 2px rgba(0, 0, 0, 0.026)',
            }}
        >
            {galleryMode ? (
                images.map((src, i) => (
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
                            objectPosition: OBJECT_FIT_POS,
                            borderRadius,
                            display: 'block',
                            opacity: i === safeIndex ? 1 : 0,
                            transition: `opacity ${fadeDuration}s ease`,
                            willChange: 'opacity',
                            pointerEvents: 'none',
                        }}
                    />
                ))
            ) : (
                <>
                    <img
                        src={imageAUrl}
                        alt=""
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: OBJECT_FIT_POS,
                            borderRadius,
                            display: 'block',
                        }}
                    />
                    <img
                        src={imageBUrl}
                        alt=""
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: OBJECT_FIT_POS,
                            borderRadius,
                            display: 'block',
                            opacity: secondOpacity,
                            transition: `opacity ${duration}s ease`,
                            willChange: 'opacity',
                        }}
                    />
                </>
            )}

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
                            objectPosition: OBJECT_FIT_POS,
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

addPropertyControls(BornRaisedHoverCrossfade, {
    imageAUrl: {
        type: ControlType.String,
        title: 'Image A URL',
        defaultValue: 'https://framerusercontent.com/images/TUk31SMddNEZ6hA4bQatZmXLU.png',
    },
    imageBUrl: {
        type: ControlType.String,
        title: 'Image B URL',
        defaultValue: 'https://framerusercontent.com/images/IYH16bOIKExooroyH77gVLFxuI.png',
    },
    imageCUrl: {
        type: ControlType.String,
        title: 'Image C URL (optional)',
        defaultValue: '',
        placeholder: 'First gallery frame after A/B',
    },
    imageDUrl: {
        type: ControlType.String,
        title: 'Image D URL (optional)',
        defaultValue: '',
        placeholder: 'Next gallery frame',
    },
    imageEUrl: {
        type: ControlType.String,
        title: 'Image E URL (optional)',
        defaultValue: '',
        placeholder: 'Next gallery frame',
    },
    duration: {
        type: ControlType.Number,
        title: 'Fade A/B (s)',
        defaultValue: 0.9,
        min: 0.1,
        max: 3,
        step: 0.05,
        hidden: (props) => hasGalleryExtras(props),
    },
    stepDuration: {
        type: ControlType.Number,
        title: 'Step gap (s)',
        defaultValue: 1.4,
        min: 0.35,
        max: 4,
        step: 0.05,
        hidden: (props) => !hasGalleryExtras(props),
    },
    fadeDuration: {
        type: ControlType.Number,
        title: 'Fade frames (s)',
        defaultValue: 0.6,
        min: 0.1,
        max: 2,
        step: 0.05,
        hidden: (props) => !hasGalleryExtras(props),
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
    sequenceStartDelayMs: {
        type: ControlType.Number,
        title: 'Pause before A→B (ms)',
        defaultValue: 220,
        min: 0,
        max: 1200,
        step: 10,
        hidden: (props) => !hasGalleryExtras(props),
    },
})
