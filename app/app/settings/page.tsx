"use client";

import { useState } from "react";
import {
    Shield, Lock, User, Building2, Smartphone, Key, Trash2, LogOut,
    AlertTriangle, Check, ChevronRight, Monitor, Laptop, Globe, Clock,
    RotateCcw, Flame, Timer, Sparkles, Loader2
} from "lucide-react";
import { useUser, updateProfile } from "@/lib/hooks";
import { supabase } from "@/lib/supabase/client";

type Tab = "profile" | "workspace" | "security" | "billing";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "workspace", label: "Workspace", icon: Building2 },
    { id: "security", label: "Security & Devices", icon: Shield },
    { id: "billing", label: "Billing", icon: Sparkles },
];

const DEVICES = [
    { id: "1", name: "MacBook Pro 16\"", Icon: Laptop, os: "macOS 14.3", location: "Mumbai, India", lastActive: "Active now", isCurrent: true, browser: "Chrome 122" },
    { id: "2", name: "Windows PC", Icon: Monitor, os: "Windows 11", location: "Pune, India", lastActive: "2 hours ago", isCurrent: false, browser: "Edge 121" },
    { id: "3", name: "iPhone 15 Pro", Icon: Smartphone, os: "iOS 17.3", location: "Mumbai, India", lastActive: "Yesterday, 9:30 PM", isCurrent: false, browser: "Safari" },
];

/* shared helpers */
const SH2 = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 14 }}>{children}</h2>
);

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E8E4DC", padding: 20, ...style }}>{children}</div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>{children}</label>
);

/* ── Tabs ── */
function ProfileTab() {
    const { user, profile, loading } = useUser();
    const [name, setName] = useState(profile?.full_name || "");
    const [saving, setSaving] = useState(false);

    if (loading) return <div style={{ padding: 40 }}><Loader2 className="animate-spin" /></div>;

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        await updateProfile(user.id, { full_name: name });
        setSaving(false);
    };

    const initials = name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : profile?.email.slice(0, 2).toUpperCase();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 540 }}>
            <div>
                <SH2>Profile Settings</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Avatar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 18, background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#0D0D0D" }}>{initials || "U"}</div>
                        <div>
                            <button style={{ padding: "7px 14px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>Change Avatar</button>
                            <p style={{ fontSize: 11, color: "#A8A49C", marginTop: 5 }}>Upload a custom profile image.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <Label>Full Name</Label>
                            <input className="input-field" value={name || profile?.full_name || ""} onChange={e => setName(e.target.value)} type="text" />
                        </div>
                        <div>
                            <Label>Email (Read Only)</Label>
                            <input className="input-field" value={profile?.email || ""} disabled type="email" style={{ opacity: 0.7 }} />
                        </div>
                        <div>
                            <Label>Role</Label>
                            <input className="input-field" value={profile?.role || "member"} disabled style={{ textTransform: "capitalize", opacity: 0.7 }} type="text" />
                        </div>
                    </div>
                    <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ width: "fit-content" }}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </Card>
            </div>

            <div>
                <SH2>Change Password</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[{ label: "Current Password", ph: "••••••••••••" }, { label: "New Password", ph: "Min 12 characters" }].map(f => (
                        <div key={f.label}>
                            <Label>{f.label}</Label>
                            <input className="input-field" type="password" placeholder={f.ph} />
                        </div>
                    ))}
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                        <Lock size={12} style={{ color: "#166534" }} />
                        <p style={{ fontSize: 12, color: "#166534" }}>Handled securely via Supabase Auth. Automatically salted and hashed.</p>
                    </div>
                    <button style={{ padding: "9px 18px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer", width: "fit-content" }}>Update Password</button>
                </Card>
            </div>
        </div>
    );
}

function WorkspaceTab() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 540 }}>
            <div>
                <SH2>Workspace Settings</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div><Label>Workspace Name</Label><input className="input-field" defaultValue="BuildFast HQ" /></div>
                    <div>
                        <Label>Workspace URL</Label>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, color: "#A8A49C", fontFamily: "monospace", whiteSpace: "nowrap" }}>app.cipherdesk.io/</span>
                            <input className="input-field" defaultValue="buildfast-hq" style={{ flex: 1 }} />
                        </div>
                    </div>
                    <div>
                        <Label>Member Limit</Label>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC" }}>
                            <div style={{ display: "flex" }}>
                                {["#4F63FF", "#9333EA", "#2E7D32", "#AAEF45"].map((bg, i) => (
                                    <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: bg, border: "2px solid #F5F0E8", marginLeft: i ? -6 : 0, fontSize: 9, fontWeight: 800, color: bg === "#AAEF45" ? "#0D0D0D" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {["A", "P", "R", "Y"][i]}
                                    </div>
                                ))}
                            </div>
                            <span style={{ fontSize: 13, color: "#0D0D0D", fontWeight: 600 }}>4 / 5 members</span>
                            <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "#E8E4DC", color: "#6B675E", fontWeight: 600 }}>Free Plan</span>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ width: "fit-content" }}>Save Changes</button>
                </Card>
            </div>

            <div>
                <SH2>Invite Members</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <input className="input-field" style={{ flex: 1 }} placeholder="teammate@company.com" type="email" />
                        <select className="input-field" style={{ width: 110 }}><option>Member</option><option>Admin</option></select>
                    </div>
                    <button className="btn-primary" style={{ width: "fit-content" }}>
                        <Lock size={13} /> Send Secure Invite
                    </button>
                    <p style={{ fontSize: 11, color: "#A8A49C", display: "flex", alignItems: "center", gap: 5 }}>
                        <Shield size={11} style={{ color: "#2E7D32" }} /> Invite links are cryptographically signed. Expire after 48 hours.
                    </p>
                </Card>
            </div>

            <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#DC2626", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 14 }}>Danger Zone</h2>
                <Card style={{ border: "1.5px solid #FECACA" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Delete Workspace</p>
                            <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 3 }}>Permanently delete workspace and all encrypted data. Irreversible.</p>
                        </div>
                        <button style={{ padding: "8px 14px", borderRadius: 10, background: "#FEE2E2", border: "1.5px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Delete</button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function SecurityTab() {
    const [burnConfirm, setBurnConfirm] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
            {/* 2FA */}
            <div>
                <SH2>Two-Factor Authentication</SH2>
                <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F0FDF4", border: "1.5px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={18} style={{ color: "#16A34A" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>2FA Enabled</p>
                            <p style={{ fontSize: 12, color: "#A8A49C" }}>Using Authenticator App (TOTP)</p>
                        </div>
                    </div>
                    <button style={{ padding: "7px 14px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>Reconfigure</button>
                </Card>
            </div>

            {/* Key management */}
            <div>
                <SH2>Workspace Key Management</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Key size={18} style={{ color: "#0D0D0D" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D", marginBottom: 4 }}>Workspace Encryption Key</p>
                            <p style={{ fontSize: 12, color: "#A8A49C", lineHeight: 1.6 }}>256-bit AES key generated client-side. Distributed encrypted to each member via their public key.</p>
                            <p style={{ fontSize: 11, fontFamily: "monospace", color: "#A8A49C", marginTop: 6 }}>Last rotated: <span style={{ color: "#0D0D0D", fontWeight: 600 }}>Feb 25, 2026 · 10:00 AM</span></p>
                        </div>
                    </div>
                    <button style={{ width: "fit-content", display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>
                        <RotateCcw size={14} /> Rotate Workspace Key
                    </button>
                    <p style={{ fontSize: 12, color: "#A8A49C" }}>Key rotation re-encrypts access for all current members. Removed members lose access permanently.</p>
                </Card>
            </div>

            {/* Burn mode */}
            <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#DC2626", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
                    <Flame size={14} /> Burn Mode
                </h2>
                <Card style={{ border: "1.5px solid #FECACA", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <AlertTriangle size={18} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Destroy Thread Encryption Key</p>
                            <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 4, lineHeight: 1.6 }}>
                                Permanently destroys the encryption key for a selected thread. Messages become permanently unreadable.
                                This action is <span style={{ color: "#DC2626", fontWeight: 700 }}>irreversible</span>.
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setBurnConfirm(!burnConfirm)}
                        style={{ width: "fit-content", display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, background: "#FEE2E2", border: "1.5px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                        <Flame size={14} /> Initiate Burn Mode
                    </button>
                </Card>
            </div>

            {/* Auto-delete */}
            <div>
                <SH2>Auto-Delete Policy</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Message TTL</p>
                            <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 3 }}>Automatically delete messages after a set period.</p>
                        </div>
                        <select className="input-field" style={{ width: 140 }}>
                            <option>Never</option><option>7 days</option><option>30 days</option><option>90 days</option>
                        </select>
                    </div>
                    <button style={{ width: "fit-content", padding: "9px 16px", borderRadius: 10, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 13, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>Save Policy</button>
                </Card>
            </div>

            {/* Devices */}
            <div>
                <SH2>Active Devices</SH2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {DEVICES.map(d => (
                        <Card key={d.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <d.Icon size={19} style={{ color: "#6B675E" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{d.name}</p>
                                    {d.isCurrent && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>Current</span>}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
                                    {[d.os, d.browser].map((t, i) => <span key={i} style={{ fontSize: 12, color: "#A8A49C" }}>{t}</span>)}
                                    <span style={{ fontSize: 12, color: "#A8A49C", display: "flex", alignItems: "center", gap: 4 }}><Globe size={10} />{d.location}</span>
                                </div>
                                <div style={{ fontSize: 11, color: "#A8A49C", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                                    <Clock size={10} />{d.lastActive}
                                </div>
                            </div>
                            {!d.isCurrent && (
                                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 9, background: "#FEE2E2", border: "1.5px solid #FECACA", color: "#DC2626", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                    <LogOut size={12} /> Revoke
                                </button>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BillingTab() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 540 }}>
            <div>
                <SH2>Current Plan</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Shield size={19} style={{ color: "#0D0D0D" }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 15, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Free Plan</p>
                                <p style={{ fontSize: 12, color: "#A8A49C" }}>5 members · 5 GB storage</p>
                            </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "#F5F0E8", color: "#6B675E" }}>Active</span>
                    </div>
                    <button className="btn-primary" style={{ justifyContent: "center" }}>
                        <Sparkles size={14} /> Upgrade to Pro — ₹299/user/month
                    </button>
                </Card>
            </div>

            <div>
                <SH2>Pro Plan Includes</SH2>
                <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Unlimited members", "100 GB encrypted storage", "AI chat summarization", "AI task suggestions", "Weekly encrypted digest", "Advanced security controls", "Device management", "Priority support"].map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Check size={11} style={{ color: "#0D0D0D" }} />
                            </div>
                            <span style={{ fontSize: 13, color: "#0D0D0D" }}>{f}</span>
                        </div>
                    ))}
                </Card>
            </div>

            <div style={{ background: "#F5F0E8", border: "1.5px solid #E8E4DC", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Lock size={14} style={{ color: "#6B675E", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "#6B675E", lineHeight: 1.6 }}>No ads. No data selling. Revenue comes from subscriptions only. We are financially incentivized to protect your privacy.</p>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const TAB_CONTENT: Record<Tab, React.ReactNode> = {
        profile: <ProfileTab />,
        workspace: <WorkspaceTab />,
        security: <SecurityTab />,
        billing: <BillingTab />,
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Settings</h1>
            </div>

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Sidebar */}
                <div style={{ width: 210, flexShrink: 0, borderRight: "1.5px solid #E8E4DC", background: "#fff", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
                    {TABS.map(tab => {
                        const active = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", transition: "all .15s", textAlign: "left", background: active ? "#0D0D0D" : "transparent", color: active ? "#fff" : "#6B675E", fontWeight: active ? 700 : 500, fontSize: 13, fontFamily: "Inter, sans-serif" }}
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#F5F0E8"; }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                                <tab.icon size={15} />
                                <span style={{ flex: 1 }}>{tab.label}</span>
                                {active && <ChevronRight size={13} />}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
                    {TAB_CONTENT[activeTab]}
                </div>
            </div>
        </div>
    );
}
