"use client";
import { useState } from "react";
import {
    Plug, Webhook, Key, Zap, Github, Code, Check, Copy, CheckCheck,
    Plus, Trash2, Eye, EyeOff, Globe, RefreshCw, ToggleLeft, ToggleRight, Lock,
} from "lucide-react";

type TabId = "apps" | "webhooks" | "api";

const SAMPLE_PAYLOAD = `{
  "event": "task.created",
  "workspace": "buildfast-hq",
  "timestamp": "2026-03-03T15:44:00Z",
  "actor_id": "u_arjun",
  "payload_encrypted": true,
  "note": "Payload content is E2E encrypted."
}`;

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1.5px solid #E8E4DC" };

export default function IntegrationsPage() {
    const [tab, setTab] = useState<TabId>("apps");
    const [enabled, setEnabled] = useState<Record<string, boolean>>({ GitHub: true, Webhook: true });
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState("");

    const APPS = [
        { name: "GitHub", icon: Github, desc: "Link PRs and commits to Kanban tasks. Auto-close tasks on merge.", accent: "#0D0D0D" },
        { name: "Zapier", icon: Zap, desc: "Connect CipherDesk tasks/messages to 5,000+ other apps.", accent: "#F59E0B" },
        { name: "Webhook", icon: Webhook, desc: "Custom HTTP webhooks for task/message metadata events.", accent: "#4F63FF" },
        { name: "API", icon: Code, desc: "Direct API access for automations. Content requires client-side decryption.", accent: "#9333EA" },
    ];

    const API_KEYS = [
        { name: "CI/CD Pipeline", prefix: "cd_live_xK9mQ", created: "Feb 10, 2026", lastUsed: "3h ago", scope: "tasks:read, vault:read" },
        { name: "Metrics Script", prefix: "cd_live_bT4pR", created: "Mar 1, 2026", lastUsed: "1d ago", scope: "audit:read" },
    ];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Integrations</h1>
                <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 2 }}>Connect external tools · Message content is always E2EE — integrations receive only metadata</p>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 4, padding: "10px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                {([["apps", "Apps"], ["webhooks", "Webhooks"], ["api", "API Keys"]] as [TabId, string][]).map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)} style={{ padding: "7px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1.5px solid", borderColor: tab === id ? "#0D0D0D" : "#E8E4DC", background: tab === id ? "#0D0D0D" : "#fff", color: tab === id ? "#AAEF45" : "#6B675E", transition: "all .15s" }}>{label}</button>
                ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>

                {/* ── Apps ── */}
                {tab === "apps" && (<>
                    <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 12, padding: "11px 16px", fontSize: 12, color: "#166534", display: "flex", alignItems: "center", gap: 10 }}>
                        <Globe size={14} style={{ flexShrink: 0 }} />
                        All integrations receive <strong>metadata events only</strong>. Message and file content is E2EE and never shared with third parties.
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
                        {APPS.map(app => (
                            <div key={app.name} style={{ ...CARD, padding: 20, transition: "all .2s" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = app.accent; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DC"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 12, background: app.accent + "15", border: `1.5px solid ${app.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <app.icon size={20} style={{ color: app.accent }} />
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{app.name}</span>
                                    </div>
                                    <button onClick={() => setEnabled(p => ({ ...p, [app.name]: !p[app.name] }))} style={{ background: "none", border: "none", cursor: "pointer", color: enabled[app.name] ? "#0D0D0D" : "#C8C4BC", transition: "color .2s" }}>
                                        {enabled[app.name] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                    </button>
                                </div>
                                <p style={{ fontSize: 13, color: "#6B675E", lineHeight: 1.6, marginBottom: 14 }}>{app.desc}</p>
                                {enabled[app.name]
                                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}><Check size={10} />Connected</span>
                                    : <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}><Plus size={13} />Connect</button>
                                }
                            </div>
                        ))}
                    </div>
                </>)}

                {/* ── Webhooks ── */}
                {tab === "webhooks" && (<>
                    <div style={{ ...CARD, overflow: "hidden" }}>
                        <div style={{ padding: "14px 20px", borderBottom: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Active Webhooks</h3>
                            <button className="btn-primary" style={{ padding: "7px 14px", fontSize: 12 }}><Plus size={12} />Add Webhook</button>
                        </div>
                        {[
                            { url: "https://hooks.zapier.com/hooks/catch/xxxx/yyyy", events: ["task.created", "task.completed"], last: "3h ago" },
                            { url: "https://ci.buildfast.io/cipherdesk/push", events: ["vault.upload"], last: "1d ago" },
                        ].map((wh, i, arr) => (
                            <div key={i} style={{ padding: "14px 20px", borderBottom: i < arr.length - 1 ? "1px solid #F0EBE3" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <code style={{ fontSize: 12, fontFamily: "monospace", color: "#4F63FF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{wh.url}</code>
                                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", whiteSpace: "nowrap" }}>200 OK</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                                        {wh.events.map(ev => (
                                            <span key={ev} style={{ fontSize: 11, fontFamily: "monospace", padding: "2px 8px", borderRadius: 5, background: "#F5F0E8", color: "#6B675E" }}>{ev}</span>
                                        ))}
                                        <span style={{ fontSize: 11, color: "#A8A49C" }}>· Last sent {wh.last}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                    <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 12, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}><RefreshCw size={12} />Test</button>
                                    <button style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #FECACA", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#DC2626" }}><Trash2 size={13} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ ...CARD, padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                            <Code size={14} style={{ color: "#6B675E" }} />
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Sample Payload</h3>
                        </div>
                        <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#2D2D2D", background: "#F5F0E8", border: "1.5px solid #E8E4DC", borderRadius: 10, padding: 16, overflow: "auto", lineHeight: 1.65, margin: 0 }}>{SAMPLE_PAYLOAD}</pre>
                    </div>
                </>)}

                {/* ── API Keys ── */}
                {tab === "api" && (<>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn-primary"><Plus size={14} />Create API Key</button>
                    </div>

                    <div style={{ ...CARD, overflow: "hidden" }}>
                        {API_KEYS.map((k, i) => (
                            <div key={k.name} style={{ padding: "16px 20px", borderBottom: i < API_KEYS.length - 1 ? "1px solid #F0EBE3" : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <Key size={14} style={{ color: "#6B675E" }} />
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#0D0D0D" }}>{k.name}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button onClick={() => { setCopied(k.name); setTimeout(() => setCopied(""), 2000); }}
                                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 12, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>
                                            {copied === k.name ? <><CheckCheck size={12} style={{ color: "#16A34A" }} />Copied</> : <><Copy size={12} />Copy</>}
                                        </button>
                                        <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "1.5px solid #FECACA", background: "#FEE2E2", fontSize: 12, fontWeight: 600, color: "#DC2626", cursor: "pointer" }}>
                                            <Trash2 size={12} />Revoke
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    <code style={{ fontSize: 12, fontFamily: "monospace", color: "#9333EA", background: "#F5F3FF", border: "1px solid #DDD6FE", padding: "3px 10px", borderRadius: 6 }}>
                                        {showKey[k.name] ? `${k.prefix}...full_key_hidden` : `${k.prefix}••••••••••••`}
                                    </code>
                                    <button onClick={() => setShowKey(p => ({ ...p, [k.name]: !p[k.name] }))}
                                        style={{ border: "none", background: "none", cursor: "pointer", color: "#A8A49C", padding: 4 }}>
                                        {showKey[k.name] ? <EyeOff size={13} /> : <Eye size={13} />}
                                    </button>
                                </div>
                                <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#A8A49C" }}>
                                    <span>Created: {k.created}</span>
                                    <span>Last used: {k.lastUsed}</span>
                                    <span>Scope: <code style={{ color: "#4F63FF", fontFamily: "monospace" }}>{k.scope}</code></span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 12, padding: "11px 16px", fontSize: 12, color: "#92400E", display: "flex", gap: 10 }}>
                        <span style={{ flexShrink: 0, fontWeight: 700 }}>⚠</span>
                        API keys only access metadata. Message/file content requires client-side decryption with member keypairs — not accessible via API.
                    </div>
                </>)}
            </div>
        </div>
    );
}
