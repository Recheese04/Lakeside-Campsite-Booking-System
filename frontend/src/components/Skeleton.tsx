import { motion } from 'framer-motion';

/* ── Base shimmer block ── */
export const Skeleton = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
    <div className={`relative overflow-hidden bg-gray-100 rounded-xl ${className}`} style={style}>
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        />
    </div>
);

/* ── Preset skeletons for common admin layouts ── */

export const StatCardSkeleton = ({ count = 4 }: { count?: number }) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${count > 3 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-4`}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="w-4 h-4 rounded" />
                </div>
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-4 w-28" />
            </div>
        ))}
    </div>
);

export const TableRowSkeleton = ({ cols = 6, rows = 5 }: { cols?: number; rows?: number }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} className="h-3 flex-1 max-w-[100px] rounded-lg" />
            ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
                {r === 0 || r === 2 || r === 4 ? (
                    <>
                        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </>
                ) : (
                    <>
                        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </>
                )}
            </div>
        ))}
    </div>
);

export const ListItemSkeleton = ({ rows = 4 }: { rows?: number }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-44" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
            </div>
        ))}
    </div>
);

export const BannerSkeleton = () => (
    <div className="rounded-2xl bg-gray-100 overflow-hidden relative p-6 h-36">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-3 w-80" />
        <div className="absolute top-6 right-6 flex gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-36" />
        </div>
        <div className="flex items-end gap-3 h-48">
            {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <Skeleton className="w-full rounded-t-lg" style={{ height: `${h}%` }} />
                    <Skeleton className="h-3 w-6 rounded" />
                </div>
            ))}
        </div>
    </div>
);

export const SearchSkeleton = () => (
    <Skeleton className="h-10 w-full rounded-xl" />
);
