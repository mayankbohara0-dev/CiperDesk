"use client";
import { useState } from "react";
import {
    Users, UserPlus, Shield, Lock, KeyRound, Check, MoreHorizontal,
    Crown, ShieldCheck, Eye, Mail, Clock, X, ChevronDown, Copy, CheckCheck,
} from "lucide-react";

type Role = "owner" | "admin" | "member";

const members = [
    { id: 1, name: "You (Arjun Mehta)", email: "arjun@buildfast.io", av: "AM", color: "#6366F1", role: "owner" as Role, joined: "Jan 12, 2026", online: true, devices: 2, keyVerified: true },
    { id: 2, name: "Priya Sharma", email: "priya@buildfast.io", av: "PS", color: "#8B5CF6", role: "admin" as Role, joined: "Jan 14, 2026", online: true, devices: 1, keyVerified: true },
    { id: 3, name: "Rahul Nair", email: "rahul@buildfast.io", av: "RN", color: "#10B981", role: "member" as Role, joined: "Jan 20, 2026", online: false, devices: 1, keyVerified: true },
    { id: 4, name: "Divya Kapoor", email: "divya@buildfast.io", av: "DK", color: "#F59E0B", role: "member" as Role, joined: "Feb 3, 2026", online: false, devices: 1, keyVerified: false },
];

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ElementType; styles: React.CSSProperties }> = {
    owner: { label: "Owner", icon: Crown, styles: { background: "rgba(245,158,11,.12)", color: "#FCD34D", border: "1px solid rgba(245,158,11,.25)" } },
    admin: { label: "Admin", icon: ShieldCheck, styles: { background: "rgba(99,102,241,.12)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,.25)" } },
    member: { label: "Member", icon: Users, styles: { background: "rgba(255,255,255,.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,.1)" } },
};

function RoleBadge({ role }: { role: Role }) {
    const cfg = ROLE_CONFIG[role];
    const Icon = cfg.icon;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, ...cfg.styles }}>
            <Icon size={11} />{cfg.label}
        </span>
    );
}

export default function MembersPage() {
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<Role>("member");
    const [inviteSent, setInviteSent] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        setInviteSent(true);
        setTimeout(() => { setInviteOpen(false); setInviteSent(false); setInviteEmail(""); }, 2000);
    };

    const copyLink = () => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const S = {
        page: { height: "100%", display: "flex", flexDirection: "column" as const, overflow: "hidden" },
        header: { padding: "20px 28px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" },
        body: { flex: 1, overflowY: "auto" as const, padding: "28px" },
        card: { background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16 },
        modal: { position: "fixed" as const, inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)" },
    };

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.header}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <Users size={20} style={{ color: "#818CF8" }} />
                        <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Team Members</h1>
                        <span style={{ padding: "2px 10px", borderRadius: 100, background: "rgba(99,102,241,.15)", color: "#A5B4FC", fontSize: 12, fontWeight: 600, border: "1px solid rgba(99,102,241,.25)" }}>
                            {members.length} / 5
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748B" }}>Manage team access · All crypto keys are verified client-side</p>
                </div>
                <button className="btn-primary" onClick={() => setInviteOpen(true)} style={{ gap: 8 }}>
                    <UserPlus size={16} /> Invite Member
                </button>
            </div>

            <div style={S.body}>
                {/* Plan note */}
                <div style={{ ...S.card, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Lock size={15} style={{ color: "#22D3EE" }} />
                        <span style={{ fontSize: 13, color: "#94A3B8" }}>
                            Free plan · <strong style={{ color: "#E2E8F0" }}>4 / 5 members</strong> used · 1 seat remaining
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#64748B" }}>Invite link:</span>
                        <code style={{ fontSize: 11, fontFamily: "monospace", color: "#818CF8", background: "rgba(99,102,241,.1)", padding: "3px 10px", borderRadius: 6 }}>
                            cipherdesk.io/invite/bf9x2k
                        </code>
                        <button onClick={copyLink} className="btn-ghost" style={{ padding: "4px 10px", fontSize: 12, gap: 5 }}>
                            {linkCopied ? <><CheckCheck size={13} style={{ color: "#10B981" }} />Copied!</> : <><Copy size={13} />Copy</>}
                        </button>
                    </div>
                </div>

                {/* Members table */}
                <div style={S.card}>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 16, fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".06em", color: "#475569" }}>
                        <span>Member</span>
                        <span style={{ textAlign: "center" }}>Role</span>
                        <span style={{ textAlign: "center" }}>Joined</span>
                        <span style={{ textAlign: "center" }}>Key Status</span>
                        <span />
                    </div>

                    {members.map((m, i) => (
                        <div key={m.id} style={{
                            padding: "16px 20px",
                            borderBottom: i < members.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
                            display: "grid", gridTemplateColumns: "1fr auto auto auto auto",
                            gap: 16, alignItems: "center",
                            transition: "background .15s",
                        }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.02)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>

                            {/* Avatar + info */}
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ position: "relative", flexShrink: 0 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: `0 0 14px ${m.color}55` }}>
                                        {m.av}
                                    </div>
                                    {m.online && <div style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#10B981", border: "2px solid #030711" }} />}
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{m.name}</div>
                                    <div style={{ fontSize: 12, color: "#64748B" }}>{m.email} · {m.devices} device{m.devices > 1 ? "s" : ""}</div>
                                </div>
                            </div>

                            {/* Role */}
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <RoleBadge role={m.role} />
                            </div>

                            {/* Joined */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                                <Clock size={12} style={{ color: "#475569" }} />
                                <span style={{ fontSize: 12, color: "#64748B" }}>{m.joined}</span>
                            </div>

                            {/* Key verification */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                                {m.keyVerified ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6EE7B7", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.2)", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>
                                        <ShieldCheck size={11} />Verified
                                    </span>
                                ) : (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#FCD34D", background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.2)", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>
                                        <Clock size={11} />Pending
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {m.role !== "owner" && (
                                    <button className="btn-ghost" style={{ padding: "4px 8px" }}>
                                        <MoreHorizontal size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Key verification notice */}
                <div style={{ ...S.card, padding: "16px 20px", marginTop: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <KeyRound size={16} style={{ color: "#22D3EE", flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>How key verification works</p>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.65 }}>
                            Each member&apos;s Ed25519 public key is verified against a fingerprint displayed in your authenticator app.
                            Compare fingerprints out-of-band (in person or via a secure call) to confirm identity.
                            The server never participates in this verification — it&apos;s purely peer-to-peer.
                        </p>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {inviteOpen && (
                <div style={S.modal} onClick={e => e.target === e.currentTarget && setInviteOpen(false)}>
                    <div style={{ background: "rgba(8,16,40,.98)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 460, backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,.8)" }} className="animate-scale-in">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>Invite a team member</h2>
                            <button className="btn-ghost" style={{ padding: 6 }} onClick={() => setInviteOpen(false)}><X size={18} /></button>
                        </div>

                        {inviteSent ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16,185,129,.15)", border: "1px solid rgba(16,185,129,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                    <Check size={24} style={{ color: "#10B981" }} />
                                </div>
                                <p style={{ fontSize: 16, fontWeight: 600, color: "#F1F5F9", marginBottom: 6 }}>Invite sent!</p>
                                <p style={{ fontSize: 13, color: "#64748B" }}>They&apos;ll receive an encrypted invite link via email.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#CBD5E1", marginBottom: 8 }}>Email address</label>
                                    <input type="email" className="input-field" placeholder="colleague@company.com"
                                        value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required autoFocus />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#CBD5E1", marginBottom: 8 }}>Role</label>
                                    <select className="input-field" value={inviteRole} onChange={e => setInviteRole(e.target.value as Role)}>
                                        <option value="member">Member — can view and post</option>
                                        <option value="admin">Admin — can manage channels and members</option>
                                    </select>
                                </div>
                                <div style={{ padding: 14, borderRadius: 10, background: "rgba(6,182,212,.05)", border: "1px solid rgba(6,182,212,.12)", display: "flex", alignItems: "flex-start", gap: 10 }}>
                                    <Lock size={13} style={{ color: "#22D3EE", flexShrink: 0, marginTop: 2 }} />
                                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                                        An encrypted invite link is generated. When they accept, their browser generates a local Ed25519/X25519 keypair.
                                        Their private key never leaves their device.
                                    </p>
                                </div>
                                <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "12px" }}>
                                    <Mail size={15} /> Send Encrypted Invite
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
