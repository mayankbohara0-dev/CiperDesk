"use client";
import { useState } from "react";
import {
    ShieldCheck, Download, FileText, Lock, Check, AlertTriangle,
    Clock, RefreshCw, Globe, Archive, Trash2, Eye,
} from "lucide-react";

type TabId = "overview" | "export" | "retention" | "gdpr";

const CHECKS = [
    { label: "End-to-End Encryption", status: "pass", detail: "AES-256-GCM · all messages, tasks, files" },
    { label: "Zero-Knowledge Architecture", status: "pass", detail: "Server stores only ciphertext + metadata" },
    { label: "Password Hashing (Argon2id)", status: "pass", detail: "m=64MB, t=3, p=4 · not stored server-side" },
    { label: "Two-Factor Authentication", status: "pass", detail: "All members have TOTP 2FA enabled" },
    { label: "Device Key Verification", status: "warn", detail: "1 member (Divya) key not yet verified peer-to-peer" },
    { label: "Workspace Key Rotation", status: "warn", detail: "Last rotated: Jan 12, 2026 · Recommended: monthly" },
    { label: "Session Timeout Policy", status: "pass", detail: "6hr inactivity timeout · immediate key wipe" },
    { label: "TLS 1.3 in Transit", status: "pass", detail: "ECDHE + AES-256-GCM · HSTS enforced" },
    { label: "Audit Log Integrity", status: "pass", detail: "Ed25519 signed entries · append-only store" },
    { label: "Third-party Security Audit", status: "pending", detail: "Planned for Phase 3 · Q3 2026" },
];

const RETENTION_OPTIONS = ["30 days", "90 days", "1 year", "2 years", "Forever"];

export default function CompliancePage() {
    const [tab, setTab] = useState<TabId>("overview");
    const [retention, setRetention] = useState("1 year");
    const [exporting, setExporting] = useState(false);
    const [exported, setExported] = useState(false);

    const handleExport = () => {
        setExporting(true);
        setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 3000); }, 2500);
    };

    const pass = CHECKS.filter(c => c.status === "pass").length;
    const warn = CHECKS.filter(c => c.status === "warn").length;
    const pending = CHECKS.filter(c => c.status === "pending").length;
    const score = Math.round((pass / CHECKS.length) * 100);

    const card = { background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16 } as React.CSSProperties;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <ShieldCheck size={20} style={{ color: "#818CF8" }} />
                        <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Compliance Center</h1>
                        <span style={{ padding: "2px 10px", borderRadius: 100, background: "rgba(16,185,129,.12)", color: "#6EE7B7", fontSize: 12, fontWeight: 600, border: "1px solid rgba(16,185,129,.25)" }}>
                            Score: {score}%
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B" }}>Security compliance overview, data exports, retention policies, and GDPR controls</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, padding: "10px 28px", borderBottom: "1px solid rgba(255,255,255,.05)", flexShrink: 0 }}>
                {([["overview", "Overview"], ["export", "Data Export"], ["retention", "Retention"], ["gdpr", "GDPR / Privacy"]] as [TabId, string][]).map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)} style={{
                        padding: "7px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                        background: tab === id ? "rgba(99,102,241,.18)" : "transparent",
                        color: tab === id ? "#A5B4FC" : "#64748B",
                        outline: tab === id ? "1px solid rgba(99,102,241,.3)" : "none", transition: "all .15s",
                    }}>{label}</button>
                ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

                {/* OVERVIEW */}
                {tab === "overview" && (
                    <>
                        {/* Score cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                            {[
                                { val: pass, unit: "checks", label: "Passing", c: "#6EE7B7", bg: "rgba(16,185,129,.1)", border: "rgba(16,185,129,.2)" },
                                { val: warn, unit: "issues", label: "Warnings", c: "#FCD34D", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.2)" },
                                { val: pending, unit: "items", label: "Pending", c: "#818CF8", bg: "rgba(99,102,241,.1)", border: "rgba(99,102,241,.2)" },
                            ].map(s => (
                                <div key={s.label} style={{ ...card, padding: "18px 22px", border: `1px solid ${s.border}`, background: s.bg }}>
                                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: s.c, lineHeight: 1 }}>{s.val}</div>
                                    <div style={{ fontSize: 13, color: s.c, opacity: .8, marginTop: 4 }}>{s.label} {s.unit}</div>
                                </div>
                            ))}
                        </div>

                        {/* Checklist */}
                        <div style={{ ...card, overflow: "hidden" }}>
                            <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Security Checklist</h3>
                            </div>
                            {CHECKS.map((c, i) => (
                                <div key={c.label} style={{ padding: "13px 22px", borderBottom: i < CHECKS.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", display: "flex", alignItems: "center", gap: 14, transition: "background .15s" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                    <div style={{
                                        width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                        background: c.status === "pass" ? "rgba(16,185,129,.15)" : c.status === "warn" ? "rgba(245,158,11,.15)" : "rgba(99,102,241,.12)",
                                        border: `1px solid ${c.status === "pass" ? "rgba(16,185,129,.3)" : c.status === "warn" ? "rgba(245,158,11,.3)" : "rgba(99,102,241,.25)"}`,
                                    }}>
                                        {c.status === "pass" && <Check size={13} style={{ color: "#10B981" }} />}
                                        {c.status === "warn" && <AlertTriangle size={11} style={{ color: "#F59E0B" }} />}
                                        {c.status === "pending" && <Clock size={11} style={{ color: "#818CF8" }} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: c.status === "pass" ? "#CBD5E1" : c.status === "warn" ? "#FCD34D" : "#A5B4FC", marginBottom: 3 }}>{c.label}</div>
                                        <div style={{ fontSize: 11, color: "#64748B" }}>{c.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* DATA EXPORT */}
                {tab === "export" && (
                    <>
                        <div style={{ ...card, padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <Archive size={18} style={{ color: "#818CF8" }} />
                                <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Full Workspace Export</h3>
                            </div>
                            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7, marginBottom: 20 }}>
                                Export an encrypted archive of all workspace data: messages, tasks, vault files, and audit logs.
                                The export is a JSON bundle encrypted with AES-256-GCM using your workspace key.
                                Only workspace members with the workspace key can decrypt it.
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                                {[
                                    { icon: FileText, label: "Messages", count: "2,417 encrypted" },
                                    { icon: Lock, label: "Files", count: "23 vault items" },
                                    { icon: Archive, label: "Audit Log", count: "847 entries" },
                                ].map(item => (
                                    <div key={item.label} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(3,7,17,.8)", border: "1px solid rgba(255,255,255,.07)", display: "flex", flexDirection: "column", gap: 8 }}>
                                        <item.icon size={16} style={{ color: "#818CF8" }} />
                                        <div style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>{item.label}</div>
                                        <div style={{ fontSize: 11, color: "#64748B" }}>{item.count}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(6,182,212,.04)", border: "1px solid rgba(6,182,212,.15)", fontSize: 12, color: "#94A3B8", marginBottom: 16, display: "flex", gap: 10 }}>
                                <Lock size={13} style={{ color: "#22D3EE", flexShrink: 0, marginTop: 1 }} />
                                Export is AES-256-GCM encrypted. The server streams ciphertext — your browser decrypts and re-encrypts for the archive. Estimated size: ~180 MB.
                            </div>
                            <button className="btn-primary" onClick={handleExport} disabled={exporting} style={{ gap: 10 }}>
                                {exporting
                                    ? <><span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} />Preparing export…</>
                                    : exported ? <><Check size={15} />Export ready — downloading</>
                                        : <><Download size={15} />Export All Data (Encrypted)</>}
                            </button>
                        </div>
                        <div style={{ ...card, padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <Clock size={18} style={{ color: "#818CF8" }} />
                                <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Scheduled Exports</h3>
                            </div>
                            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(3,7,17,.8)", border: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", marginBottom: 3 }}>Monthly encrypted digest (first of month)</div>
                                    <div style={{ fontSize: 11, color: "#64748B" }}>Last exported: Mar 1, 2026 · Next: Apr 1, 2026</div>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 100, background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)", color: "#6EE7B7" }}>Active</span>
                            </div>
                        </div>
                    </>
                )}

                {/* RETENTION */}
                {tab === "retention" && (
                    <div style={{ ...card, padding: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <RefreshCw size={18} style={{ color: "#818CF8" }} />
                            <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Data Retention Policy</h3>
                        </div>
                        <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7, marginBottom: 24 }}>
                            Set how long encrypted messages, tasks, and files are stored on CipherDesk servers.
                            After the retention period, data is permanently deleted from our servers.
                            You can export before deletion (see Data Export tab).
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                            {["Messages", "Task History", "Vault Files", "Audit Log"].map(cat => (
                                <div key={cat} style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(3,7,17,.8)", border: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{cat}</div>
                                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>Encrypted · stored per workspace policy</div>
                                    </div>
                                    <select value={retention} onChange={e => setRetention(e.target.value)} className="input-field" style={{ width: 140, padding: "7px 12px", fontSize: 12, margin: 0 }}>
                                        {RETENTION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary" style={{ gap: 8 }}><Check size={15} />Save Retention Policy</button>
                    </div>
                )}

                {/* GDPR */}
                {tab === "gdpr" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ ...card, padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <Globe size={18} style={{ color: "#818CF8" }} />
                                <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>GDPR & Privacy Controls</h3>
                            </div>
                            <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
                                CipherDesk processes minimal personal data and stores it encrypted.
                                Your workspace content is zero-knowledge — no personal data analysis is performed on encrypted content.
                            </p>
                        </div>
                        {[
                            { icon: Eye, title: "Right to Access", desc: "Request a full copy of all data CipherDesk holds about you as a workspace member.", action: "Request Data Report", variant: "btn-secondary" },
                            { icon: Trash2, title: "Right to Erasure", desc: "Permanently delete your account and all associated encrypted data from CipherDesk servers.", action: "Delete My Account", variant: "btn-danger" },
                            { icon: Download, title: "Right to Portability", desc: "Export all your personal data in a machine-readable, encrypted JSON format.", action: "Export My Data", variant: "btn-secondary" },
                            { icon: Lock, title: "Data Processing", desc: "CipherDesk processes: email (authentication), encrypted blobs (storage), minimal metadata (routing). No content analysis.", action: "View DPA", variant: "btn-ghost" },
                        ].map(item => (
                            <div key={item.title} style={{ ...card, padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <item.icon size={17} style={{ color: "#818CF8" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>{item.title}</div>
                                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>{item.desc}</p>
                                    </div>
                                </div>
                                <button className={item.variant} style={{ fontSize: 12, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{item.action}</button>
                            </div>
                        ))}
                        <div style={{ ...card, padding: 22 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 12 }}>Data we store (encrypted)</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {[
                                    { data: "Email address", purpose: "Authentication only", color: "#6EE7B7" },
                                    { data: "Password hash (never plaintext)", purpose: "Auth token (Argon2id)", color: "#6EE7B7" },
                                    { data: "Encrypted message ciphertext", purpose: "Routing & delivery", color: "#22D3EE" },
                                    { data: "Encrypted file chunks", purpose: "Storage & retrieval", color: "#22D3EE" },
                                    { data: "Message timestamps", purpose: "Chronological ordering", color: "#FCD34D" },
                                    { data: "IP addresses (72hr TTL)", purpose: "Security audit log", color: "#FCD34D" },
                                ].map(d => (
                                    <div key={d.data} style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(3,7,17,.8)", border: "1px solid rgba(255,255,255,.06)" }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: d.color, marginBottom: 3 }}>{d.data}</div>
                                        <div style={{ fontSize: 11, color: "#64748B" }}>Purpose: {d.purpose}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
