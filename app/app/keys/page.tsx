"use client";
import { useState } from "react";
import {
    KeyRound, Shield, RefreshCw, Download, Eye, EyeOff,
    Trash2, Check, AlertTriangle, Lock, Copy, CheckCheck,
    Smartphone, Clock, Fingerprint,
} from "lucide-react";
import { useKeys, useUser } from "@/lib/hooks";

const BACKUP_CODES = ["XKQZ-7M2T", "BNPR-4WJH", "CLVS-9YDK", "FMTG-3RAE", "HWQP-6NLX", "JCZB-8SUV", "KDYR-2GFT", "MPWN-5EQJ"];

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1.5px solid #E8E4DC", padding: 22 };

function SectionHead({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
            <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 3 }}>{title}</h3>
                <p style={{ fontSize: 12, color: "#A8A49C" }}>{sub}</p>
            </div>
        </div>
    );
}

export default function KeysPage() {
    const { user, profile } = useUser();
    const { keys, loading, rotateKey } = useKeys();
    const [showBackup, setShowBackup] = useState(false);
    const [rotating, setRotating] = useState(false);
    const [copied, setCopied] = useState(false);

    const activeWorkspaceKey = keys.find(k => k.status === "active" && k.name === "primary-workspace-key");

    const handleRotate = async () => {
        if (!activeWorkspaceKey || !user || profile?.role !== "owner" && profile?.role !== "admin") return;
        setRotating(true);
        await rotateKey(activeWorkspaceKey.id, user.id);
        setRotating(false);
    };

    const copyAll = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

    const isAdmin = profile?.role === "owner" || profile?.role === "admin";

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Key Management</h1>
                <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 2 }}>Manage your cryptographic identity and workspace encryption keys</p>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Keypairs */}
                <div style={CARD}>
                    <SectionHead icon={<Fingerprint size={19} style={{ color: "#0D0D0D" }} />} title="Your Keypairs" sub="Generated locally in your browser on registration. Private keys never leave your device." />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { label: "Ed25519 Signing Key", purpose: "Message authentication & identity", created: "2026-01-12", fp: "6A:2F:C3:B9:E1:77:D4:82:FA:3C:90:1E:57:4B:AA:D6" },
                            { label: "X25519 Key Exchange", purpose: "Deriving shared session secrets (ECDH)", created: "2026-01-12", fp: "B4:91:5D:28:C7:FF:39:60:2A:63:D5:88:1B:E4:47:93" },
                        ].map(k => (
                            <div key={k.label} style={{ padding: "14px 16px", borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Lock size={12} style={{ color: "#2E7D32" }} />
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{k.label}</span>
                                    </div>
                                    <span style={{ fontSize: 11, color: "#A8A49C", display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} />Created {k.created}</span>
                                </div>
                                <p style={{ fontSize: 12, color: "#A8A49C", marginBottom: 8 }}>{k.purpose}</p>
                                <div style={{ padding: "6px 12px", borderRadius: 8, background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#4F63FF", letterSpacing: ".04em" }}>FP: {k.fp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key rotation */}
                {isAdmin && (
                    <div style={CARD}>
                        <SectionHead icon={<RefreshCw size={19} style={{ color: "#0D0D0D" }} />} title="Workspace Key Rotation" sub="Rotate the AES-256-GCM workspace key. All member keys will be re-wrapped automatically." />

                        <div style={{ padding: "13px 16px", borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Current workspace key</p>
                                <p style={{ fontSize: 11, color: "#A8A49C", marginTop: 2 }}>
                                    {loading ? "Loading..." : activeWorkspaceKey ? `AES-256-GCM · Version ${activeWorkspaceKey.version} · Created ${new Date(activeWorkspaceKey.created_at).toLocaleDateString()}` : "No active key found"}
                                </p>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 5 }}>
                                <Check size={10} />Active (v{activeWorkspaceKey?.version || 0})
                            </span>
                        </div>

                        <div style={{ padding: "11px 14px", borderRadius: 10, background: "#FFFBEB", border: "1px solid #FDE68A", marginBottom: 14, display: "flex", gap: 10 }}>
                            <AlertTriangle size={14} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.65 }}>Rotation generates a new AES-256-GCM key, re-encrypts all member key wraps, and marks the old key deprecated. All active sessions will re-key on next message.</p>
                        </div>

                        <button className="btn-primary" onClick={handleRotate} disabled={rotating || !activeWorkspaceKey || loading} style={{ width: "fit-content" }}>
                            {rotating ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(13,13,13,.2)", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite", display: "inline-block" }} />Rotating keys…</>
                                : <><RefreshCw size={14} />Rotate Workspace Key</>}
                        </button>

                        {keys.filter(k => k.status === "rotated").length > 0 && (
                            <div style={{ marginTop: 20 }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: "#0D0D0D", marginBottom: 10 }}>Rotated Keys (Deprecated)</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    {keys.filter(k => k.status === "rotated").map(k => (
                                        <div key={k.id} style={{ fontSize: 11, color: "#A8A49C", display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8E4DC" }} />
                                            Version {k.version} — Rotated {new Date(k.rotated_at || "").toLocaleDateString()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Backup codes */}
                <div style={CARD}>
                    <SectionHead icon={<Shield size={19} style={{ color: "#0D0D0D" }} />} title="Backup Codes" sub="One-time codes for emergency access if you lose your device and 2FA app." />

                    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        <button onClick={() => setShowBackup(!showBackup)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>
                            {showBackup ? <EyeOff size={14} /> : <Eye size={14} />}
                            {showBackup ? "Hide codes" : "Reveal backup codes"}
                        </button>
                        {showBackup && (
                            <button onClick={copyAll} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>
                                {copied ? <><CheckCheck size={14} style={{ color: "#16A34A" }} />Copied!</> : <><Copy size={14} />Copy all</>}
                            </button>
                        )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                        {BACKUP_CODES.map(code => (
                            <div key={code} style={{ padding: "10px 12px", borderRadius: 10, textAlign: "center", background: "#F5F0E8", border: "1.5px solid #E8E4DC", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: showBackup ? "#0D0D0D" : "#C8C4BC", filter: showBackup ? "none" : "blur(5px)", userSelect: showBackup ? "text" : "none", transition: "all .3s" }}>
                                {showBackup ? code : "••••-••••"}
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#A8A49C", marginTop: 10 }}>Each code can only be used once · Store securely offline</p>
                </div>

                {/* Export */}
                <div style={CARD}>
                    <SectionHead icon={<Download size={19} style={{ color: "#0D0D0D" }} />} title="Key Export & Backup" sub="Export an encrypted backup of your private keys. Required to restore access on a new device." />
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>
                            <Download size={14} /> Export Encrypted Key Bundle
                        </button>
                        <span style={{ fontSize: 12, color: "#A8A49C", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 5 }}>
                            <Lock size={11} style={{ color: "#2E7D32" }} />AES-256-GCM encrypted with your passphrase
                        </span>
                    </div>
                </div>

                {/* Trusted devices */}
                <div style={CARD}>
                    <SectionHead icon={<Smartphone size={19} style={{ color: "#0D0D0D" }} />} title="Trusted Devices" sub="Devices approved to access your CipherDesk keys." />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { name: "MacBook Pro 14\"", os: "macOS 14.4", ip: "10.0.1.42", last: "Now", current: true },
                            { name: "iPhone 15 Pro", os: "iOS 17.3", ip: "10.0.1.67", last: "2h ago", current: false },
                            { name: "Windows PC", os: "Windows 11", ip: "10.0.1.88", last: "3 days ago", current: false },
                        ].map(dev => (
                            <div key={dev.name} style={{ padding: "12px 16px", borderRadius: 12, background: "#F5F0E8", border: `1.5px solid ${dev.current ? "#AAEF45" : "#E8E4DC"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{dev.name}</span>
                                        {dev.current && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "#AAEF45", color: "#0D0D0D" }}>This device</span>}
                                    </div>
                                    <p style={{ fontSize: 12, color: "#A8A49C" }}>{dev.os} · {dev.ip} · Last seen: {dev.last}</p>
                                </div>
                                {!dev.current && (
                                    <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 9, background: "#FEE2E2", border: "1.5px solid #FECACA", color: "#DC2626", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                        <Trash2 size={12} />Revoke
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
