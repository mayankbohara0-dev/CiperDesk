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

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1.5px solid #E8E4DC" };

type TabBtnProps = { id: TabId; label: string; active: TabId; onClick: (id: TabId) => void };
function TabBtn({ id, label, active, onClick }: TabBtnProps) {
    const on = active === id;
    return (
        <button onClick={() => onClick(id)} style={{ padding: "7px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1.5px solid", borderColor: on ? "#0D0D0D" : "#E8E4DC", background: on ? "#0D0D0D" : "#fff", color: on ? "#AAEF45" : "#6B675E", transition: "all .15s" }}>{label}</button>
    );
}

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

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Compliance Center</h1>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>Score: {score}%</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 3 }}>Security compliance overview, data exports, retention policies, and GDPR controls</p>
                </div>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 6, padding: "10px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                {([["overview", "Overview"], ["export", "Data Export"], ["retention", "Retention"], ["gdpr", "GDPR / Privacy"]] as [TabId, string][]).map(([id, label]) => (
                    <TabBtn key={id} id={id} label={label} active={tab} onClick={setTab} />
                ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* ── OVERVIEW ── */}
                {tab === "overview" && (<>
                    {/* Score cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                        {[
                            { val: pass, unit: "checks", label: "Passing", bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" },
                            { val: warn, unit: "issues", label: "Warnings", bg: "#FFFBEB", border: "#FDE68A", color: "#D97706" },
                            { val: pending, unit: "items", label: "Pending", bg: "#EEF2FF", border: "#C7D2FE", color: "#4338CA" },
                        ].map(s => (
                            <div key={s.label} style={{ ...CARD, padding: "20px 24px", background: s.bg, borderColor: s.border }}>
                                <div style={{ fontSize: 36, fontWeight: 900, color: s.color, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}>{s.val}</div>
                                <div style={{ fontSize: 13, color: s.color, fontWeight: 600, marginTop: 6, opacity: .8 }}>{s.label} {s.unit}</div>
                            </div>
                        ))}
                    </div>

                    {/* Checklist */}
                    <div style={{ ...CARD, overflow: "hidden" }}>
                        <div style={{ padding: "13px 20px", borderBottom: "1.5px solid #E8E4DC", background: "#F5F0E8" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Security Checklist</h3>
                        </div>
                        {CHECKS.map((c, i) => (
                            <div key={c.label}
                                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: i < CHECKS.length - 1 ? "1px solid #F0EBE3" : "none", transition: "background .15s" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF7"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                    background: c.status === "pass" ? "#F0FDF4" : c.status === "warn" ? "#FFFBEB" : "#EEF2FF",
                                    border: `1.5px solid ${c.status === "pass" ? "#BBF7D0" : c.status === "warn" ? "#FDE68A" : "#C7D2FE"}`,
                                }}>
                                    {c.status === "pass" && <Check size={13} style={{ color: "#16A34A" }} />}
                                    {c.status === "warn" && <AlertTriangle size={11} style={{ color: "#D97706" }} />}
                                    {c.status === "pending" && <Clock size={11} style={{ color: "#4338CA" }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D", marginBottom: 2 }}>{c.label}</div>
                                    <div style={{ fontSize: 11, color: "#A8A49C" }}>{c.detail}</div>
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                                    background: c.status === "pass" ? "#F0FDF4" : c.status === "warn" ? "#FFFBEB" : "#EEF2FF",
                                    color: c.status === "pass" ? "#16A34A" : c.status === "warn" ? "#D97706" : "#4338CA",
                                    border: `1px solid ${c.status === "pass" ? "#BBF7D0" : c.status === "warn" ? "#FDE68A" : "#C7D2FE"}`,
                                }}>
                                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                </>)}

                {/* ── DATA EXPORT ── */}
                {tab === "export" && (<>
                    <div style={{ ...CARD, padding: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                            <Archive size={18} style={{ color: "#6B675E" }} />
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Full Workspace Export</h3>
                        </div>
                        <p style={{ fontSize: 13, color: "#6B675E", lineHeight: 1.7, marginBottom: 20 }}>
                            Export an encrypted archive of all workspace data: messages, tasks, vault files, and audit logs. The export is a JSON bundle encrypted with AES-256-GCM using your workspace key. Only workspace members with the workspace key can decrypt it.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
                            {[
                                { icon: FileText, label: "Messages", count: "2,417 encrypted" },
                                { icon: Lock, label: "Files", count: "23 vault items" },
                                { icon: Archive, label: "Audit Log", count: "847 entries" },
                            ].map(item => (
                                <div key={item.label} style={{ padding: "14px 16px", borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", flexDirection: "column", gap: 8 }}>
                                    <item.icon size={16} style={{ color: "#6B675E" }} />
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0D0D0D" }}>{item.label}</div>
                                    <div style={{ fontSize: 11, color: "#A8A49C" }}>{item.count}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: "11px 14px", borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 12, color: "#166534", marginBottom: 16, display: "flex", gap: 10 }}>
                            <Lock size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                            Export is AES-256-GCM encrypted. The server streams ciphertext — your browser decrypts and re-encrypts for the archive. Estimated size: ~180 MB.
                        </div>
                        <button className="btn-primary" onClick={handleExport} disabled={exporting}>
                            {exporting
                                ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(13,13,13,.2)", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite", display: "inline-block" }} />Preparing export…</>
                                : exported ? <><Check size={14} />Export ready — downloading</>
                                    : <><Download size={14} />Export All Data (Encrypted)</>}
                        </button>
                    </div>

                    <div style={{ ...CARD, padding: 22 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <Clock size={16} style={{ color: "#6B675E" }} />
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Scheduled Exports</h3>
                        </div>
                        <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D", marginBottom: 3 }}>Monthly encrypted digest (first of month)</div>
                                <div style={{ fontSize: 11, color: "#A8A49C" }}>Last exported: Mar 1, 2026 · Next: Apr 1, 2026</div>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534" }}>Active</span>
                        </div>
                    </div>
                </>)}

                {/* ── RETENTION ── */}
                {tab === "retention" && (
                    <div style={{ ...CARD, padding: 26 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <RefreshCw size={17} style={{ color: "#6B675E" }} />
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Data Retention Policy</h3>
                        </div>
                        <p style={{ fontSize: 13, color: "#6B675E", lineHeight: 1.7, marginBottom: 22 }}>
                            Set how long encrypted messages, tasks, and files are stored on CipherDesk servers. After the retention period, data is permanently deleted from our servers. You can export before deletion (see Data Export tab).
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                            {["Messages", "Task History", "Vault Files", "Audit Log"].map(cat => (
                                <div key={cat} style={{ padding: "13px 16px", borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{cat}</div>
                                        <div style={{ fontSize: 11, color: "#A8A49C", marginTop: 2 }}>Encrypted · stored per workspace policy</div>
                                    </div>
                                    <select className="input-field" value={retention} onChange={e => setRetention(e.target.value)} style={{ width: 130, margin: 0 }}>
                                        {RETENTION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary" style={{ width: "fit-content" }}><Check size={14} />Save Retention Policy</button>
                    </div>
                )}

                {/* ── GDPR ── */}
                {tab === "gdpr" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ ...CARD, padding: 22 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                <Globe size={17} style={{ color: "#6B675E" }} />
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>GDPR & Privacy Controls</h3>
                            </div>
                            <p style={{ fontSize: 13, color: "#6B675E", lineHeight: 1.7 }}>
                                CipherDesk processes minimal personal data and stores it encrypted. Your workspace content is zero-knowledge — no personal data analysis is performed on encrypted content.
                            </p>
                        </div>
                        {[
                            { icon: Eye, title: "Right to Access", desc: "Request a full copy of all data CipherDesk holds about you as a workspace member.", action: "Request Data Report", danger: false },
                            { icon: Trash2, title: "Right to Erasure", desc: "Permanently delete your account and all associated encrypted data from CipherDesk servers.", action: "Delete My Account", danger: true },
                            { icon: Download, title: "Right to Portability", desc: "Export all your personal data in a machine-readable, encrypted JSON format.", action: "Export My Data", danger: false },
                            { icon: Lock, title: "Data Processing", desc: "CipherDesk processes: email (authentication), encrypted blobs (storage), minimal metadata (routing). No content analysis.", action: "View DPA", danger: false },
                        ].map(item => (
                            <div key={item.title} style={{ ...CARD, padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 11, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <item.icon size={17} style={{ color: "#6B675E" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{item.title}</div>
                                        <p style={{ fontSize: 12, color: "#6B675E", lineHeight: 1.6 }}>{item.desc}</p>
                                    </div>
                                </div>
                                <button style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${item.danger ? "#FECACA" : "#E8E4DC"}`, background: item.danger ? "#FEE2E2" : "#fff", color: item.danger ? "#DC2626" : "#0D0D0D", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{item.action}</button>
                            </div>
                        ))}

                        {/* Data stored table */}
                        <div style={{ ...CARD, padding: 22 }}>
                            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0D0D0D", marginBottom: 14, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Data we store (encrypted)</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {[
                                    { data: "Email address", purpose: "Authentication only", color: "#16A34A", bg: "#F0FDF4" },
                                    { data: "Password hash (never plaintext)", purpose: "Auth token (Argon2id)", color: "#16A34A", bg: "#F0FDF4" },
                                    { data: "Encrypted message ciphertext", purpose: "Routing & delivery", color: "#0891B2", bg: "#ECFEFF" },
                                    { data: "Encrypted file chunks", purpose: "Storage & retrieval", color: "#0891B2", bg: "#ECFEFF" },
                                    { data: "Message timestamps", purpose: "Chronological ordering", color: "#D97706", bg: "#FFFBEB" },
                                    { data: "IP addresses (72hr TTL)", purpose: "Security audit log", color: "#D97706", bg: "#FFFBEB" },
                                ].map(d => (
                                    <div key={d.data} style={{ padding: "11px 14px", borderRadius: 10, background: d.bg, border: `1.5px solid ${d.color}30` }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: d.color, marginBottom: 3 }}>{d.data}</div>
                                        <div style={{ fontSize: 11, color: "#A8A49C" }}>Purpose: {d.purpose}</div>
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
