export default function TasksLoading() {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-6 rounded-lg bg-surface-raised animate-pulse" />
                    <div className="w-20 h-6 rounded-lg bg-surface-raised animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-48 h-9 rounded-xl bg-surface-raised animate-pulse" />
                    <div className="w-24 h-9 rounded-xl bg-surface-raised animate-pulse" />
                </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
                <div className="flex gap-5">
                    {["To Do", "In Progress", "Done"].map((col) => (
                        <div key={col} className="w-80 flex-shrink-0">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-surface-raised" />
                                <div className="w-20 h-4 rounded bg-surface-raised animate-pulse" />
                                <div className="w-6 h-5 rounded-md bg-surface-raised animate-pulse ml-1" />
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].slice(0, col === "In Progress" ? 3 : col === "Done" ? 2 : 2).map((i) => (
                                    <div key={i} className="bg-dark rounded-xl border border-surface-border p-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-5 rounded-lg bg-surface-raised animate-pulse" />
                                        </div>
                                        <div className="w-full h-4 rounded bg-surface-raised animate-pulse" />
                                        <div className="w-3/4 h-3 rounded bg-surface-raised animate-pulse" />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-surface-raised animate-pulse" />
                                                <div className="w-16 h-3 rounded bg-surface-raised animate-pulse" />
                                            </div>
                                            <div className="w-14 h-3 rounded bg-surface-raised animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
