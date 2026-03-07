"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Shield, MessageSquare, CheckSquare, FolderLock,
    Settings, Plus, Hash, Lock, Search, Bell, ChevronDown, Sparkles,
    Users, ScrollText, KeyRound, BarChart3, Plug, ShieldCheck, LogOut,
} from "lucide-react";
import { useUser, useChannels, useMembers, signOut, useNotifications, usePresence } from "@/lib/hooks";
import CmdSearch from "./components/CmdSearch";

const MAIN_NAV = [
    { icon: MessageSquare, label: "Chat", href: "/app/chat/general", match: "/app/chat" },
    { icon: CheckSquare, label: "Tasks", href: "/app/tasks", match: "/app/tasks" },
    { icon: FolderLock, label: "Vault", href: "/app/vault", match: "/app/vault" },
    { icon: Users, label: "Members", href: "/app/members", match: "/app/members" },
];

const SETTINGS_HREF = "/app/settings";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChat = pathname.startsWith("/app/chat");
    const isActive = (m: string) => pathname.startsWith(m);
    const { user, profile } = useUser();
    const { channels } = useChannels();
    const { members } = useMembers();
    const { notifications } = useNotifications(user?.id);
    const { isOnline } = usePresence(user?.id);
    const [cmdOpen, setCmdOpen] = useState(false);

    const unreadNotifCount = notifications.filter(n => !n.is_read).length;

    const initials = profile?.full_name
        ? profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
        : profile?.email?.slice(0, 2).toUpperCase() ?? "??";
    const workspace = profile?.workspace ?? "My Workspace";

    // Cmd+K global shortcut
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCmdOpen(prev => !prev);
            }
        };
        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, []);

    // Direct Messages = all members except me
    const dms = members.filter(m => m.id !== user?.id).map(m => ({
        id: m.id,
        name: m.full_name || m.email,
        av: m.full_name ? m.full_name.slice(0, 2).toUpperCase() : m.email.slice(0, 2).toUpperCase(),
        online: isOnline(m.id),
    }));

    /* Channel sidebar (chat) */
    const ChatSidebar = () => (
        <div style={{
            width: 220, flexShrink: 0,
            background: "#fff",
            borderRight: "1px solid var(--grey-2)",
            display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
            {/* Workspace header & Notifications */}
            <div style={{ padding: "12px 10px", borderBottom: "1px solid var(--grey-2)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                    <button style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 10px", borderRadius: 10, background: "transparent",
                        border: "1.5px solid var(--grey-2)", cursor: "pointer",
                        transition: "all .2s",
                    }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--grey-1)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 7, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Shield size={12} style={{ color: "#AAEF45" }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90 }}>{workspace}</span>
                        </div>
                        <ChevronDown size={13} style={{ color: "#A8A49C" }} />
                    </button>

                    <Link href="/app/notifications" style={{
                        width: 36, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 10, background: "transparent", border: "1.5px solid var(--grey-2)",
                        color: "#0D0D0D", cursor: "pointer", transition: "all .2s", position: "relative"
                    }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--grey-1)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <Bell size={15} />
                        {unreadNotifCount > 0 && (
                            <span style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff" }} />
                        )}
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div style={{ padding: "8px 10px" }}>
                <button onClick={() => setCmdOpen(true)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px", borderRadius: 9,
                    background: "var(--grey-1)", border: "1.5px solid var(--grey-2)",
                    fontSize: 13, color: "#A8A49C", cursor: "pointer",
                    transition: "all .15s",
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#0D0D0D"; (e.currentTarget as HTMLElement).style.color = "#0D0D0D"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--grey-2)"; (e.currentTarget as HTMLElement).style.color = "#A8A49C"; }}>
                    <Search size={13} />
                    <span>Search…</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: "monospace", color: "#C8C4BC" }}>⌘K</span>
                </button>
            </div>

            {/* Channel list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>
                {/* Channels */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px 6px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#A8A49C" }}>Channels</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A49C", padding: 2, borderRadius: 4, transition: "color .15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0D0D0D"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#A8A49C"}>
                        <Plus size={13} />
                    </button>
                </div>

                {channels.map(ch => {
                    const active = pathname === `/app/chat/${ch.name}` || pathname === `/app/chat/${ch.id}`;
                    return (
                        <Link key={ch.id} href={`/app/chat/${ch.name}`} className={`ch-item ${active ? "active" : ""}`}>
                            <Hash size={13} style={{ flexShrink: 0, opacity: .6 }} />
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.name}</span>
                        </Link>
                    );
                })}

                {/* DMs */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px 6px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#A8A49C" }}>Direct</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A49C", padding: 2, borderRadius: 4 }}>
                        <Plus size={13} />
                    </button>
                </div>

                {dms.map(dm => {
                    const active = pathname === `/app/chat/${dm.id}`;
                    return (
                        <Link key={dm.id} href={`/app/chat/${dm.id}`} className={`ch-item ${active ? "active" : ""}`}>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                                <div style={{ width: 22, height: 22, borderRadius: 7, background: active ? "#fff" : "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: active ? "#0D0D0D" : "#fff" }}>
                                    {dm.av}
                                </div>
                                {/* Real presence dot */}
                                <div style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: dm.online ? "#22C55E" : "#D1D5DB", border: "2px solid #fff", transition: "background .5s" }} />
                            </div>
                            <span style={{ flex: 1, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dm.name}</span>
                            {/* Online label */}
                            {dm.online && (
                                <span style={{ fontSize: 9, fontWeight: 700, color: "#16A34A", background: "#F0FDF4", borderRadius: 99, padding: "1px 5px", flexShrink: 0 }}>●</span>
                            )}
                        </Link>
                    );
                })}

                {/* Persistent Invite Button in Chat Sidebar */}
                <Link href="/app/members" style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginTop: 8,
                    borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#6B675E", textDecoration: "none",
                    border: "1px dashed var(--grey-2)", transition: "all .15s"
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--grey-1)"; (e.currentTarget as HTMLElement).style.color = "#0D0D0D"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6B675E"; }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: "var(--grey-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={12} style={{ color: "#0D0D0D" }} />
                    </div>
                    Invite teammates
                </Link>
            </div>

            {/* E2E status */}
            <div style={{ padding: "10px", borderTop: "1px solid var(--grey-2)" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px", borderRadius: 9,
                    background: "#F0FDF4", border: "1px solid #BBF7D0",
                }}>
                    <Lock size={11} style={{ color: "#166534" }} />
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#166534", letterSpacing: ".03em" }}>E2E Active</span>
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse-dot 2s ease-in-out infinite" }} />
                </div>
            </div>
        </div>
    );

    /* Generic sidebar (non-chat pages) */
    const GenericSidebar = () => (
        <div style={{
            width: 220, flexShrink: 0, background: "#fff",
            borderRight: "1px solid var(--grey-2)",
            display: "flex", flexDirection: "column",
        }}>
            <div style={{ padding: "12px 10px", borderBottom: "1px solid var(--grey-2)" }}>
                <div style={{ display: "flex", gap: 6 }}>
                    <div style={{
                        flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 10px"
                    }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, overflow: "hidden", flexShrink: 0 }}>
                            <Image src="/logo.png" alt="CipherDesk" width={24} height={24} style={{ objectFit: "cover" }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90 }}>{workspace}</span>
                    </div>

                    <Link href="/app/notifications" style={{
                        width: 36, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: 10, background: "transparent", border: "1.5px solid var(--grey-2)",
                        color: "#0D0D0D", cursor: "pointer", transition: "all .2s", position: "relative"
                    }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--grey-1)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <Bell size={15} />
                        {unreadNotifCount > 0 && (
                            <span style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff" }} />
                        )}
                    </Link>
                </div>
            </div>

            {/* Search button in generic sidebar too */}
            <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--grey-2)" }}>
                <button onClick={() => setCmdOpen(true)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px", borderRadius: 9,
                    background: "var(--grey-1)", border: "1.5px solid var(--grey-2)",
                    fontSize: 13, color: "#A8A49C", cursor: "pointer",
                    transition: "all .15s",
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#0D0D0D"; (e.currentTarget as HTMLElement).style.color = "#0D0D0D"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--grey-2)"; (e.currentTarget as HTMLElement).style.color = "#A8A49C"; }}>
                    <Search size={13} />
                    <span>Quick search…</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: "monospace", color: "#C8C4BC" }}>⌘K</span>
                </button>
            </div>

            <div style={{ flex: 1 }} />
            <div style={{ padding: "10px", borderTop: "1px solid var(--grey-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 9, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <Lock size={11} style={{ color: "#166534" }} />
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#166634" }}>E2E Active</span>
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse-dot 2s ease-in-out infinite" }} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ height: "100vh", display: "flex", overflow: "hidden", background: "var(--cream)", fontFamily: "Inter, sans-serif" }}>

            {/* ── Global Cmd+K Search ── */}
            <CmdSearch open={cmdOpen} onClose={() => setCmdOpen(false)} />

            {/* ── Icon Rail ── */}
            <aside style={{
                width: 60, flexShrink: 0,
                background: "#fff",
                borderRight: "1px solid var(--grey-2)",
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "12px 0 10px", gap: 4, zIndex: 20,
            }}>
                {/* Logo */}
                <Link href="/app/chat/general" style={{
                    width: 36, height: 36, borderRadius: 10, marginBottom: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform .2s", textDecoration: "none", overflow: "hidden",
                }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
                    <Image src="/logo.png" alt="CipherDesk" width={36} height={36} style={{ borderRadius: 10, objectFit: "cover" }} />
                </Link>

                <div style={{ width: 28, height: 1, background: "var(--grey-2)", marginBottom: 2 }} />

                {/* Core Nav items */}
                {MAIN_NAV.map(item => {
                    const active = isActive(item.match);
                    return (
                        <Link key={item.label} href={item.href} title={item.label}
                            style={{
                                width: 38, height: 38, borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: active ? "#fff" : "#A8A49C",
                                background: active ? "#0D0D0D" : "transparent",
                                transition: "all .18s", textDecoration: "none", position: "relative",
                            }}
                            onMouseEnter={e => {
                                if (!active) {
                                    (e.currentTarget as HTMLElement).style.background = "var(--grey-1)";
                                    (e.currentTarget as HTMLElement).style.color = "#0D0D0D";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!active) {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.color = "#A8A49C";
                                }
                            }}>
                            <item.icon size={17} />
                        </Link>
                    );
                })}

                <div style={{ flex: 1 }} />

                {/* Cmd+K search shortcut */}
                <button
                    onClick={() => setCmdOpen(true)}
                    title="Search (⌘K)"
                    style={{
                        width: 38, height: 38, borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#6B675E", background: "#F5F0E8",
                        border: "1.5px solid var(--grey-2)",
                        cursor: "pointer", transition: "all .2s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#0D0D0D"; (e.currentTarget as HTMLElement).style.color = "#AAEF45"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F5F0E8"; (e.currentTarget as HTMLElement).style.color = "#6B675E"; }}>
                    <Search size={15} />
                </button>

                {/* Settings */}
                <Link href={SETTINGS_HREF} title="Workspace Settings"
                    style={{
                        width: 38, height: 38, borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isActive("/app/settings") || isActive("/app/admin") || isActive("/app/keys") || isActive("/app/members") || isActive("/app/compliance") || isActive("/app/audit") || isActive("/app/integrations") ? "#0D0D0D" : "#6B675E",
                        background: isActive("/app/settings") || isActive("/app/admin") || isActive("/app/keys") || isActive("/app/members") || isActive("/app/compliance") || isActive("/app/audit") || isActive("/app/integrations") ? "var(--grey-2)" : "transparent",
                        transition: "all .18s", textDecoration: "none",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "var(--grey-1)";
                    }}
                    onMouseLeave={e => {
                        if (!(isActive("/app/settings") || isActive("/app/admin") || isActive("/app/keys") || isActive("/app/members") || isActive("/app/compliance") || isActive("/app/audit") || isActive("/app/integrations"))) {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                        }
                    }}>
                    <Settings size={18} />
                </Link>

                {/* Avatar + sign out */}
                <div style={{ position: "relative" }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 9, marginTop: 4,
                        background: "#AAEF45",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 800, color: "#0D0D0D", cursor: "pointer",
                        transition: "transform .2s",
                    }}
                        title="Sign out"
                        onClick={() => signOut()}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                        {initials}
                    </div>
                    {/* Online dot on own avatar */}
                    <div style={{ position: "absolute", bottom: 2, right: -1, width: 7, height: 7, borderRadius: "50%", background: "#22C55E", border: "2px solid #fff" }} />
                </div>
            </aside>

            {/* ── Channel/Context Sidebar ── */}
            {isChat ? <ChatSidebar /> : <GenericSidebar />}

            {/* ── Main area ── */}
            <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--grey-1)" }}>
                {children}
            </main>
        </div>
    );
}
