import { motion } from 'framer-motion';

interface FloatingWaveProps {
    className?: string;
    variant?: 1 | 2 | 3 | 4;
    color?: 'emerald' | 'teal' | 'forest';
    delay?: number;
    duration?: number;
    flip?: boolean;
}

const PATHS: Record<number, string> = {
    1: 'M0,32 C180,80 360,0 540,40 C720,80 900,10 1080,48 C1200,70 1320,20 1440,52 L1440,80 L0,80 Z',
    2: 'M0,60 C120,20 240,72 400,45 C560,18 680,65 840,38 C1000,12 1140,58 1280,35 C1360,22 1400,50 1440,44 L1440,80 L0,80 Z',
    3: 'M0,20 C80,60 200,10 340,50 C480,85 600,15 760,48 C900,75 1020,25 1160,55 C1280,78 1380,30 1440,50 L1440,80 L0,80 Z',
    4: 'M0,50 C200,80 400,5  600,55 C800,100 1000,8 1200,45 C1320,68 1390,30 1440,38 L1440,80 L0,80 Z',
};

const COLORS = {
    emerald: ['#10b981', '#34d399'],
    teal: ['#14b8a6', '#5eead4'],
    forest: ['#064e3b', '#047857'],
};

export const FloatingWave = ({ className = '', variant = 1, color = 'emerald', delay = 0, duration = 15, flip = false }: FloatingWaveProps) => {
    const path = PATHS[variant] || PATHS[1];
    const grad = COLORS[color];
    const gradId = `float-${color}-${variant}-${Math.random().toString(36).slice(2, 6)}`;

    return (
        <motion.div
            className={`absolute pointer-events-none ${className}`}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0],
                scale: [1, 1.05, 1],
            }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
        >
            <svg viewBox="0 0 1440 80" className="w-full h-full" preserveAspectRatio="none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={grad[0]} />
                        <stop offset="100%" stopColor={grad[1]} />
                    </linearGradient>
                </defs>
                <path d={path} fill={`url(#${gradId})`} />
            </svg>
        </motion.div>
    );
};
