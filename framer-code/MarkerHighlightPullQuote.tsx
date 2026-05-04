// User request: marker highlight on pull-quote phrases; optional second highlight + stagger (Kayla/Rhonda testimonials).
import { addPropertyControls, ControlType, useIsStaticRenderer } from 'framer'
import { useInView } from 'framer-motion'
import { startTransition, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

interface MarkerHighlightPullQuoteProps {
    textBefore: string
    textHighlight: string
    textMid: string
    textHighlight2: string
    textAfter: string
    bodyFont: any
    textColor: string
    markerColor: string
    highlightDuration: number
    markerThickness: number
    markerYOffset: number
    staggerMs: number
    style?: CSSProperties
}

function fontToStyle(font: any): CSSProperties {
    if (!font || typeof font !== 'object') return {}
    return {
        fontSize: font.fontSize,
        fontFamily: font.fontFamily,
        fontWeight: font.fontWeight,
        fontStyle: font.fontStyle,
        lineHeight: font.lineHeight,
        letterSpacing: font.letterSpacing,
        textAlign: (font.textAlign ?? 'left') as CSSProperties['textAlign'],
    }
}

function useMarkerDraw(
    inView: boolean,
    isStatic: boolean,
    hasSecond: boolean,
    staggerMs: number
): { draw1: boolean; draw2: boolean } {
    const [draw1, setDraw1] = useState(isStatic)
    const [draw2, setDraw2] = useState(isStatic && hasSecond)

    useEffect(() => {
        if (isStatic) {
            startTransition(() => {
                setDraw1(true)
                setDraw2(!!hasSecond)
            })
            return
        }
        if (!inView) return

        startTransition(() => setDraw1(true))

        if (!hasSecond) {
            return
        }

        const delay = Math.max(0, staggerMs)
        const id = window.setTimeout(() => {
            startTransition(() => setDraw2(true))
        }, delay)
        return () => window.clearTimeout(id)
    }, [inView, isStatic, hasSecond, staggerMs])

    return { draw1, draw2: hasSecond ? draw2 : false }
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function MarkerHighlightPullQuote(props: MarkerHighlightPullQuoteProps) {
    const {
        textBefore = '\u201cZaid has a ',
        textHighlight = 'remarkable facility for simplifying these complicated experiences',
        textMid = '',
        textHighlight2 = '',
        textAfter = '\u201d',
        bodyFont,
        textColor = '#2e2e2e',
        markerColor = 'rgba(253, 224, 71, 0.55)',
        highlightDuration = 5,
        markerThickness = 0.38,
        markerYOffset = 88,
        staggerMs = 400,
        style,
    } = props

    const hasSecond = Boolean(textHighlight2 && textHighlight2.length > 0)
    const isStatic = useIsStaticRenderer()
    const rootRef = useRef<HTMLParagraphElement>(null)
    const inView = useInView(rootRef, { once: true, amount: 0.35, margin: '0px 0px -8% 0px' })
    const { draw1, draw2 } = useMarkerDraw(inView, isStatic, hasSecond, staggerMs)

    const fontStyle = useMemo(() => fontToStyle(bodyFont), [bodyFont])
    const gradient = `linear-gradient(${markerColor}, ${markerColor})`

    const transition = isStatic
        ? undefined
        : `background-size ${highlightDuration}s cubic-bezier(0.22, 1, 0.36, 1)`

    const markerSpanStyle = (draw: boolean): CSSProperties => ({
        position: 'relative',
        display: 'inline',
        backgroundImage: gradient,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `0 ${markerYOffset}%`,
        backgroundSize: draw ? `100% ${markerThickness}em` : `0% ${markerThickness}em`,
        transition,
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
    })

    return (
        <p
            ref={rootRef}
            style={{
                ...style,
                position: 'relative',
                width: '100%',
                margin: 0,
                color: textColor,
                ...fontStyle,
            }}
        >
            {textBefore}
            <span style={markerSpanStyle(draw1)}>{textHighlight}</span>
            {hasSecond ? (
                <>
                    {textMid}
                    <span style={markerSpanStyle(draw2)}>{textHighlight2}</span>
                </>
            ) : null}
            {textAfter}
        </p>
    )
}

addPropertyControls(MarkerHighlightPullQuote, {
    textBefore: {
        type: ControlType.String,
        title: 'Before',
        defaultValue: '\u201cZaid has a ',
        displayTextArea: true,
    },
    textHighlight: {
        type: ControlType.String,
        title: 'Highlight',
        defaultValue: 'remarkable facility for simplifying these complicated experiences',
        displayTextArea: true,
    },
    textMid: {
        type: ControlType.String,
        title: 'Between',
        defaultValue: '',
        displayTextArea: true,
    },
    textHighlight2: {
        type: ControlType.String,
        title: 'Highlight 2',
        defaultValue: '',
        displayTextArea: true,
    },
    textAfter: {
        type: ControlType.String,
        title: 'After',
        defaultValue: '\u201d',
    },
    bodyFont: {
        type: ControlType.Font,
        title: 'Font',
        controls: 'extended',
        defaultFontType: 'sans-serif',
        defaultValue: {
            variant: 'Medium',
            fontSize: '20px',
            letterSpacing: '-0.02em',
            lineHeight: '1.35em',
            textAlign: 'left',
        },
    },
    textColor: {
        type: ControlType.Color,
        title: 'Text',
        defaultValue: '#2e2e2e',
    },
    markerColor: {
        type: ControlType.Color,
        title: 'Marker',
        defaultValue: 'rgba(253, 224, 71, 0.55)',
    },
    highlightDuration: {
        type: ControlType.Number,
        title: 'Draw (s)',
        defaultValue: 5,
        min: 0.2,
        max: 8,
        step: 0.05,
    },
    markerThickness: {
        type: ControlType.Number,
        title: 'Marker (em)',
        defaultValue: 0.38,
        min: 0.15,
        max: 0.8,
        step: 0.01,
    },
    markerYOffset: {
        type: ControlType.Number,
        title: 'Marker Y %',
        defaultValue: 88,
        min: 70,
        max: 100,
        step: 1,
        unit: '%',
    },
    staggerMs: {
        type: ControlType.Number,
        title: '2nd delay (ms)',
        defaultValue: 400,
        min: 0,
        max: 3000,
        step: 50,
    },
})
