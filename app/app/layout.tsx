"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Shield,
    MessageSquare,
    CheckSquare,
    FolderLock,
    Settings,
    Plus,
    Hash,
    Lock,
    Search,
    Bell,
    ChevronDown,
    LogOut,
    Sparkles,
    Users,
    Circle,
} from "lucide-react";

const CHANNELS = [
    { id: "general", name: "general", unread: 3 },
    { id: "engineering", name: "engineering", unread: 0 },
    { id: "design", name: "design", unread: 1 },
    { id: "builds", name: "builds", unread: 0 },
    { id: "random", name: "random", unread: 0 },
];

const DIRECT_MESSAGES = [
    { id: "priya", name: "Priya Sharma", avatar: "PS", online: true, color: "bg-violet-500" },
    { id: "arjun", name: "Arjun Mehta", avatar: "AM", online: true, color: "bg-primary-500" },
    { id: "rahul", name: "Rahul Nair", avatar: "RN", online: false, color: "bg-green-600" },
];

const NAV_ITEMS = [
    { icon: MessageSquare, label: "Chat", href: "/app/chat/general", match: "/app/chat" },
    { icon: CheckSquare, label: "Tasks", href: "/app/tasks", match: "/app/tasks" },
    { icon: FolderLock, label: "Vault", href: "/app/vault", match: "/app/vault" },
    { icon: Settings, label: "Settings", href: "/app/settings", match: "/app/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (match: string) => pathname.startsWith(match);
    const isChatPage = pathname.startsWith("/app/chat");

    return (
        <div className="h-screen flex overflow-hidden bg-dark">
            {/* Icon rail */}
            <aside className="w-14 flex-shrink-0 bg-surface-muted border-r border-surface-border flex flex-col items-center py-3 gap-1 z-20">
                {/* Logo */}
                <Link href="/" className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-primary mb-3 hover:scale-105 transition-transform">
                    <Shield size={17} className="text-white" />
                </Link>

                <div className="w-6 h-px bg-surface-border mb-2" />

                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        title={item.label}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 group relative ${isActive(item.match)
                                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                : "text-slate-500 hover:text-slate-300 hover:bg-surface-raised"
                            }`}
                    >
                        <item.icon size={19} />
                        {isActive(item.match) && (
                            <div className="absolute left-0 w-1 h-5 bg-primary-500 rounded-r-full" />
                        )}
                    </Link>
                ))}

                <div className="flex-1" />

                {/* AI premium badge */}
                <button
                    title="AI Features (Pro)"
                    className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center hover:bg-yellow-500/20 transition-all"
                >
                    <Sparkles size={17} />
                </button>

                {/* User avatar */}
                <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-sm font-bold text-white mt-1 cursor-pointer hover:scale-105 transition-transform">
                    Y
                </div>
            </aside>

            {/* Sidebar — channel list (only on chat page or always show) */}
            {isChatPage && (
                <div className="w-56 flex-shrink-0 bg-dark-DEFAULT border-r border-surface-border flex flex-col overflow-hidden z-10">
                    {/* Workspace header */}
                    <div className="px-3 py-3.5 border-b border-surface-border">
                        <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-surface-raised transition-all group">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-primary-500 flex items-center justify-center">
                                    <Shield size={12} className="text-white" />
                                </div>
                                <span className="text-sm font-bold text-slate-200 truncate">BuildFast HQ</span>
                            </div>
                            <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 py-2">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-dark border border-surface-border text-slate-500 text-xs">
                            <Search size={12} />
                            Search
                            <span className="ml-auto font-mono text-dark-300">⌘K</span>
                        </div>
                    </div>

                    {/* Channels */}
                    <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
                        <div className="flex items-center justify-between px-2 py-1 mt-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Channels</span>
                            <button className="text-slate-500 hover:text-slate-300 hover:bg-surface-raised p-0.5 rounded">
                                <Plus size={12} />
                            </button>
                        </div>
                        {CHANNELS.map((ch) => {
                            const active = pathname === `/app/chat/${ch.id}`;
                            return (
                                <Link
                                    key={ch.id}
                                    href={`/app/chat/${ch.id}`}
                                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150 group ${active
                                            ? "bg-primary-500/15 text-primary-300 border border-primary-500/20"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-surface-raised"
                                        }`}
                                >
                                    <Hash size={14} className="flex-shrink-0" />
                                    <span className="flex-1 truncate">{ch.name}</span>
                                    {ch.unread > 0 && (
                                        <span className="text-xs bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                            {ch.unread}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* DMs */}
                        <div className="flex items-center justify-between px-2 py-1 mt-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct</span>
                            <button className="text-slate-500 hover:text-slate-300 p-0.5 rounded">
                                <Plus size={12} />
                            </button>
                        </div>
                        {DIRECT_MESSAGES.map((dm) => (
                            <Link
                                key={dm.id}
                                href={`/app/chat/${dm.id}`}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150 ${pathname === `/app/chat/${dm.id}`
                                        ? "bg-primary-500/15 text-primary-300 border border-primary-500/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-surface-raised"
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`w-6 h-6 rounded-lg ${dm.color} flex items-center justify-center text-xs font-bold text-white`}>
                                        {dm.avatar[0]}
                                    </div>
                                    {dm.online && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-dark" />
                                    )}
                                </div>
                                <span className="flex-1 truncate">{dm.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Encryption status bar */}
                    <div className="px-3 py-2.5 border-t border-surface-border">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-accent-400/5 border border-accent-400/15">
                            <Lock size={11} className="text-accent-400" />
                            <span className="text-xs font-mono text-accent-400/80">E2E Active</span>
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            {/* Non-chat sidebar header */}
            {!isChatPage && (
                <div className="w-56 flex-shrink-0 bg-dark-DEFAULT border-r border-surface-border flex flex-col z-10">
                    <div className="px-3 py-3.5 border-b border-surface-border">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
                            <div className="w-6 h-6 rounded-md bg-primary-500 flex items-center justify-center">
                                <Shield size={12} className="text-white" />
                            </div>
                            <span className="text-sm font-bold text-slate-200">BuildFast HQ</span>
                        </div>
                    </div>
                    <div className="flex-1" />
                    <div className="px-3 py-2.5 border-t border-surface-border">
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-accent-400/5 border border-accent-400/15">
                            <Lock size={11} className="text-accent-400" />
                            <span className="text-xs font-mono text-accent-400/80">E2E Active</span>
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {children}
            </main>
        </div>
    );
}
