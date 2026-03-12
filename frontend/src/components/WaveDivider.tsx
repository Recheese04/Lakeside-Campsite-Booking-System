/**
 * WaveDivider — organic SVG wave transitions with gradient fills.
 *
 * Usage:
 *   <WaveDivider fromColor="#0a0a0f" toColor="#111318" variant={1} />
 *
 * The wave always fills `toColor` while the section above provides `fromColor`
 * via its own background. Use `flip` to invert the wave direction.
 */

interface WaveDividerProps {
    /** Background color of the section ABOVE this divider */
    fromColor: string;
    /** Background color that the wave shape itself fills (section BELOW) */
    toColor: string;
    /** Wave shape variant 1–4 */
    variant?: 1 | 2 | 3 | 4;
    /** Flip horizontally for variety */
    flip?: boolean;
    /** Height in px (default 80) */
    height?: number;
    /** Extra className */
    className?: string;
}

/* ── Four distinct organic wave paths ── */
const PATHS: Record<number, string> = {
    1: 'M0,32 C180,80 360,0 540,40 C720,80 900,10 1080,48 C1200,70 1320,20 1440,52 L1440,80 L0,80 Z',
    2: 'M0,60 C120,20 240,72 400,45 C560,18 680,65 840,38 C1000,12 1140,58 1280,35 C1360,22 1400,50 1440,44 L1440,80 L0,80 Z',
    3: 'M0,20 C80,60 200,10 340,50 C480,85 600,15 760,48 C900,75 1020,25 1160,55 C1280,78 1380,30 1440,50 L1440,80 L0,80 Z',
    4: 'M0,50 C200,80 400,5  600,55 C800,100 1000,8 1200,45 C1320,68 1390,30 1440,38 L1440,80 L0,80 Z',
};

export const WaveDivider = ({
    fromColor,
    toColor,
    variant = 1,
    flip = false,
    height = 80,
    className = '',
}: WaveDividerProps) => {
    const path = PATHS[variant] ?? PATHS[1];
    const gradientId = `wave-grad-${variant}-${Math.random().toString(36).slice(2, 7)}`;

    return (
        <div
            className={`relative w-full overflow-hidden leading-none ${className}`}
            style={{
                height,
                background: fromColor,
                // Never leaves a gap between the SVG and surrounding sections
                marginBottom: -1,
            }}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-0 left-0 w-full h-full"
                style={{ transform: flip ? 'scaleX(-1)' : undefined, display: 'block' }}
            >
                <defs>
                    {/* Gradient for the main section fill */}
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={toColor} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={toColor} stopOpacity="1" />
                    </linearGradient>
                    
                    {/* Vibrant green border gradient */}
                    <linearGradient id="wave-green" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>

                    {/* Dark forest green border gradient */}
                    <linearGradient id="wave-dark-green" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#064e3b" />
                        <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                </defs>

                {/* Layer 1: Dark green wave (offset slightly higher and left) */}
                <path d={path} fill="url(#wave-dark-green)" opacity="0.4" transform="translate(-30, -12)" />
                
                {/* Layer 2: Vibrant green wave (offset slightly higher and right) */}
                <path d={path} fill="url(#wave-green)" opacity="0.5" transform="translate(20, -6)" />
                
                {/* Layer 3: The actual section transition (masks the bottom of the layers) */}
                <path d={path} fill={`url(#${gradientId})`} />
            </svg>
        </div>
    );
};