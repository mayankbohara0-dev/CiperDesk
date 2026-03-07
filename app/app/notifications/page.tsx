"use client";
import { useState, useEffect } from "react";
import {
    Bell, Lock, CheckSquare, MessageSquare, UserPlus, Shield,
    KeyRound, Check, Trash2, CheckCheck, Settings,
} from "lucide-react";
import { useNotifications, useUser } from "@/lib/hooks";
import { supabase } from "@/lib/supabase/client";

type NotifType = "message" | "task" | "security" | "invite" | "system" | "mention" | "task_assigned";
type FilterType = "all" | "unread" | NotifType;

const TYPE_CFG: Record<string, { icon: React.ElementType; iconBg: string; iconColor: string }> = {
    message: { icon: MessageSquare, iconBg: "#EEF2FF", iconColor: "#4F63FF" },
    mention: { icon: MessageSquare, iconBg: "#EEF2FF", iconColor: "#4F63FF" },
    task: { icon: CheckSquare, iconBg: "#F5F0E8", iconColor: "#D97706" },
    task_assigned: { icon: CheckSquare, iconBg: "#F5F0E8", iconColor: "#D97706" },
    security: { icon: Shield, iconBg: "#FFF1F2", iconColor: "#E11D48" },
    invite: { icon: UserPlus, iconBg: "#F5F3FF", iconColor: "#7C3AED" },
    system: { icon: KeyRound, iconBg: "#FFFBEB", iconColor: "#D97706" },
};

const SIDEBAR_FILTERS: [FilterType, string, React.ElementType][] = [
    ["all", "All", Bell],
    ["unread", "Unread", Bell],
    ["message", "Messages", MessageSquare],
    ["task", "Tasks", CheckSquare],
    ["security", "Security", Shield],
    ["invite", "Invites", UserPlus],
    ["system", "System", KeyRound],
];

export default function NotificationsPage() {
    const { user } = useUser();
    const { notifications, loading, markAsRead, clearAll } = useNotifications(user?.id);
    const [filter, setFilter] = useState<FilterType>("all");

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const filtered = notifications.filter(n => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.is_read;
        if (filter === "message") return n.type === "message" || n.type === "mention";
        if (filter === "task") return n.type === "task" || n.type === "task_assigned";
        return n.type === filter;
    });

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.is_read);
        await Promise.all(unread.map(n => markAsRead(n.id)));
    };

    const dismiss = async (id: string) => {
        await supabase.from("notifications").delete().eq("id", id);
    };

    // Realtime subscription for new notifications
    useEffect(() => {
        if (!user?.id) return;
        const channel = supabase
            .channel(`notifs-${user.id}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${user.id}`,
            }, () => {
                // Trigger re-fetch by marking stale (hook will handle)
                window.dispatchEvent(new CustomEvent("notif-refresh"));
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [user?.id]);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Notifications</h1>
                    {!loading && unreadCount > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 999, background: "#AAEF45", color: "#0D0D0D" }}>{unreadCount} unread</span>
                    )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={markAllAsRead}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, border: "1.5px solid #E8E4DC", background: unreadCount > 0 ? "#AAEF45" : "#fff", fontSize: 12, fontWeight: 600, color: unreadCount > 0 ? "#0D0D0D" : "#6B675E", cursor: unreadCount > 0 ? "pointer" : "default", transition: "all .15s" }}>
                        <CheckCheck size={13} /> Mark all read {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                    <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 12, fontWeight: 600, color: "#6B675E", cursor: "pointer" }}>
                        <Settings size={13} /> Preferences
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* Sidebar filter */}
                <div style={{ width: 196, flexShrink: 0, borderRight: "1.5px solid #E8E4DC", background: "#fff", padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                    {SIDEBAR_FILTERS.map(([key, label, Icon]) => {
                        const active = filter === key;
                        const count = notifications.filter(n => {
                            if (key === "unread") return !n.is_read;
                            if (key === "message") return (n.type === "message" || n.type === "mention") && !n.is_read;
                            if (key === "task") return (n.type === "task" || n.type === "task_assigned") && !n.is_read;
                            return n.type === key && !n.is_read;
                        }).length;

                        return (
                            <button key={key} onClick={() => setFilter(key)}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? "#0D0D0D" : "transparent", color: active ? "#AAEF45" : "#6B675E", fontWeight: active ? 700 : 500, fontSize: 13, fontFamily: "Inter,sans-serif", transition: "all .15s", textAlign: "left" }}
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#F5F0E8"; }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                                <Icon size={14} />
                                <span style={{ flex: 1 }}>{label}</span>
                                {key === "unread" && count > 0 && (
                                    <span style={{ fontSize: 10, fontWeight: 900, width: 18, height: 18, borderRadius: "50%", background: "#AAEF45", color: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Notification list */}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite" }} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14, padding: 40 }}>
                            <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Bell size={22} style={{ color: "#C8C4BC" }} />
                            </div>
                            <p style={{ fontSize: 14, color: "#A8A49C" }}>No notifications here</p>
                        </div>
                    ) : (
                        <div>
                            {filtered.map(n => {
                                const { icon: Icon, iconBg, iconColor } = TYPE_CFG[n.type] || TYPE_CFG.system;
                                const dateStr = new Date(n.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

                                return (
                                    <div key={n.id}
                                        style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 20px", borderBottom: "1px solid #F0EBE3", background: !n.is_read ? "#FDFDF9" : "transparent", transition: "background .15s", cursor: "pointer", position: "relative" }}
                                        onClick={() => !n.is_read && markAsRead(n.id)}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.background = "#FAFAF7";
                                            const btn = e.currentTarget.querySelector(".dismiss-btn") as HTMLElement;
                                            if (btn) { btn.style.opacity = "1"; btn.style.pointerEvents = "auto"; }
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.background = !n.is_read ? "#FDFDF9" : "transparent";
                                            const btn = e.currentTarget.querySelector(".dismiss-btn") as HTMLElement;
                                            if (btn) { btn.style.opacity = "0"; btn.style.pointerEvents = "none"; }
                                        }}>

                                        {/* Icon / avatar */}
                                        <div style={{ position: "relative", flexShrink: 0 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon size={18} style={{ color: iconColor }} />
                                            </div>
                                            {!n.is_read && <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#AAEF45", border: "2px solid #fff" }} />}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                                <p style={{ fontSize: 13, fontWeight: n.is_read ? 600 : 800, color: "#0D0D0D" }}>{n.title}</p>
                                                <span style={{ fontSize: 11, color: "#A8A49C", flexShrink: 0 }}>{dateStr}</span>
                                            </div>
                                            <p style={{ fontSize: 12, color: "#6B675E", marginTop: 3, lineHeight: 1.55 }}>{n.body}</p>
                                        </div>

                                        {/* Dismiss */}
                                        <button className="dismiss-btn" onClick={async (e) => { e.stopPropagation(); await dismiss(n.id); }}
                                            style={{ opacity: 0, pointerEvents: "none", position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", padding: 6, borderRadius: 8, border: "none", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer", color: "#DC2626", transition: "all .15s", flexShrink: 0 }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#FEE2E2"; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                                            title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
