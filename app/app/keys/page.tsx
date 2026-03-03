"use client";
import { useState } from "react";
import {
    KeyRound, Shield, RefreshCw, Download, Eye, EyeOff,
    Plus, Trash2, Check, AlertTriangle, Lock, Copy,
    CheckCheck, Smartphone, Clock, Fingerprint,
} from "lucide-react";

const backupCodes = [
    "XKQZ-7M2T", "BNPR-4WJH", "CLVS-9YDK", "FMTG-3RAE",
    "HWQP-6NLX", "JCZB-8SUV", "KDYR-2GFT", "MPWN-5EQJ",
];

export default function KeysPage() {
    const [showBackup, setShowBackup] = useState(false);
    const [rotating, setRotating] = useState(false);
    const [rotated, setRotated] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRotate = () => {
        setRotating(true);
        setTimeout(() => { setRotating(false); setRotated(true); }, 2200);
    };

    const copyAll = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const card = {
        background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,.07)", borderRadius: 16,
    } as React.CSSProperties;

    const section = (title: string, sub: string, icon: React.ReactNode) => (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", marginBottom: 3 }}>{title}</h3>
                <p style={{ fontSize: 12, color: "#64748B" }}>{sub}</p>
            </div>
        </div>
    );

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <KeyRound size={20} style={{ color: "#818CF8" }} />
                    <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Key Management</h1>
                </div>
                <p style={{ fontSize: 13, color: "#64748B" }}>Manage your cryptographic identity and workspace encryption keys</p>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Your keypairs */}
                <div style={{ ...card, padding: 24 }}>
                    {section("Your Keypairs", "Generated locally in your browser on registration. Private keys never leave your device.", <Fingerprint size={19} style={{ color: "#818CF8" }} />)}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { label: "Ed25519 Signing Key", purpose: "Message authentication & identity", created: "2026-01-12", fp: "6A:2F:C3:B9:E1:77:D4:82:FA:3C:90:1E:57:4B:AA:D6" },
                            { label: "X25519 Key Exchange", purpose: "Deriving shared session secrets (ECDH)", created: "2026-01-12", fp: "B4:91:5D:28:C7:FF:39:60:2A:63:D5:88:1B:E4:47:93" },
                        ].map(k => (
                            <div key={k.label} style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(3,7,17,.8)", border: "1px solid rgba(255,255,255,.06)" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Lock size={13} style={{ color: "#22D3EE" }} />
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{k.label}</span>
                                    </div>
                                    <span style={{ fontSize: 11, color: "#64748B", display: "flex", alignItems: "center", gap: 5 }}>
                                        <Clock size={10} />Created {k.created}
                                    </span>
                                </div>
                                <p style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>{k.purpose}</p>
                                <div style={{ padding: "7px 12px", borderRadius: 8, background: "rgba(99,102,241,.07)", border: "1px solid rgba(99,102,241,.15)" }}>
                                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#818CF8", letterSpacing: ".04em" }}>Fingerprint: {k.fp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Workspace key rotation */}
                <div style={{ ...card, padding: 24 }}>
                    {section("Workspace Key Rotation", "Rotate the AES-256-GCM workspace key. All member keys will be re-wrapped automatically.", <RefreshCw size={19} style={{ color: "#818CF8" }} />)}

                    <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(3,7,17,.8)", border: "1px solid rgba(255,255,255,.06)", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>Current workspace key</p>
                                <p style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>AES-256-GCM · 256-bit · Created Jan 12, 2026</p>
                            </div>
                            {rotated
                                ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)", fontSize: 11, fontWeight: 600, color: "#6EE7B7" }}><Check size={11} />Rotated</span>
                                : <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, background: "rgba(6,182,212,.1)", border: "1px solid rgba(6,182,212,.2)", fontSize: 11, fontWeight: 600, color: "#67E8F9" }}>Active</span>
                            }
                        </div>
                    </div>

                    <div style={{ padding: 14, borderRadius: 12, background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.18)", marginBottom: 14, display: "flex", gap: 10 }}>
                        <AlertTriangle size={15} style={{ color: "#F59E0B", flexShrink: 0, marginTop: 2 }} />
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.65 }}>
                            Rotation generates a new AES-256-GCM key, re-encrypts all member key wraps, and marks the old key deprecated.
                            All active sessions will re-key on next message. Old messages remain decryptable with archived key.
                        </p>
                    </div>

                    <button className="btn-primary" onClick={handleRotate} disabled={rotating || rotated} style={{ gap: 10 }}>
                        {rotating
                            ? <><span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} />Rotating keys…</>
                            : rotated ? <><Check size={15} />Rotation complete</> : <><RefreshCw size={15} />Rotate Workspace Key</>}
                    </button>
                </div>

                {/* Backup codes */}
                <div style={{ ...card, padding: 24 }}>
                    {section("Backup Codes", "One-time codes for emergency access if you lose your device and 2FA app.", <Shield size={19} style={{ color: "#818CF8" }} />)}

                    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                        <button className="btn-secondary" style={{ gap: 8, fontSize: 13 }} onClick={() => setShowBackup(!showBackup)}>
                            {showBackup ? <EyeOff size={14} /> : <Eye size={14} />}
                            {showBackup ? "Hide codes" : "Reveal backup codes"}
                        </button>
                        {showBackup && (
                            <button className="btn-secondary" style={{ gap: 8, fontSize: 13 }} onClick={copyAll}>
                                {copied ? <><CheckCheck size={14} style={{ color: "#10B981" }} />Copied!</> : <><Copy size={14} />Copy all</>}
                            </button>
                        )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                        {backupCodes.map(code => (
                            <div key={code} style={{
                                padding: "10px 12px", borderRadius: 10, textAlign: "center",
                                background: "rgba(3,7,17,.9)", border: "1px solid rgba(255,255,255,.07)",
                                fontFamily: "monospace", fontSize: 13, fontWeight: 600,
                                color: showBackup ? "#818CF8" : "#334155",
                                filter: showBackup ? "none" : "blur(6px)",
                                userSelect: showBackup ? "text" : "none",
                                transition: "all .3s",
                            }}>
                                {showBackup ? code : "••••-••••"}
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 10 }}>Each code can only be used once · Store securely offline</p>
                </div>

                {/* Export keys */}
                <div style={{ ...card, padding: 24 }}>
                    {section("Key Export & Backup", "Export an encrypted backup of your private keys. Required to restore access on a new device.", <Download size={19} style={{ color: "#818CF8" }} />)}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button className="btn-secondary" style={{ gap: 8, fontSize: 13 }}>
                            <Download size={14} />Export Encrypted Key Bundle
                        </button>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", fontFamily: "monospace" }}>
                            <Lock size={11} style={{ color: "#22D3EE" }} />AES-256-GCM encrypted with your passphrase
                        </span>
                    </div>
                </div>

                {/* Trusted devices */}
                <div style={{ ...card, padding: 24 }}>
                    {section("Trusted Devices", "Devices approved to access your CipherDesk keys.", <Smartphone size={19} style={{ color: "#818CF8" }} />)}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { name: "MacBook Pro 14\"", os: "macOS 14.4", ip: "10.0.1.42", last: "Now", current: true },
                            { name: "iPhone 15 Pro", os: "iOS 17.3", ip: "10.0.1.67", last: "2h ago", current: false },
                            { name: "Windows PC", os: "Windows 11", ip: "10.0.1.88", last: "3 days ago", current: false },
                        ].map(dev => (
                            <div key={dev.name} style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(3,7,17,.8)", border: `1px solid ${dev.current ? "rgba(99,102,241,.3)" : "rgba(255,255,255,.06)"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{dev.name}</span>
                                        {dev.current && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "rgba(99,102,241,.15)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,.25)" }}>This device</span>}
                                    </div>
                                    <p style={{ fontSize: 11, color: "#64748B" }}>{dev.os} · {dev.ip} · Last seen: {dev.last}</p>
                                </div>
                                {!dev.current && (
                                    <button className="btn-danger" style={{ padding: "6px 12px", fontSize: 12, gap: 6 }}>
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
