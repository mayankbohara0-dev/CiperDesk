"use client";
import { useState } from "react";
import {
    Plug, Webhook, Key, Zap, Github, Code, Check, Copy, CheckCheck,
    Plus, Trash2, Eye, EyeOff, Globe, RefreshCw, ToggleLeft, ToggleRight,
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

export default function IntegrationsPage() {
    const [tab, setTab] = useState<TabId>("apps");
    const [enabled, setEnabled] = useState<Record<string, boolean>>({ GitHub: true, Webhook: true });
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState("");

    const APPS = [
        { name: "GitHub", icon: Github, desc: "Link PRs and commits to Kanban tasks. Auto-close tasks on merge.", color: "#94A3B8" },
        { name: "Zapier", icon: Zap, desc: "Connect CipherDesk tasks/messages to 5,000+ other apps.", color: "#F59E0B" },
        { name: "Webhook", icon: Webhook, desc: "Custom HTTP webhooks for task/message metadata events.", color: "#22D3EE" },
        { name: "API", icon: Code, desc: "Direct API access for automations. Content requires client-side decryption.", color: "#818CF8" },
    ];

    const API_KEYS = [
        { name: "CI/CD Pipeline", prefix: "cd_live_xK9mQ", created: "Feb 10, 2026", lastUsed: "3h ago", scope: "tasks:read, vault:read" },
        { name: "Metrics Script", prefix: "cd_live_bT4pR", created: "Mar 1, 2026", lastUsed: "1d ago", scope: "audit:read" },
    ];

    const card = { background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16 } as React.CSSProperties;

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <Plug size={20} style={{ color: "#818CF8" }} />
                    <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Integrations</h1>
                </div>
                <p style={{ fontSize: 13, color: "#64748B" }}>Connect external tools · Message content is always E2EE — integrations receive only metadata</p>
            </div>

            <div style={{ display: "flex", gap: 4, padding: "10px 28px", borderBottom: "1px solid rgba(255,255,255,.05)", flexShrink: 0 }}>
                {([["apps", "Apps"], ["webhooks", "Webhooks"], ["api", "API Keys"]] as [TabId, string][]).map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)} style={{
                        padding: "7px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                        background: tab === id ? "rgba(99,102,241,.18)" : "transparent",
                        color: tab === id ? "#A5B4FC" : "#64748B",
                        outline: tab === id ? "1px solid rgba(99,102,241,.3)" : "none", transition: "all .15s",
                    }}>{label}</button>
                ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>

                {tab === "apps" && (
                    <>
                        <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(6,182,212,.05)", border: "1px solid rgba(6,182,212,.15)", fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 10 }}>
                            <Globe size={14} style={{ color: "#22D3EE", flexShrink: 0 }} />
                            All integrations receive <strong style={{ color: "#CBD5E1" }}>metadata events only</strong>. Message and file content is E2EE and never shared with third parties.
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
                            {APPS.map(app => (
                                <div key={app.name} style={{ ...card, padding: 22, transition: "all .25s" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,.25)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.07)"}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <app.icon size={20} style={{ color: app.color }} />
                                            </div>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>{app.name}</span>
                                        </div>
                                        <button onClick={() => setEnabled(p => ({ ...p, [app.name]: !p[app.name] }))} style={{ background: "none", border: "none", cursor: "pointer", color: enabled[app.name] ? "#818CF8" : "#475569", transition: "color .2s" }}>
                                            {enabled[app.name] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                        </button>
                                    </div>
                                    <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 14 }}>{app.desc}</p>
                                    {enabled[app.name]
                                        ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)", color: "#6EE7B7" }}><Check size={10} />Connected</span>
                                        : <button className="btn-secondary" style={{ fontSize: 12, gap: 6, padding: "6px 14px" }}><Plus size={13} />Connect</button>}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {tab === "webhooks" && (
                    <>
                        <div style={{ ...card, overflow: "hidden" }}>
                            <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Active Webhooks</h3>
                                <button className="btn-primary" style={{ fontSize: 12, gap: 7, padding: "7px 14px" }}><Plus size={13} />Add Webhook</button>
                            </div>
                            {[
                                { url: "https://hooks.zapier.com/hooks/catch/xxxx/yyyy", events: ["task.created", "task.completed"], last: "3h ago" },
                                { url: "https://ci.buildfast.io/cipherdesk/push", events: ["vault.upload"], last: "1d ago" },
                            ].map((wh, i, arr) => (
                                <div key={i} style={{ padding: "14px 22px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                            <code style={{ fontSize: 12, fontFamily: "monospace", color: "#818CF8" }}>{wh.url}</code>
                                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.2)", color: "#6EE7B7" }}>200 OK</span>
                                        </div>
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                            {wh.events.map(e => <span key={e} className="badge-ghost" style={{ fontSize: 10 }}>{e}</span>)}
                                            <span style={{ fontSize: 11, color: "#475569", marginLeft: 4 }}>· Last sent {wh.last}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button className="btn-ghost" style={{ padding: "6px 10px", fontSize: 12, gap: 5 }}><RefreshCw size={12} />Test</button>
                                        <button className="btn-danger" style={{ padding: "6px 10px", fontSize: 12 }}><Trash2 size={13} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ ...card, padding: 22 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                                <Code size={15} style={{ color: "#818CF8" }} /><h3 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9" }}>Sample Payload</h3>
                            </div>
                            <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#94A3B8", background: "rgba(3,7,17,.9)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: 16, overflow: "auto", lineHeight: 1.65 }}>{SAMPLE_PAYLOAD}</pre>
                        </div>
                    </>
                )}

                {tab === "api" && (
                    <>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button className="btn-primary" style={{ fontSize: 13, gap: 8 }}><Plus size={15} />Create API Key</button>
                        </div>
                        <div style={{ ...card, overflow: "hidden" }}>
                            {API_KEYS.map((k, i) => (
                                <div key={k.name} style={{ padding: "16px 22px", borderBottom: i < API_KEYS.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <Key size={15} style={{ color: "#818CF8" }} />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{k.name}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button onClick={() => { setCopied(k.name); setTimeout(() => setCopied(""), 2000); }} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12, gap: 5 }}>
                                                {copied === k.name ? <><CheckCheck size={12} style={{ color: "#10B981" }} />Copied</> : <><Copy size={12} />Copy</>}
                                            </button>
                                            <button className="btn-danger" style={{ padding: "5px 10px", fontSize: 12, gap: 5 }}><Trash2 size={12} />Revoke</button>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                        <code style={{ fontSize: 12, fontFamily: "monospace", color: "#f472b6", background: "rgba(244,63,94,.07)", border: "1px solid rgba(244,63,94,.15)", padding: "3px 10px", borderRadius: 6 }}>
                                            {showKey[k.name] ? `${k.prefix}...full_key_hidden` : `${k.prefix}••••••••••••`}
                                        </code>
                                        <button onClick={() => setShowKey(p => ({ ...p, [k.name]: !p[k.name] }))} className="btn-ghost" style={{ padding: "3px 8px" }}>
                                            {showKey[k.name] ? <EyeOff size={13} /> : <Eye size={13} />}
                                        </button>
                                    </div>
                                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#475569" }}>
                                        <span>Created: {k.created}</span><span>Last used: {k.lastUsed}</span>
                                        <span>Scope: <code style={{ color: "#818CF8", fontFamily: "monospace" }}>{k.scope}</code></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(245,158,11,.05)", border: "1px solid rgba(245,158,11,.15)", fontSize: 12, color: "#94A3B8", display: "flex", gap: 10 }}>
                            <span style={{ color: "#F59E0B", flexShrink: 0 }}>⚠</span>
                            API keys only access metadata. Message/file content requires client-side decryption with member keypairs — not accessible via API.
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
