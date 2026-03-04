"use client";
import { useState } from "react";
import {
    ScrollText, Shield, Lock, Download, Filter,
    FolderLock, Users, LogIn, AlertTriangle, CheckSquare, Check, Clock,
} from "lucide-react";
import { useAuditLog, type AuditLogEntry } from "@/lib/hooks";

type EventType = "auth" | "encryption" | "file" | "member" | "task" | "security";

const TYPE: Record<string, { icon: React.ElementType; iconBg: string; iconColor: string }> = {
    auth: { icon: LogIn, iconBg: "#EEF2FF", iconColor: "#4F63FF" },
    encryption: { icon: Lock, iconBg: "#ECFEFF", iconColor: "#0891B2" },
    file: { icon: FolderLock, iconBg: "#F5F3FF", iconColor: "#7C3AED" },
    member: { icon: Users, iconBg: "#F0FDF4", iconColor: "#16A34A" },
    task: { icon: CheckSquare, iconBg: "#FFFBEB", iconColor: "#D97706" },
    security: { icon: Shield, iconBg: "#FFF1F2", iconColor: "#E11D48" },
};

const SEV: Record<string, { label: string; bg: string; color: string }> = {
    info: { label: "Info", bg: "#ECFEFF", color: "#0891B2" },
    warn: { label: "Warning", bg: "#FFFBEB", color: "#D97706" },
    critical: { label: "Critical", bg: "#FFF1F2", color: "#E11D48" },
};

const FILTERS = ["all", "auth", "encryption", "file", "member", "task", "security"] as const;
const SEVS = ["all", "info", "warn", "critical"] as const;

function getAvatarBg(id: string) {
    const colors = ["#4F63FF", "#9333EA", "#2E7D32", "#D97706", "#DC2626", "#0891B2"];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

export default function AuditLogPage() {
    const { logs, loading } = useAuditLog();
    const [filter, setFilter] = useState<"all" | EventType>("all");
    const [sev, setSev] = useState<"all" | "info" | "warn" | "critical">("all");

    const filtered = logs.filter(e =>
        (filter === "all" || e.type === filter) &&
        (sev === "all" || e.severity === sev)
    );

    const criticalCount = logs.filter(e => e.severity === "critical").length;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Audit Log</h1>
                    {!loading && criticalCount > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "#FFF1F2", color: "#E11D48", border: "1px solid #FECDD3" }}>
                            {criticalCount} Critical
                        </span>
                    )}
                    <span style={{ fontSize: 12, color: "#A8A49C" }}>Immutable · cryptographically signed entries</span>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>
                    <Download size={14} /> Export Log
                </button>
            </div>

            {/* Filter bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0, flexWrap: "wrap", zIndex: 10 }}>
                <Filter size={13} style={{ color: "#A8A49C" }} />
                <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f as typeof filter)}
                            style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid", borderColor: filter === f ? "#0D0D0D" : "#E8E4DC", background: filter === f ? "#0D0D0D" : "#fff", color: filter === f ? "#AAEF45" : "#6B675E", transition: "all .15s", whiteSpace: "nowrap" }}>
                            {f === "all" ? "All events" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    {SEVS.map(s => {
                        return (
                            <button key={s} onClick={() => setSev(s as typeof sev)}
                                style={{ padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "1.5px solid", borderColor: sev === s ? "#0D0D0D" : "#E8E4DC", background: sev === s ? "#0D0D0D" : "#fff", color: sev === s ? "#AAEF45" : "#6B675E", transition: "all .15s" }}>
                                {s === "all" ? "All severity" : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Log entries */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
                <div style={{ background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 16, overflow: "hidden" }}>
                    {loading ? (
                        <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite" }} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 48, textAlign: "center", color: "#A8A49C", fontSize: 14 }}>No events match your filters.</div>
                    ) : (
                        filtered.map((ev, i) => {
                            const t = TYPE[ev.type] || TYPE.system;
                            const s = SEV[ev.severity] || SEV.info;
                            const Icon = t?.icon || ScrollText;

                            const actorName = ev.actor?.full_name || ev.actor?.email || "System/Unknown";
                            const initials = ev.actor_id && actorName !== "System/Unknown" ? actorName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "SY";
                            const bg = ev.actor_id ? getAvatarBg(ev.actor_id) : "#6B675E";
                            const date = new Date(ev.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

                            return (
                                <div key={ev.id}
                                    style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 14, alignItems: "flex-start", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #F0EBE3" : "none", background: ev.severity === "critical" ? "#FFF8F8" : "transparent", transition: "background .15s", cursor: "default" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = ev.severity === "critical" ? "#FFF1F2" : "#FAFAF7"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ev.severity === "critical" ? "#FFF8F8" : "transparent"}>

                                    {/* Type icon */}
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: t?.iconBg || "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Icon size={16} style={{ color: t?.iconColor || "#6B675E" }} />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{ev.action}</span>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, background: s.bg, color: s.color }}>
                                                {ev.severity === "critical" && <AlertTriangle size={9} />}
                                                {s.label}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: 12, color: "#6B675E", marginBottom: 6, lineHeight: 1.5 }}>{ev.detail}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: 6, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>{initials}</div>
                                                <span style={{ fontSize: 11, color: "#A8A49C" }}>{actorName}</span>
                                            </div>
                                            {ev.ip && <span style={{ fontSize: 11, color: "#C8C4BC", fontFamily: "monospace" }}>IP: {ev.ip}</span>}
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div style={{ fontSize: 11, color: "#A8A49C", fontFamily: "monospace", whiteSpace: "nowrap", paddingTop: 2 }}>{date}</div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Integrity note */}
                <div style={{ marginTop: 14, background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "13px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Shield size={14} style={{ color: "#166534", flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.65 }}>
                        <strong>Audit integrity:</strong> Every entry is cryptographically signed with the server&apos;s Ed25519 key and stored append-only. Entries cannot be modified or deleted. Export includes a SHA-256 chain hash for tamper detection.
                    </p>
                </div>
            </div>
        </div>
    );
}
