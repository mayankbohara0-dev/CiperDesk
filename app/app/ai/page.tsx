"use client";
import { useState } from "react";
import {
    Sparkles, Lock, Brain, ListChecks, FileText, Mail,
    RefreshCw, Clock, Shield, TrendingUp,
} from "lucide-react";

const DECISIONS = [
    "Team agreed to use Argon2id over bcrypt for all password operations.",
    "Key rotation will be triggered automatically when any member is removed.",
    "File vault will split files into 512KB chunks before encryption.",
    "AI runs only after client-side decryption — no raw logs server-side.",
];

const AUTO_TASKS = [
    { title: "Write migration script for Argon2id", priority: "High", from: "#engineering" },
    { title: "Document key rotation protocol", priority: "Medium", from: "#engineering" },
    { title: "Review WebSocket reconnection edge cases", priority: "High", from: "#builds" },
    { title: "Add E2E tests for file upload", priority: "Low", from: "#engineering" },
];

const CHAT_SUMMARY = `Over the past week, the team focused on:

**Security hardening** — Arjun finished the Argon2id password hashing implementation and opened a PR. Priya reviewed and approved with one requested change on the salt generation.

**Encryption architecture** — Major discussion around workspace key rotation. Consensus reached: rotation triggers on member removal, and all active device keys are re-encrypted synchronously before the operation completes.

**File vault** — Design spec finalized with 512KB chunk size, AES-256-GCM per chunk, file key wrapped with workspace key.

**Deploy pipeline** — Rahul identified and fixed the staging env variable issue that broke builds last week.`;

const PCOLORS: Record<string, { bg: string; color: string }> = {
    High: { bg: "#FEE2E2", color: "#991B1B" },
    Medium: { bg: "#FEF9C3", color: "#854D0E" },
    Low: { bg: "#F3F4F6", color: "#6B7280" },
};

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1.5px solid #E8E4DC", padding: 20 };

export default function AiPage() {
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(true);
    const [addedTasks, setAddedTasks] = useState<string[]>([]);

    const addTask = (title: string) => setAddedTasks(p => [...p, title]);

    const regenerate = () => {
        setGenerating(true); setGenerated(false);
        setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>AI Digest</h1>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 4 }}>
                        <Sparkles size={10} /> Pro Feature
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 4 }}>
                        <Lock size={9} /> Client-Decrypted Only
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#A8A49C", display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={12} /> Last generated: Today, 8:00 AM
                    </span>
                    <button onClick={regenerate} disabled={generating}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer", opacity: generating ? .6 : 1 }}>
                        <RefreshCw size={14} style={{ animation: generating ? "spin 1s linear infinite" : "none" }} />
                        {generating ? "Generating…" : "Regenerate"}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Privacy banner */}
                <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "13px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Shield size={16} style={{ color: "#166534", flexShrink: 0, marginTop: 1 }} />
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 3 }}>Privacy-preserving AI</p>
                        <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.6, opacity: .85 }}>
                            Chat is decrypted <strong>locally on your device</strong> before AI processing.
                            Summaries are generated in-browser. No raw messages, no conversation logs, no AI training data sent to servers.
                        </p>
                    </div>
                </div>

                {/* Generating state */}
                {generating && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 14 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 18, background: "#FFFBEB", border: "1.5px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Brain size={26} style={{ color: "#D97706", animation: "pulse 1.5s ease-in-out infinite" }} />
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#0D0D0D" }}>Decrypting and analyzing locally…</p>
                        <p style={{ fontSize: 12, fontFamily: "monospace", color: "#A8A49C" }}>Processing #general · #engineering · #builds</p>
                        <div style={{ width: 200, height: 5, borderRadius: 999, background: "#E8E4DC", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: "66%", background: "#AAEF45", borderRadius: 999, animation: "pulse 1.5s ease-in-out infinite" }} />
                        </div>
                    </div>
                )}

                {generated && !generating && (<>

                    {/* Weekly summary */}
                    <div style={CARD}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 12, background: "#FFFBEB", border: "1.5px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FileText size={17} style={{ color: "#D97706" }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Weekly Summary</h2>
                                <p style={{ fontSize: 12, color: "#A8A49C" }}>Feb 24 – Mar 3 · 4 channels · 127 messages</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {CHAT_SUMMARY.split("\n\n").map((para, i) => (
                                <p key={i} style={{ fontSize: 13, color: "#2D2D2D", lineHeight: 1.7 }}
                                    dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0D0D0D;font-weight:800">$1</strong>') }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 2-col: decisions + tasks */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                        {/* Key decisions */}
                        <div style={CARD}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 11, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <TrendingUp size={17} style={{ color: "#0D0D0D" }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Key Decisions</h2>
                                    <p style={{ fontSize: 12, color: "#A8A49C" }}>Extracted from conversations</p>
                                </div>
                            </div>
                            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {DECISIONS.map((d, i) => (
                                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                                            <span style={{ fontSize: 10, fontWeight: 900, color: "#0D0D0D" }}>{i + 1}</span>
                                        </div>
                                        <span style={{ fontSize: 13, color: "#2D2D2D", lineHeight: 1.55 }}>{d}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Suggested tasks */}
                        <div style={CARD}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 11, background: "#F0FDF4", border: "1.5px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <ListChecks size={17} style={{ color: "#166534" }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Suggested Tasks</h2>
                                    <p style={{ fontSize: 12, color: "#A8A49C" }}>AI found action items in chat</p>
                                </div>
                            </div>
                            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {AUTO_TASKS.map(t => {
                                    const added = addedTasks.includes(t.title);
                                    const pc = PCOLORS[t.priority];
                                    return (
                                        <li key={t.title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: added ? "#A8A49C" : "#0D0D0D", textDecoration: added ? "line-through" : "none" }}>{t.title}</p>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: pc.bg, color: pc.color }}>{t.priority}</span>
                                                    <span style={{ fontSize: 11, color: "#A8A49C" }}>{t.from}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => addTask(t.title)} disabled={added}
                                                style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 8, border: "1.5px solid", borderColor: added ? "#BBF7D0" : "#E8E4DC", background: added ? "#F0FDF4" : "#fff", fontSize: 12, fontWeight: 700, color: added ? "#166534" : "#0D0D0D", cursor: added ? "default" : "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                                                {added ? "✓ Added" : "+ Add Task"}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Encrypted digest */}
                    <div style={CARD}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 12, background: "#F5F3FF", border: "1.5px solid #DDD6FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Mail size={17} style={{ color: "#7C3AED" }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Weekly Encrypted Digest</h2>
                                    <p style={{ fontSize: 12, color: "#A8A49C" }}>Send this summary as an <span style={{ fontFamily: "monospace", color: "#AAEF45", background: "#0D0D0D", padding: "1px 5px", borderRadius: 4 }}>encrypted email</span> to your team</p>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ padding: "9px 18px" }}>
                                <Mail size={14} /> Send Digest
                            </button>
                        </div>
                    </div>
                </>)}
            </div>
        </div>
    );
}
