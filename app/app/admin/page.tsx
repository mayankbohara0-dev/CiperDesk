"use client";
import { useState } from "react";
import {
    BarChart3, Users, MessageSquare, FolderLock, CheckSquare,
    TrendingUp, TrendingDown, Lock, Shield, Zap, Activity,
    Clock, HardDrive,
} from "lucide-react";

const STAT_CARDS = [
    { label: "Total Members", value: "4", sub: "+1 this month", icon: Users, color: "#818CF8", trend: "up" },
    { label: "Messages (30d)", value: "2,417", sub: "+18% vs last month", icon: MessageSquare, color: "#22D3EE", trend: "up" },
    { label: "Tasks Completed", value: "89", sub: "of 112 total", icon: CheckSquare, color: "#6EE7B7", trend: "up" },
    { label: "Vault Storage Used", value: "2.1 GB", sub: "of 5 GB free plan", icon: FolderLock, color: "#FCD34D", trend: "neutral" },
    { label: "Encryption Events", value: "38,201", sub: "AES-256-GCM ops", icon: Lock, color: "#A78BFA", trend: "up" },
    { label: "Active Sessions", value: "3", sub: "3 devices online", icon: Activity, color: "#F87171", trend: "neutral" },
];

const CHANNEL_ACTIVITY = [
    { name: "# general", msgs: 847, pct: 100 },
    { name: "# engineering", msgs: 612, pct: 72 },
    { name: "# design", msgs: 298, pct: 35 },
    { name: "# builds", msgs: 156, pct: 18 },
    { name: "# random", msgs: 104, pct: 12 },
];

const DAILY = [28, 44, 31, 67, 52, 89, 73, 41, 56, 78, 92, 64, 83, 47, 61, 95, 72, 38, 54, 87, 66, 44, 71, 88, 52, 79, 63, 91, 58, 76];

export default function AdminPage() {
    const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

    const maxBar = Math.max(...DAILY);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <BarChart3 size={20} style={{ color: "#818CF8" }} />
                        <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Admin Dashboard</h1>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B" }}>Workspace analytics · All data processed locally, no telemetry sent to third parties</p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    {(["7d", "30d", "90d"] as const).map(p => (
                        <button key={p} onClick={() => setPeriod(p)} style={{
                            padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                            background: period === p ? "rgba(99,102,241,.2)" : "rgba(255,255,255,.04)",
                            color: period === p ? "#A5B4FC" : "#64748B",
                            outline: period === p ? "1px solid rgba(99,102,241,.3)" : "none",
                            transition: "all .15s",
                        }}>{p}</button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Stat grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                    {STAT_CARDS.map(s => (
                        <div key={s.label} style={{
                            background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "18px 20px",
                            transition: "all .25s",
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.07)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}1A`, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <s.icon size={17} style={{ color: s.color }} />
                                </div>
                                {s.trend === "up" && <TrendingUp size={14} style={{ color: "#10B981" }} />}
                                {s.trend === "down" && <TrendingDown size={14} style={{ color: "#EF4444" }} />}
                            </div>
                            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: "#475569" }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Activity chart + channel breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>

                    {/* Bar chart */}
                    <div style={{ background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Message Activity</h3>
                            <span style={{ fontSize: 11, color: "#64748B" }}>{period} · {period === "7d" ? "daily" : period === "30d" ? "daily" : "weekly"}</span>
                        </div>
                        {/* Chart */}
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140, paddingBottom: 8, position: "relative" }}>
                            {/* Grid lines */}
                            {[25, 50, 75, 100].map(pct => (
                                <div key={pct} style={{ position: "absolute", left: 0, right: 0, bottom: `${pct}%`, height: 1, background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
                            ))}
                            {DAILY.slice(0, period === "7d" ? 7 : period === "30d" ? 30 : 30).map((v, i) => (
                                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                                    <div style={{
                                        width: "100%", borderRadius: "3px 3px 0 0",
                                        height: `${(v / maxBar) * 100}%`,
                                        background: `linear-gradient(180deg, #6366F1, #4338CA)`,
                                        opacity: .75,
                                        transition: "all .3s",
                                        minHeight: 4,
                                    }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 8px rgba(99,102,241,.6)"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = ".75"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginTop: 6 }}>
                            <span>30 days ago</span><span>Today</span>
                        </div>
                    </div>

                    {/* Channel activity */}
                    <div style={{ background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: 24 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", marginBottom: 20 }}>Channel Activity</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {CHANNEL_ACTIVITY.map(ch => (
                                <div key={ch.name}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                                        <span style={{ color: "#CBD5E1", fontWeight: 500 }}>{ch.name}</span>
                                        <span style={{ color: "#64748B", fontFamily: "monospace" }}>{ch.msgs.toLocaleString()} msgs</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
                                        <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#6366F1,#22D3EE)", width: `${ch.pct}%`, transition: "width .8s cubic-bezier(.22,1,.36,1)" }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Member activity table */}
                <div style={{ background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Member Activity</h3>
                        <span style={{ fontSize: 12, color: "#64748B" }}>Last 30 days</span>
                    </div>
                    {[
                        { name: "Arjun Mehta", av: "AM", c: "#6366F1", msgs: 847, tasks: 34, files: 12, lastSeen: "Now", role: "Owner" },
                        { name: "Priya Sharma", av: "PS", c: "#8B5CF6", msgs: 612, tasks: 28, files: 9, lastSeen: "2h ago", role: "Admin" },
                        { name: "Rahul Nair", av: "RN", c: "#10B981", msgs: 298, tasks: 18, files: 5, lastSeen: "1d ago", role: "Member" },
                        { name: "Divya Kapoor", av: "DK", c: "#F59E0B", msgs: 104, tasks: 9, files: 3, lastSeen: "3d ago", role: "Member" },
                    ].map((m, i, arr) => (
                        <div key={m.name} style={{ padding: "14px 24px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 80px 100px", gap: 12, alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 9, background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", boxShadow: `0 0 10px ${m.c}44` }}>{m.av}</div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{m.name}</div>
                                    <div style={{ fontSize: 11, color: "#64748B" }}>{m.role}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>{m.msgs}</div>
                                <div style={{ fontSize: 10, color: "#475569" }}>messages</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>{m.tasks}</div>
                                <div style={{ fontSize: 10, color: "#475569" }}>tasks</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>{m.files}</div>
                                <div style={{ fontSize: 10, color: "#475569" }}>files</div>
                            </div>
                            <div style={{ textAlign: "center", fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                <Clock size={11} />{m.lastSeen}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.lastSeen === "Now" ? "#10B981" : "#475569" }} />
                                <span style={{ fontSize: 11, color: m.lastSeen === "Now" ? "#10B981" : "#475569" }}>
                                    {m.lastSeen === "Now" ? "Online" : "Offline"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Security summary */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                    {[
                        { icon: Shield, label: "Security Score", value: "94/100", note: "Strong", c: "#6EE7B7", bg: "rgba(16,185,129,.1)" },
                        { icon: Zap, label: "Uptime (30d)", value: "99.8%", note: "2 brief interruptions", c: "#818CF8", bg: "rgba(99,102,241,.1)" },
                        { icon: Lock, label: "Failed Login Attempts", value: "7", note: "3 from unknown IPs", c: "#FCD34D", bg: "rgba(245,158,11,.1)" },
                        { icon: HardDrive, label: "Keys Rotated", value: "2", note: "Recommended: monthly", c: "#67E8F9", bg: "rgba(6,182,212,.1)" },
                    ].map(s => (
                        <div key={s.label} style={{ background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "18px 20px" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                                <s.icon size={17} style={{ color: s.c }} />
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", marginBottom: 4 }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: "#475569" }}>{s.note}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
