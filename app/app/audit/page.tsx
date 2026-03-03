"use client";
import { useState } from "react";
import {
    ScrollText, Shield, Lock, Key, Download, Filter,
    MessageSquare, FolderLock, Users, Settings, LogIn,
    LogOut, AlertTriangle, RefreshCw, CheckSquare, ChevronDown,
} from "lucide-react";

type EventType = "auth" | "encryption" | "file" | "member" | "task" | "security";

interface AuditEvent {
    id: number; type: EventType; action: string;
    actor: string; av: string; color: string;
    detail: string; ip: string; ts: string; severity: "info" | "warn" | "critical";
}

const EVENTS: AuditEvent[] = [
    { id: 1, type: "security", action: "Key rotation completed", actor: "Arjun M.", av: "AM", color: "#6366F1", detail: "Workspace AES-256 key rotated. All member keys re-wrapped.", ip: "10.0.1.42", ts: "2026-03-03 21:02", severity: "info" },
    { id: 2, type: "auth", action: "New device approved", actor: "Priya S.", av: "PS", color: "#8B5CF6", detail: "MacBook Pro 14\" — Bangalore, IN · Device fingerprint verified", ip: "10.0.1.55", ts: "2026-03-03 20:44", severity: "info" },
    { id: 3, type: "member", action: "Member invited", actor: "Arjun M.", av: "AM", color: "#6366F1", detail: "Invited divya@buildfast.io as Member role", ip: "10.0.1.42", ts: "2026-03-03 19:31", severity: "info" },
    { id: 4, type: "file", action: "File uploaded to vault", actor: "Rahul N.", av: "RN", color: "#10B981", detail: "design-v3.figma (4.2 MB) — AES-256-GCM chunk-encrypted (9 chunks)", ip: "10.0.1.71", ts: "2026-03-03 18:14", severity: "info" },
    { id: 5, type: "security", action: "Failed 2FA attempt", actor: "Unknown", av: "?", color: "#EF4444", detail: "3 consecutive failed 2FA attempts — account temporarily locked", ip: "185.2.44.11", ts: "2026-03-03 17:02", severity: "critical" },
    { id: 6, type: "auth", action: "Login successful", actor: "Priya S.", av: "PS", color: "#8B5CF6", detail: "Authenticated via Argon2id + TOTP 2FA", ip: "10.0.1.55", ts: "2026-03-03 16:55", severity: "info" },
    { id: 7, type: "encryption", action: "Message decrypted", actor: "Arjun M.", av: "AM", color: "#6366F1", detail: "#general channel — 47 messages decrypted client-side", ip: "10.0.1.42", ts: "2026-03-03 16:30", severity: "info" },
    { id: 8, type: "task", action: "Task board accessed", actor: "Divya K.", av: "DK", color: "#F59E0B", detail: "Sprint board decrypted — 12 task records", ip: "10.0.1.88", ts: "2026-03-03 15:44", severity: "info" },
    { id: 9, type: "security", action: "Unrecognized device login attempt", actor: "Arjun M.", av: "AM", color: "#6366F1", detail: "New device detected — approval email sent", ip: "203.0.113.4", ts: "2026-03-03 14:28", severity: "warn" },
    { id: 10, type: "file", action: "File downloaded", actor: "Priya S.", av: "PS", color: "#8B5CF6", detail: "architecture-v2.pdf decrypted and downloaded (2.1 MB)", ip: "10.0.1.55", ts: "2026-03-03 13:12", severity: "info" },
    { id: 11, type: "member", action: "Role changed", actor: "Arjun M.", av: "AM", color: "#6366F1", detail: "Priya Sharma promoted from Member → Admin", ip: "10.0.1.42", ts: "2026-03-03 12:05", severity: "warn" },
    { id: 12, type: "auth", action: "Session expired", actor: "Rahul N.", av: "RN", color: "#10B981", detail: "Session timeout after 6hr inactivity. Keys cleared from memory.", ip: "10.0.1.71", ts: "2026-03-02 23:00", severity: "info" },
];

const TYPE_CONFIG: Record<EventType, { icon: React.ElementType; color: string; bg: string }> = {
    auth: { icon: LogIn, color: "#818CF8", bg: "rgba(99,102,241,.12)" },
    encryption: { icon: Lock, color: "#22D3EE", bg: "rgba(6,182,212,.1)" },
    file: { icon: FolderLock, color: "#A78BFA", bg: "rgba(139,92,246,.12)" },
    member: { icon: Users, color: "#6EE7B7", bg: "rgba(16,185,129,.1)" },
    task: { icon: CheckSquare, color: "#FCD34D", bg: "rgba(245,158,11,.1)" },
    security: { icon: Shield, color: "#FB7185", bg: "rgba(244,63,94,.1)" },
};

const SEV_CONFIG = {
    info: { label: "Info", styles: { background: "rgba(6,182,212,.1)", color: "#67E8F9", border: "1px solid rgba(6,182,212,.2)" } },
    warn: { label: "Warning", styles: { background: "rgba(245,158,11,.1)", color: "#FCD34D", border: "1px solid rgba(245,158,11,.2)" } },
    critical: { label: "Critical", styles: { background: "rgba(244,63,94,.1)", color: "#FDA4AF", border: "1px solid rgba(244,63,94,.2)" } },
};

export default function AuditLogPage() {
    const [filter, setFilter] = useState<"all" | EventType>("all");
    const [sev, setSev] = useState<"all" | "info" | "warn" | "critical">("all");

    const filtered = EVENTS.filter(e =>
        (filter === "all" || e.type === filter) &&
        (sev === "all" || e.severity === sev)
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <ScrollText size={20} style={{ color: "#818CF8" }} />
                        <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Audit Log</h1>
                        <span style={{ padding: "2px 10px", borderRadius: 100, background: "rgba(239,68,68,.12)", color: "#FDA4AF", fontSize: 12, fontWeight: 600, border: "1px solid rgba(239,68,68,.2)" }}>
                            1 Critical
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B" }}>Immutable log of all workspace security and encryption events</p>
                </div>
                <button className="btn-secondary" style={{ gap: 8, fontSize: 13 }}>
                    <Download size={15} /> Export Log
                </button>
            </div>

            {/* Filters */}
            <div style={{ padding: "12px 28px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
                <Filter size={13} style={{ color: "#64748B" }} />
                {(["all", "auth", "encryption", "file", "member", "task", "security"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        style={{
                            padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
                            background: filter === f ? "rgba(99,102,241,.2)" : "rgba(255,255,255,.04)",
                            color: filter === f ? "#A5B4FC" : "#64748B",
                            outline: filter === f ? "1px solid rgba(99,102,241,.3)" : "none",
                            transition: "all .15s",
                        }}>
                        {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    {(["all", "info", "warn", "critical"] as const).map(s => (
                        <button key={s} onClick={() => setSev(s)}
                            style={{
                                padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none",
                                background: sev === s ? (s === "critical" ? "rgba(244,63,94,.2)" : s === "warn" ? "rgba(245,158,11,.15)" : "rgba(99,102,241,.2)") : "rgba(255,255,255,.04)",
                                color: sev === s ? (s === "critical" ? "#FDA4AF" : s === "warn" ? "#FCD34D" : "#A5B4FC") : "#64748B",
                                transition: "all .15s",
                            }}>
                            {s === "all" ? "All severity" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Log entries */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
                <div style={{ background: "rgba(12,24,50,.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, overflow: "hidden" }}>
                    {filtered.length === 0 && (
                        <div style={{ padding: 48, textAlign: "center", color: "#64748B", fontSize: 14 }}>No events match your filters.</div>
                    )}
                    {filtered.map((ev, i) => {
                        const TC = TYPE_CONFIG[ev.type];
                        const SC = SEV_CONFIG[ev.severity];
                        const Icon = TC.icon;
                        return (
                            <div key={ev.id} style={{
                                display: "grid",
                                gridTemplateColumns: "36px 1fr auto",
                                gap: 14, alignItems: "flex-start",
                                padding: "14px 20px",
                                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
                                transition: "background .15s",
                                ...(ev.severity === "critical" ? { background: "rgba(244,63,94,.03)" } : {}),
                            }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.025)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ev.severity === "critical" ? "rgba(244,63,94,.03)" : "transparent"}>

                                {/* Icon */}
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: TC.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Icon size={16} style={{ color: TC.color }} />
                                </div>

                                {/* Content */}
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{ev.action}</span>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 8px", borderRadius: 100, fontSize: 10, fontWeight: 600, ...SC.styles }}>
                                            {ev.severity === "critical" && <AlertTriangle size={9} />}{SC.label}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>{ev.detail}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ width: 20, height: 20, borderRadius: 6, background: ev.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>{ev.av}</div>
                                            <span style={{ fontSize: 11, color: "#64748B" }}>{ev.actor}</span>
                                        </div>
                                        <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>IP: {ev.ip}</span>
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", whiteSpace: "nowrap" as const, paddingTop: 2 }}>{ev.ts}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Compliance note */}
                <div style={{ marginTop: 16, padding: "14px 20px", borderRadius: 14, background: "rgba(6,182,212,.04)", border: "1px solid rgba(6,182,212,.12)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Shield size={15} style={{ color: "#22D3EE", flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.65 }}>
                        <strong style={{ color: "#CBD5E1" }}>Audit integrity: </strong>
                        Every entry is cryptographically signed with the server&apos;s Ed25519 key and stored append-only.
                        Entries cannot be modified or deleted. Export includes a SHA-256 chain hash for tamper detection.
                    </p>
                </div>
            </div>
        </div>
    );
}
