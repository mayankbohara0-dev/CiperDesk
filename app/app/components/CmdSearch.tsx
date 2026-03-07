"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search, MessageSquare, CheckSquare, FolderLock, Users, Bell,
    ScrollText, KeyRound, BarChart3, Plug, ShieldCheck, Settings,
    Hash, ArrowRight, X,
} from "lucide-react";
import { useTasks, useMembers, useChannels } from "@/lib/hooks";

type ResultItem = {
    label: string;
    sublabel: string;
    icon: React.ElementType;
    href: string;
    group: string;
};

const STATIC_LINKS: ResultItem[] = [
    { label: "Chat → #general", sublabel: "Navigation", icon: MessageSquare, href: "/app/chat/general", group: "Navigation" },
    { label: "Tasks", sublabel: "Navigation", icon: CheckSquare, href: "/app/tasks", group: "Navigation" },
    { label: "File Vault", sublabel: "Navigation", icon: FolderLock, href: "/app/vault", group: "Navigation" },
    { label: "Members", sublabel: "Navigation", icon: Users, href: "/app/members", group: "Navigation" },
    { label: "Notifications", sublabel: "Navigation", icon: Bell, href: "/app/notifications", group: "Navigation" },
    { label: "Audit Log", sublabel: "Navigation", icon: ScrollText, href: "/app/audit", group: "Navigation" },
    { label: "Key Management", sublabel: "Navigation", icon: KeyRound, href: "/app/keys", group: "Navigation" },
    { label: "Admin Dashboard", sublabel: "Navigation", icon: BarChart3, href: "/app/admin", group: "Navigation" },
    { label: "Integrations", sublabel: "Navigation", icon: Plug, href: "/app/integrations", group: "Navigation" },
    { label: "Compliance", sublabel: "Navigation", icon: ShieldCheck, href: "/app/compliance", group: "Navigation" },
    { label: "Settings → Profile", sublabel: "Navigation", icon: Settings, href: "/app/settings", group: "Navigation" },
];

const SHORTCUTS: [string, string][] = [["↑↓", "Navigate"], ["↵", "Open"], ["Esc", "Close"]];

export default function CmdSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { tasks } = useTasks();
    const { members } = useMembers();
    const { channels } = useChannels();

    useEffect(() => {
        if (open) {
            setQuery("");
            setSelected(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const results = useCallback((): ResultItem[] => {
        const q = query.toLowerCase().trim();

        const taskResults: ResultItem[] = tasks
            .filter(t => t.title.toLowerCase().includes(q) || q === "")
            .slice(0, 3)
            .map(t => ({
                label: t.title,
                sublabel: t.status.replace("_", " "),
                icon: CheckSquare,
                href: "/app/tasks",
                group: "Tasks",
            }));

        const memberResults: ResultItem[] = members
            .filter(m => (m.full_name || m.email).toLowerCase().includes(q) || q === "")
            .slice(0, 3)
            .map(m => ({
                label: m.full_name || m.email,
                sublabel: m.role,
                icon: Users,
                href: `/app/chat/${m.id}`,
                group: "Direct Messages",
            }));

        const channelResults: ResultItem[] = channels
            .filter(c => c.name.toLowerCase().includes(q) || q === "")
            .slice(0, 5)
            .map(c => ({
                label: `#${c.name}`,
                sublabel: c.description || "Channel",
                icon: Hash,
                href: `/app/chat/${c.name}`,
                group: "Channels",
            }));

        const navResults: ResultItem[] = STATIC_LINKS.filter(
            l => l.label.toLowerCase().includes(q)
        );

        if (!q) {
            return [...channelResults, ...navResults.slice(0, 5)];
        }

        return [...channelResults, ...memberResults, ...taskResults, ...navResults];
    }, [query, tasks, members, channels]);

    const items = results();

    useEffect(() => {
        setSelected(0);
    }, [query]);

    const navigate = useCallback((href: string) => {
        router.push(href);
        onClose();
    }, [router, onClose]);

    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, items.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
            if (e.key === "Enter" && items[selected]) { navigate(items[selected].href); }
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, [open, items, selected, navigate, onClose]);

    if (!open) return null;

    // Group items
    const grouped: Record<string, ResultItem[]> = {};
    items.forEach(item => {
        if (!grouped[item.group]) grouped[item.group] = [];
        grouped[item.group].push(item);
    });

    let globalIdx = 0;

    return (
        <div
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh", background: "rgba(13,13,13,.4)", backdropFilter: "blur(6px)" }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div style={{ width: "100%", maxWidth: 580, background: "#fff", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,.18)", overflow: "hidden", animation: "scale-in .15s ease both" }}>
                {/* Search input */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1.5px solid #E8E4DC" }}>
                    <Search size={18} style={{ color: "#A8A49C", flexShrink: 0 }} />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search pages, tasks, members, channels…"
                        style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#0D0D0D", fontFamily: "Inter, sans-serif", background: "transparent" }}
                    />
                    {query && (
                        <button onClick={() => setQuery("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#A8A49C", padding: 2 }}>
                            <X size={15} />
                        </button>
                    )}
                    <kbd style={{ fontSize: 11, fontFamily: "monospace", color: "#A8A49C", background: "#F5F0E8", border: "1.5px solid #E8E4DC", borderRadius: 6, padding: "2px 7px" }}>ESC</kbd>
                </div>

                {/* Results */}
                <div style={{ maxHeight: 400, overflowY: "auto", padding: "8px 8px" }}>
                    {items.length === 0 ? (
                        <div style={{ padding: "30px 0", textAlign: "center", color: "#A8A49C", fontSize: 13 }}>
                            No results for &quot;{query}&quot;
                        </div>
                    ) : (
                        Object.entries(grouped).map(([group, groupItems]) => (
                            <div key={group}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#A8A49C", padding: "8px 12px 4px" }}>
                                    {group}
                                </div>
                                {groupItems.map(item => {
                                    const idx = globalIdx++;
                                    const isSelected = idx === selected;
                                    return (
                                        <button
                                            key={`${group}-${item.label}`}
                                            onClick={() => navigate(item.href)}
                                            onMouseEnter={() => setSelected(idx)}
                                            style={{
                                                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "9px 12px",
                                                borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                                                background: isSelected ? "#0D0D0D" : "transparent",
                                                color: isSelected ? "#fff" : "#0D0D0D",
                                                transition: "all .1s",
                                            }}
                                        >
                                            <div style={{ width: 30, height: 30, borderRadius: 8, background: isSelected ? "rgba(255,255,255,.1)" : "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <item.icon size={14} style={{ color: isSelected ? "#AAEF45" : "#6B675E" }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                                                {item.sublabel && (
                                                    <div style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,.6)" : "#A8A49C", textTransform: "capitalize" }}>{item.sublabel}</div>
                                                )}
                                            </div>
                                            <ArrowRight size={13} style={{ opacity: isSelected ? 1 : 0, color: "#AAEF45", transition: "opacity .1s" }} />
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: "10px 18px", borderTop: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", gap: 16, justifyContent: "flex-end" }}>
                    {SHORTCUTS.map(([key, label]) => (
                        <span key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#A8A49C" }}>
                            <kbd style={{ fontSize: 10, fontFamily: "monospace", background: "#F5F0E8", border: "1.5px solid #E8E4DC", borderRadius: 5, padding: "1px 6px" }}>{key}</kbd>
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
