// Video restores scroll-gated playback: starts once user scrolls the clip into view ("fold"),
// then waits playbackDelayMs before playing; does not loop.

import {
    addPropertyControls,
    ControlType,
    RenderTarget,
    useIsStaticRenderer,
} from 'framer'
import {
    useEffect,
    useRef,
    useState,
    startTransition,
    type CSSProperties,
} from 'react'

/** Start when at least this fraction of the component is visible (viewport intersection area / element area). */
const PLAY_THRESHOLD = 0.25

/** Delay after becoming visible before playback begins (ms). */
const DEFAULT_PLAYBACK_DELAY_MS = 3000

function fractionVisibleInViewport(el: HTMLElement): number {
    if (typeof window === 'undefined') return 0
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    const vw = window.innerWidth
    const iw = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0))
    const ih = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0))
    if (r.width <= 0 || r.height <= 0) return 0
    return (iw * ih) / (r.width * r.height)
}

function shouldStartPlayback(entry: IntersectionObserverEntry): boolean {
    if (!entry.isIntersecting) return false
    return entry.intersectionRatio >= PLAY_THRESHOLD
}

interface ScrollRevealVideoProps {
    videoFile: string
    muted: boolean
    objectFit: 'cover' | 'contain'
    backgroundColor: string
    /** Corner radius for the video container (clips with overflow hidden). */
    borderRadius?: number
    /** Wait this long after the clip enters view before calling play(). */
    playbackDelayMs?: number
    style?: CSSProperties
}

/**
 * Video plays once when scrolled into view, after an optional delay; does not loop.
 *
 * @framerIntrinsicWidth 866
 * @framerIntrinsicHeight 487
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function ScrollRevealVideo(props: ScrollRevealVideoProps) {
    const {
        videoFile = 'https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4',
        muted = true,
        objectFit = 'cover',
        backgroundColor = 'rgba(0, 0, 0, 0)',
        borderRadius = 8,
        playbackDelayMs = DEFAULT_PLAYBACK_DELAY_MS,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const rootRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [allowPlay, setAllowPlay] = useState(false)
    const startedRef = useRef(false)

    const radiusCss = `${borderRadius}px`

    useEffect(() => {
        if (isStatic || RenderTarget.current() === RenderTarget.thumbnail) {
            return
        }
        const el = rootRef.current
        if (!el) return
        if (typeof IntersectionObserver === 'undefined') {
            startTransition(() => setAllowPlay(true))
            return
        }

        let disconnected = false
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry || disconnected) return
                if (shouldStartPlayback(entry)) {
                    disconnected = true
                    io.disconnect()
                    startTransition(() => setAllowPlay(true))
                }
            },
            {
                threshold: [0, 0.1, 0.25, 0.35, 0.5, 0.75, 1],
                rootMargin: '0px',
            },
        )

        const trySync = () => {
            if (disconnected) return
            if (fractionVisibleInViewport(el) >= PLAY_THRESHOLD) {
                disconnected = true
                io.disconnect()
                startTransition(() => setAllowPlay(true))
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
    }, [isStatic])

    useEffect(() => {
        if (!allowPlay || isStatic) return
        const v = videoRef.current
        if (!v || startedRef.current) return

        const delay = Math.max(0, playbackDelayMs)
        const timer = window.setTimeout(() => {
            if (!videoRef.current || startedRef.current) return
            startedRef.current = true
            const el = videoRef.current
            el.muted = muted
            const p = el.play()
            if (p !== undefined) {
                p.catch(() => {})
            }
        }, delay)

        return () => window.clearTimeout(timer)
    }, [allowPlay, muted, isStatic, playbackDelayMs])

    const layoutH = style?.height
    const fillVideo =
        layoutH === '100%' ||
        (typeof layoutH === 'string' && /^\d+(\.\d+)?px$/.test(layoutH.trim()))

    return (
        <div
            ref={rootRef}
            style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor,
                ...style,
                borderRadius: radiusCss,
            }}
        >
            <video
                ref={videoRef}
                src={videoFile}
                muted={muted}
                loop={false}
                playsInline
                controls={false}
                preload={isStatic ? 'none' : 'metadata'}
                style={{
                    display: 'block',
                    width: '100%',
                    height: fillVideo ? '100%' : 'auto',
                    objectFit,
                    borderRadius: radiusCss,
                }}
            />
        </div>
    )
}

addPropertyControls(ScrollRevealVideo, {
    videoFile: {
        type: ControlType.File,
        allowedFileTypes: ['mp4', 'webm', 'mov'],
        title: 'Video',
    },
    muted: {
        type: ControlType.Boolean,
        title: 'Muted',
        defaultValue: true,
        enabledTitle: 'Yes',
        disabledTitle: 'No',
    },
    objectFit: {
        type: ControlType.Enum,
        title: 'Object fit',
        options: ['cover', 'contain'],
        optionTitles: ['Cover', 'Contain'],
        defaultValue: 'cover',
        displaySegmentedControl: true,
    },
    backgroundColor: {
        type: ControlType.Color,
        title: 'Background',
        defaultValue: 'rgba(0, 0, 0, 0)',
    },
    borderRadius: {
        type: ControlType.Number,
        title: 'Corner radius',
        defaultValue: 8,
        min: 0,
        max: 64,
        step: 1,
    },
    playbackDelayMs: {
        type: ControlType.Number,
        title: 'Start delay (ms)',
        defaultValue: DEFAULT_PLAYBACK_DELAY_MS,
        min: 0,
        max: 30000,
        step: 100,
    },
})
