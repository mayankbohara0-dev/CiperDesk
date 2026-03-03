export default function Loading() {
    return (
        <div className="flex flex-col h-full">
            {/* Header skeleton */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-surface-raised animate-pulse" />
                    <div className="w-24 h-5 rounded-lg bg-surface-raised animate-pulse" />
                </div>
                <div className="w-28 h-6 rounded-lg bg-surface-raised animate-pulse" />
            </div>
            {/* Messages skeleton */}
            <div className="flex-1 px-5 py-5 space-y-5">
                {[0.3, 0.5, 0.2, 0.4, 0.6].map((delay, i) => (
                    <div key={i} className={`flex items-start gap-3 ${i % 3 === 2 ? "flex-row-reverse" : ""}`} style={{ animationDelay: `${delay}s` }}>
                        <div className="w-8 h-8 rounded-xl bg-surface-raised animate-pulse flex-shrink-0" />
                        <div className="space-y-2 flex-1 max-w-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-3 rounded bg-surface-raised animate-pulse" />
                                <div className="w-12 h-3 rounded bg-surface-raised animate-pulse" />
                            </div>
                            <div className="w-64 h-10 rounded-2xl bg-surface-raised animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
            {/* Composer skeleton */}
            <div className="px-4 pb-4 pt-2">
                <div className="h-16 rounded-2xl bg-surface-raised animate-pulse" />
            </div>
        </div>
    );
}
