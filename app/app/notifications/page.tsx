"use client";

import { useState } from "react";
import {
    Bell,
    Lock,
    CheckSquare,
    MessageSquare,
    UserPlus,
    Shield,
    KeyRound,
    Check,
    Trash2,
    CheckCheck,
    Settings,
} from "lucide-react";

type NotifType = "message" | "task" | "security" | "invite" | "system";

type Notification = {
    id: string;
    type: NotifType;
    title: string;
    body: string;
    time: string;
    read: boolean;
    avatar?: string;
    avatarColor?: string;
};

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
    message: { icon: MessageSquare, color: "text-primary-400", bg: "bg-primary-500/10 border-primary-500/20" },
    task: { icon: CheckSquare, color: "text-accent-400", bg: "bg-accent-400/10 border-accent-400/20" },
    security: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    invite: { icon: UserPlus, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    system: { icon: KeyRound, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
};

const INITIAL_NOTIFS: Notification[] = [
    {
        id: "1", type: "security", read: false,
        title: "New device login detected",
        body: "A new device (Windows PC · Edge 121) signed into your account from Pune, India. Not you? Revoke access immediately.",
        time: "Just now",
        avatar: "🔐",
    },
    {
        id: "2", type: "message", read: false,
        title: "Arjun Mehta mentioned you",
        body: "@You can you check the auth service PR? I pushed the Argon2id implementation.",
        time: "5 min ago",
        avatar: "AM", avatarColor: "bg-primary-500",
    },
    {
        id: "3", type: "task", read: false,
        title: "Task assigned to you",
        body: "Priya Sharma assigned \"Design workspace key rotation flow\" to you. Due Mar 8.",
        time: "22 min ago",
        avatar: "PS", avatarColor: "bg-violet-500",
    },
    {
        id: "4", type: "invite", read: true,
        title: "Rahul Nair joined the workspace",
        body: "Rahul Nair accepted the invite and joined BuildFast HQ. Keys distributed automatically.",
        time: "1 hour ago",
        avatar: "RN", avatarColor: "bg-green-600",
    },
    {
        id: "5", type: "system", read: true,
        title: "Workspace key rotated",
        body: "Admin triggered a key rotation. Your workspace encryption key has been renewed and re-encrypted for all members.",
        time: "3 hours ago",
    },
    {
        id: "6", type: "task", read: true,
        title: "Task completed",
        body: "Arjun Mehta marked \"User auth flow testing\" as Done.",
        time: "Yesterday",
        avatar: "AM", avatarColor: "bg-primary-500",
    },
    {
        id: "7", type: "security", read: true,
        title: "2FA verification successful",
        body: "Two-factor authentication was verified from MacBook Pro. Everything looks good.",
        time: "Yesterday",
    },
    {
        id: "8", type: "message", read: true,
        title: "New message in #engineering",
        body: "Priya Sharma: The file vault encryption spec is ready. Check the doc in vault.",
        time: "2 days ago",
        avatar: "PS", avatarColor: "bg-violet-500",
    },
];

type FilterType = "all" | "unread" | NotifType;

export default function NotificationsPage() {
    const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
    const [filter, setFilter] = useState<FilterType>("all");

    const unreadCount = notifs.filter((n) => !n.read).length;

    const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    const markRead = (id: string) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
    const dismiss = (id: string) => setNotifs((p) => p.filter((n) => n.id !== id));

    const filtered = notifs.filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.read;
        return n.type === filter;
    });

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-slate-100">Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="badge-primary text-xs">{unreadCount} unread</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={markAllRead} className="btn-ghost text-xs gap-1.5">
                        <CheckCheck size={13} />
                        Mark all read
                    </button>
                    <button className="btn-ghost gap-1.5">
                        <Settings size={15} />
                        Preferences
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Filter sidebar */}
                <div className="w-48 flex-shrink-0 border-r border-surface-border p-3 space-y-1">
                    {([
                        ["all", "All", Bell],
                        ["unread", "Unread", Bell],
                        ["message", "Messages", MessageSquare],
                        ["task", "Tasks", CheckSquare],
                        ["security", "Security", Shield],
                        ["invite", "Invites", UserPlus],
                        ["system", "System", KeyRound],
                    ] as [FilterType, string, React.ElementType][]).map(([key, label, Icon]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${filter === key
                                ? "bg-primary-500/15 text-primary-300 border border-primary-500/20"
                                : "text-slate-400 hover:text-slate-200 hover:bg-surface-raised"
                                }`}
                        >
                            <Icon size={15} />
                            {label}
                            {key === "unread" && unreadCount > 0 && (
                                <span className="ml-auto text-xs bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Notification list */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-surface-border flex items-center justify-center">
                                <Bell size={24} className="text-slate-500" />
                            </div>
                            <p className="text-slate-500 text-sm">No notifications here</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-surface-border">
                            {filtered.map((n) => {
                                const { icon: Icon, color, bg } = TYPE_CONFIG[n.type];
                                return (
                                    <div
                                        key={n.id}
                                        className={`flex items-start gap-4 px-6 py-4 hover:bg-surface-raised/50 transition-colors group cursor-pointer ${!n.read ? "bg-primary-500/3" : ""}`}
                                        onClick={() => markRead(n.id)}
                                    >
                                        {/* Icon or avatar */}
                                        <div className="relative flex-shrink-0">
                                            {n.avatar && n.avatarColor ? (
                                                <div className={`w-10 h-10 rounded-xl ${n.avatarColor} flex items-center justify-center text-sm font-bold text-white`}>
                                                    {n.avatar[0]}
                                                </div>
                                            ) : (
                                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg}`}>
                                                    <Icon size={18} className={color} />
                                                </div>
                                            )}
                                            {!n.read && (
                                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary-500 border-2 border-dark" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-semibold ${n.read ? "text-slate-300" : "text-slate-100"}`}>
                                                    {n.title}
                                                </p>
                                                <span className="text-xs text-slate-500 flex-shrink-0">{n.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                                            {n.type === "security" && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button className="btn-danger py-1 px-3 text-xs" onClick={(e) => e.stopPropagation()}>
                                                        Revoke Device
                                                    </button>
                                                    <button className="btn-ghost text-xs py-1 px-3" onClick={(e) => e.stopPropagation()}>
                                                        It was me
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-200 hover:bg-surface-border transition-all"
                                            title="Dismiss"
                                        >
                                            <Trash2 size={13} />
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
