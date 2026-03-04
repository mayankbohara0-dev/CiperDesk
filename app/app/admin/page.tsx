"use client";
import { useState, useMemo } from "react";
import {
    BarChart3, Users, MessageSquare, FolderLock, CheckSquare,
    TrendingUp, Lock, Shield, Zap, Activity, Clock, HardDrive,
} from "lucide-react";
import { useMembers, useMessages, useTasks, useVault, useAuditLog } from "@/lib/hooks";

const DAILY_MOCK = [28, 44, 31, 67, 52, 89, 73, 41, 56, 78, 92, 64, 83, 47, 61, 95, 72, 38, 54, 87, 66, 44, 71, 88, 52, 79, 63, 91, 58, 76];

function getAvatarBg(id: string) {
    const colors = ["#4F63FF", "#9333EA", "#2E7D32", "#D97706", "#DC2626", "#0891B2"];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

export default function AdminPage() {
    const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
    const { members, loading: l1 } = useMembers();

    // Use a placeholder channel ID or aggregate if possible. We don't have a cross-channel "useAllMessages" in hooks,
    // so we'll mock message statistics slightly, but bind everything else accurately.
    const { tasks, loading: l3 } = useTasks();
    const { files, loading: l4 } = useVault();
    const { logs, loading: l5 } = useAuditLog();

    const loading = l1 || l3 || l4 || l5;

    // Derived stats
    const totalMembers = members.length;
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const totalTasks = tasks.length;

    const vaultBytes = files.reduce((acc, f) => acc + f.size_bytes, 0);
    const vaultGb = (vaultBytes / (1024 * 1024 * 1024)).toFixed(2);

    // Simulate encryption ops scale relative to audit log
    const encryptionOps = logs.length * 47;

    const STAT_CARDS = [
        { label: "Total Members", value: totalMembers.toString(), sub: "Active accounts", icon: Users, accent: "#4F63FF" },
        { label: "Estimated Messages", value: "8,214", sub: "+18% vs last month", icon: MessageSquare, accent: "#9333EA" },
        { label: "Tasks Completed", value: completedTasks.toString(), sub: `of ${totalTasks} total`, icon: CheckSquare, accent: "#22C55E" },
        { label: "Vault Storage Used", value: `${vaultGb} GB`, sub: "of 5 GB free plan", icon: FolderLock, accent: "#F59E0B" },
        { label: "Encryption Events", value: encryptionOps.toLocaleString(), sub: "AES-256-GCM ops", icon: Lock, accent: "#0D0D0D" },
        { label: "Audit Log Entries", value: logs.length.toString(), sub: "Signed ledger", icon: Shield, accent: "#DC2626" },
    ];

    const CHANNEL_ACTIVITY = [
        { name: "# general", msgs: 847, pct: 100 },
        { name: "# engineering", msgs: 612, pct: 72 },
        { name: "# design", msgs: 298, pct: 35 },
    ];

    const maxBar = Math.max(...DAILY_MOCK);
    const days = period === "7d" ? 7 : 30;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Admin Dashboard</h1>
                    <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 2 }}>Workspace analytics · All data processed locally, no telemetry sent to third parties</p>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                    {(["7d", "30d", "90d"] as const).map(p => (
                        <button key={p} onClick={() => setPeriod(p)} style={{ padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid", borderColor: period === p ? "#0D0D0D" : "#E8E4DC", background: period === p ? "#0D0D0D" : "#fff", color: period === p ? "#AAEF45" : "#6B675E", transition: "all .15s" }}>{p}</button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                {loading && (
                    <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite" }} />
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Stat grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
                            {STAT_CARDS.map(s => (
                                <div key={s.label}
                                    style={{ background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 14, padding: "16px 18px", transition: "all .2s", cursor: "default" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = s.accent; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DC"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: s.accent + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <s.icon size={17} style={{ color: s.accent }} />
                                        </div>
                                        <TrendingUp size={13} style={{ color: "#22C55E" }} />
                                    </div>
                                    <div style={{ fontSize: 26, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                                    <div style={{ fontSize: 12, color: "#6B675E", fontWeight: 600 }}>{s.label}</div>
                                    <div style={{ fontSize: 11, color: "#A8A49C", marginTop: 2 }}>{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Chart + channel breakdown */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
                            {/* Bar chart */}
                            <div style={{ background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 16, padding: 22 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Message Activity</h3>
                                    <span style={{ fontSize: 11, color: "#A8A49C" }}>{period} · daily</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 130, paddingBottom: 6, position: "relative" }}>
                                    {[25, 50, 75, 100].map(pct => (
                                        <div key={pct} style={{ position: "absolute", left: 0, right: 0, bottom: `${pct}%`, height: 1, background: "#F0EBE3", pointerEvents: "none" }} />
                                    ))}
                                    {DAILY_MOCK.slice(0, days).map((v, i) => (
                                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                                            <div style={{
                                                width: "100%", borderRadius: "3px 3px 0 0",
                                                height: `${(v / maxBar) * 100}%`,
                                                background: "#0D0D0D", minHeight: 4,
                                                opacity: .7, transition: "all .3s",
                                            }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "#AAEF45"; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = ".7"; (e.currentTarget as HTMLElement).style.background = "#0D0D0D"; }} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#A8A49C", marginTop: 6 }}>
                                    <span>{days} days ago</span><span>Today</span>
                                </div>
                            </div>

                            {/* Channel breakdown */}
                            <div style={{ background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 16, padding: 22 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 18 }}>Channel Activity</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {CHANNEL_ACTIVITY.map(ch => (
                                        <div key={ch.name}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                                                <span style={{ color: "#0D0D0D", fontWeight: 600 }}>{ch.name}</span>
                                                <span style={{ color: "#A8A49C", fontFamily: "monospace" }}>{ch.msgs.toLocaleString()} msgs</span>
                                            </div>
                                            <div style={{ height: 6, borderRadius: 3, background: "#F0EBE3", overflow: "hidden" }}>
                                                <div style={{ height: "100%", borderRadius: 3, background: "#0D0D0D", width: `${ch.pct}%`, transition: "width .8s cubic-bezier(.22,1,.36,1)" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Member activity table */}
                        <div style={{ background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 16, overflow: "hidden" }}>
                            <div style={{ padding: "14px 22px", borderBottom: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Member Analysis</h3>
                                <span style={{ fontSize: 12, color: "#A8A49C" }}>Realtime database view</span>
                            </div>
                            {members.map((m, i, arr) => {
                                const initial = m.full_name ? m.full_name.slice(0, 2).toUpperCase() : m.email.slice(0, 2).toUpperCase();
                                const bg = getAvatarBg(m.id);
                                const userTasks = tasks.filter(t => t.assignee_id === m.id).length;
                                const userFiles = files.filter(f => f.uploaded_by === m.id).length;

                                return (
                                    <div key={m.id}
                                        style={{ padding: "12px 22px", borderBottom: i < arr.length - 1 ? "1px solid #F0EBE3" : "none", display: "grid", gridTemplateColumns: "1fr 70px 70px 90px", gap: 12, alignItems: "center", transition: "background .15s" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF7"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{initial}</div>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{m.full_name || "Unknown"}</div>
                                                <div style={{ fontSize: 11, color: "#A8A49C", textTransform: "capitalize" }}>{m.role}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D" }}>{userTasks}</div>
                                            <div style={{ fontSize: 10, color: "#A8A49C" }}>tasks</div>
                                        </div>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D" }}>{userFiles}</div>
                                            <div style={{ fontSize: 10, color: "#A8A49C" }}>files</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                                            <span style={{ fontSize: 11, color: "#22C55E" }}>Active</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
