"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Shield, MessageSquare, CheckSquare, FolderLock,
    Settings, Plus, Hash, Lock, Search, Bell, ChevronDown, Sparkles,
} from "lucide-react";

const CHANNELS = [
    { id: "general", name: "general", unread: 3 },
    { id: "engineering", name: "engineering", unread: 0 },
    { id: "design", name: "design", unread: 1 },
    { id: "builds", name: "builds", unread: 0 },
    { id: "random", name: "random", unread: 0 },
];

const DMS = [
    { id: "priya", name: "Priya Sharma", av: "PS", online: true, color: "#8B5CF6" },
    { id: "arjun", name: "Arjun Mehta", av: "AM", online: true, color: "#6366F1" },
    { id: "rahul", name: "Rahul Nair", av: "RN", online: false, color: "#10B981" },
];

const NAV = [
    { icon: MessageSquare, label: "Chat", href: "/app/chat/general", match: "/app/chat" },
    { icon: CheckSquare, label: "Tasks", href: "/app/tasks", match: "/app/tasks" },
    { icon: FolderLock, label: "Vault", href: "/app/vault", match: "/app/vault" },
    { icon: Bell, label: "Notifications", href: "/app/notifications", match: "/app/notifications" },
    { icon: Settings, label: "Settings", href: "/app/settings", match: "/app/settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChat = pathname.startsWith("/app/chat");
    const isActive = (m: string) => pathname.startsWith(m);

    /* Sidebar channel list (only in chat context) */
    const Sidebar = () => (
        <div style={{
            width: 216, flexShrink: 0,
            background: "rgba(3,7,17,.97)",
            borderRight: "1px solid rgba(255,255,255,.05)",
            display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
            {/* Workspace header */}
            <div style={{ padding: "14px 10px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <button style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.07)", cursor: "pointer",
                    transition: "all .2s",
                }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.07)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.04)"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(99,102,241,.4)" }}>
                            <Shield size={12} style={{ color: "#fff" }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#E2E8F0" }}>BuildFast HQ</span>
                    </div>
                    <ChevronDown size={13} style={{ color: "#475569" }} />
                </button>
            </div>

            {/* Search */}
            <div style={{ padding: "8px 10px" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px", borderRadius: 9,
                    background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)",
                    fontSize: 13, color: "#475569", cursor: "pointer",
                }}>
                    <Search size={13} />
                    <span>Search…</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: "monospace", color: "#334155" }}>⌘K</span>
                </div>
            </div>

            {/* Channel list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>

                {/* Channels */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px 6px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#475569" }}>Channels</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2, borderRadius: 4, transition: "all .15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#94A3B8"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}>
                        <Plus size={13} />
                    </button>
                </div>

                {CHANNELS.map(ch => {
                    const active = pathname === `/app/chat/${ch.id}`;
                    return (
                        <Link key={ch.id} href={`/app/chat/${ch.id}`} className={`ch-item ${active ? "active" : ""}`}>
                            <Hash size={13} style={{ flexShrink: 0, opacity: .7 }} />
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                            {ch.unread > 0 && (
                                <span style={{
                                    fontSize: 9, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 100,
                                    background: "#6366F1", color: "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
                                    boxShadow: "0 0 8px rgba(99,102,241,.5)",
                                }}>{ch.unread}</span>
                            )}
                        </Link>
                    );
                })}

                {/* DMs */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px 6px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#475569" }}>Direct</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2, borderRadius: 4 }}>
                        <Plus size={13} />
                    </button>
                </div>

                {DMS.map(dm => {
                    const active = pathname === `/app/chat/${dm.id}`;
                    return (
                        <Link key={dm.id} href={`/app/chat/${dm.id}`} className={`ch-item ${active ? "active" : ""}`}>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <div style={{ width: 22, height: 22, borderRadius: 7, background: dm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>
                                    {dm.av[0]}
                                </div>
                                {dm.online && (
                                    <div style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: "#10B981", border: "2px solid #030711" }} />
                                )}
                            </div>
                            <span style={{ flex: 1, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dm.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* E2E status bar */}
            <div style={{ padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px", borderRadius: 9,
                    background: "rgba(6,182,212,.04)", border: "1px solid rgba(6,182,212,.12)",
                }}>
                    <Lock size={11} style={{ color: "#22D3EE" }} />
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(34,211,238,.7)", letterSpacing: ".03em" }}>E2E Active</span>
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse-dot 2s ease-in-out infinite" }} />
                </div>
            </div>
        </div>
    );

    /* Generic sidebar for non-chat pages */
    const GenericSidebar = () => (
        <div style={{
            width: 216, flexShrink: 0, background: "rgba(3,7,17,.97)",
            borderRight: "1px solid rgba(255,255,255,.05)",
            display: "flex", flexDirection: "column",
        }}>
            <div style={{ padding: "14px 10px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Shield size={12} style={{ color: "#fff" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#E2E8F0" }}>BuildFast HQ</span>
                </div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 9, background: "rgba(6,182,212,.04)", border: "1px solid rgba(6,182,212,.12)" }}>
                    <Lock size={11} style={{ color: "#22D3EE" }} />
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(34,211,238,.7)" }}>E2E Active</span>
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse-dot 2s ease-in-out infinite" }} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ height: "100vh", display: "flex", overflow: "hidden", background: "#030711" }}>

            {/* ── Icon Rail ── */}
            <aside style={{
                width: 58, flexShrink: 0,
                background: "rgba(3,7,17,.98)",
                borderRight: "1px solid rgba(255,255,255,.05)",
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "12px 0 10px", gap: 6, zIndex: 20,
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    width: 36, height: 36, borderRadius: 10, marginBottom: 8,
                    background: "linear-gradient(135deg,#6366F1,#4F46E5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 20px rgba(99,102,241,.45)",
                    transition: "transform .2s",
                    textDecoration: "none",
                }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
                    <Shield size={16} style={{ color: "#fff" }} />
                </Link>

                <div style={{ width: 28, height: 1, background: "rgba(255,255,255,.05)", marginBottom: 4 }} />

                {/* Nav items */}
                {NAV.map(item => {
                    const active = isActive(item.match);
                    return (
                        <Link key={item.label} href={item.href} title={item.label}
                            style={{
                                width: 38, height: 38, borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: active ? "#818CF8" : "#475569",
                                background: active ? "rgba(99,102,241,.18)" : "transparent",
                                border: `1px solid ${active ? "rgba(99,102,241,.3)" : "transparent"}`,
                                boxShadow: active ? "0 0 16px rgba(99,102,241,.2)" : "none",
                                transition: "all .2s", textDecoration: "none", position: "relative",
                            }}
                            onMouseEnter={e => {
                                if (!active) {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.06)";
                                    (e.currentTarget as HTMLElement).style.color = "#CBD5E1";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.08)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!active) {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.color = "#475569";
                                    (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                                }
                            }}>
                            <item.icon size={18} />
                            {active && (
                                <div style={{ position: "absolute", left: 0, width: 3, height: 20, background: "#6366F1", borderRadius: "0 3px 3px 0", boxShadow: "0 0 8px rgba(99,102,241,.8)" }} />
                            )}
                        </Link>
                    );
                })}

                <div style={{ flex: 1 }} />

                {/* AI */}
                <Link href="/app/ai" title="AI Digest (Pro)"
                    style={{
                        width: 38, height: 38, borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isActive("/app/ai") ? "#FCD34D" : "#F59E0B",
                        background: isActive("/app/ai") ? "rgba(245,158,11,.25)" : "rgba(245,158,11,.1)",
                        border: `1px solid ${isActive("/app/ai") ? "rgba(245,158,11,.4)" : "rgba(245,158,11,.18)"}`,
                        transition: "all .2s", textDecoration: "none",
                    }}>
                    <Sparkles size={16} />
                </Link>

                {/* Avatar */}
                <div style={{
                    width: 34, height: 34, borderRadius: 9, marginTop: 4,
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                    boxShadow: "0 0 12px rgba(99,102,241,.35)",
                    transition: "transform .2s",
                }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
                    Y
                </div>
            </aside>

            {/* ── Channel/Context Sidebar ── */}
            {isChat ? <Sidebar /> : <GenericSidebar />}

            {/* ── Main area ── */}
            <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: "rgba(3,7,17,.98)" }}>
                {children}
            </main>
        </div>
    );
}
