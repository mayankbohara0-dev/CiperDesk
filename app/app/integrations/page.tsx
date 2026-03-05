"use client";
import { useState } from "react";
import {
    Plug, Webhook, Key, Zap, Github, Code, Check, Copy, CheckCheck,
    Plus, Trash2, Eye, EyeOff, Globe, RefreshCw, ToggleLeft, ToggleRight, Lock,
} from "lucide-react";
import { useIntegrations, useWebhooks, useApiKeys, useUser } from "@/lib/hooks";

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
    const [showKey, setShowKey] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState("");

    const { user } = useUser();
    const { integrations, toggleIntegration } = useIntegrations();
    const { webhooks, createWebhook, deleteWebhook } = useWebhooks();
    const { apiKeys, createApiKey, deleteApiKey } = useApiKeys();

    const enabled = integrations.reduce((acc, i) => ({ ...acc, [i.name]: i.is_enabled }), {} as Record<string, boolean>);

    const APPS = [
        { name: "GitHub", icon: Github, desc: "Link PRs and commits to Kanban tasks. Auto-close tasks on merge.", accent: "#0D0D0D", soon: true },
        { name: "Zapier", icon: Zap, desc: "Connect CipherDesk tasks/messages to 5,000+ other apps.", accent: "#F59E0B", soon: true },
        { name: "Webhook", icon: Webhook, desc: "Custom HTTP webhooks for task/message metadata events.", accent: "#4F63FF", soon: false },
        { name: "API", icon: Code, desc: "Direct API access for automations. Content requires client-side decryption.", accent: "#9333EA", soon: false },
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
                                    <button onClick={() => !app.soon && user && toggleIntegration(app.name, !enabled[app.name], user.id)} style={{ background: "none", border: "none", cursor: app.soon ? "not-allowed" : "pointer", color: enabled[app.name] ? "#0D0D0D" : "#C8C4BC", transition: "color .2s", opacity: app.soon ? 0.3 : 1 }}>
                                        {enabled[app.name] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                    </button>
                                </div>
                                <p style={{ fontSize: 13, color: "#6B675E", lineHeight: 1.6, marginBottom: 14 }}>{app.desc}</p>
                                {app.soon ? (
                                    <button disabled style={{ opacity: .8, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: "1.5px solid #E8E4DC", background: "#F5F0E8", fontSize: 13, fontWeight: 600, color: "#6B675E", cursor: "not-allowed" }}>Coming in Phase 8</button>
                                ) : enabled[app.name]
                                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}><Check size={10} />Connected</span>
                                    : <button onClick={() => user && toggleIntegration(app.name, true, user.id)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}><Plus size={13} />Connect</button>
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
                            <button className="btn-primary" style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => {
                                if (user) {
                                    createWebhook(`https://api.example.com/hook-${Math.floor(Math.random() * 1000)}`, ["task.created", "message.sent"], user.id);
                                }
                            }}><Plus size={12} />Add Webhook</button>
                        </div>
                        {webhooks.length > 0 ? webhooks.map((hook, i) => (
                            <div key={hook.id} style={{ padding: "16px 20px", borderBottom: i < webhooks.length - 1 ? "1px solid #F0EBE3" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{hook.url}</div>
                                    <div style={{ fontSize: 11, color: "#A8A49C", marginTop: 4 }}>Events: {hook.events.join(", ")}</div>
                                </div>
                                <button onClick={() => user && deleteWebhook(hook.id, user.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "#A8A49C", padding: 6 }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        )) : (
                            <div style={{ fontSize: 12, color: "#A8A49C", padding: "20px", textAlign: "center" }}>
                                No active webhooks configured.
                            </div>
                        )}
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
                        <button className="btn-primary" onClick={() => {
                            if (user) {
                                const id = Math.floor(Math.random() * 1000);
                                createApiKey(`Service Key ${id}`, `pk_live_${id}_`, "hash_data", user.id);
                            }
                        }}><Plus size={14} />Create API Key</button>
                    </div>

                    <div style={{ ...CARD, overflow: "hidden" }}>
                        {apiKeys.length > 0 ? apiKeys.map((key, i, arr) => (
                            <div key={key.name} style={{ padding: "16px 20px", borderBottom: i < arr.length - 1 ? "1px solid #F0EBE3" : "none", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{key.name}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <code style={{ fontSize: 11, fontFamily: "monospace", color: "#6B675E", background: "#F5F0E8", padding: "2px 8px", borderRadius: 6 }}>{showKey[key.name] ? key.key_prefix + "••••••••••" : key.key_prefix + "**********"}</code>
                                            <button onClick={() => setShowKey(p => ({ ...p, [key.name]: !p[key.name] }))} style={{ border: "none", background: "none", cursor: "pointer", color: "#A8A49C", display: "flex", alignItems: "center" }}>
                                                {showKey[key.name] ? <EyeOff size={13} /> : <Eye size={13} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "#A8A49C" }}>
                                        <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                                        <span>Last used: {key.last_used ? new Date(key.last_used).toLocaleDateString() : "Never"}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Lock size={10} />{key.scope}</div>
                                    </div>
                                </div>
                                <button onClick={() => user && deleteApiKey(key.id, user.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "#A8A49C", padding: 6 }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        )) : (
                            <div style={{ padding: "20px", textAlign: "center", color: "#6B675E", fontSize: 13 }}>
                                No active API keys.
                            </div>
                        )}
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
