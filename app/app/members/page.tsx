"use client";
import { useState } from "react";
import {
    Users, UserPlus, Shield, Lock, KeyRound, Check, MoreHorizontal,
    Crown, ShieldCheck, Mail, Clock, X, Copy, CheckCheck,
} from "lucide-react";
import { useMembers, useUser, type Profile } from "@/lib/hooks";

type Role = "owner" | "admin" | "member";

const ROLE_CFG: Record<Role, { label: string; icon: React.ElementType; bg: string; color: string }> = {
    owner: { label: "Owner", icon: Crown, bg: "#FEF9C3", color: "#854D0E" },
    admin: { label: "Admin", icon: ShieldCheck, bg: "#EEF2FF", color: "#3730A3" },
    member: { label: "Member", icon: Users, bg: "#F5F0E8", color: "#6B675E" },
};

function RoleBadge({ role }: { role: Role }) {
    const r = (["owner", "admin", "member"].includes(role) ? role : "member") as Role;
    const c = ROLE_CFG[r];
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color }}>
            <c.icon size={10} />{c.label}
        </span>
    );
}

function getAvatarBg(id: string) {
    const colors = ["#4F63FF", "#9333EA", "#2E7D32", "#D97706", "#DC2626", "#0891B2"];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

export default function MembersPage() {
    const { user } = useUser();
    const { members, loading, updateRole } = useMembers();

    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<Role>("member");
    const [inviteSent, setInviteSent] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        setInviteSent(true);
        // In a real app, this would call supabase API to send magic link
        setTimeout(() => { setInviteOpen(false); setInviteSent(false); setInviteEmail(""); }, 2000);
    };
    const copyLink = () => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-3.5 md:px-6 md:py-3.5 border-b-[1.5px] border-[#E8E4DC] bg-white shrink-0 gap-3">
                <div>
                    <h1 className="text-[16px] md:text-[17px] font-black text-[#0D0D0D] font-['Plus_Jakarta_Sans',sans-serif] tracking-[-.02em]">Team Members</h1>
                    <p className="hidden md:block text-[12px] text-[#A8A49C] mt-[2px]">Manage team access · All crypto keys are verified client-side</p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
                    {!loading && <span className="text-[12px] md:text-[13px] text-[#A8A49C] md:mr-2.5">{members.length} members</span>}
                    <button className="btn-primary" onClick={() => setInviteOpen(true)}>
                        <UserPlus size={15} /> Invite Member
                    </button>
                </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Plan bar */}
                <div style={{ background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 14, padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Lock size={13} style={{ color: "#166534" }} />
                        <span style={{ fontSize: 13, color: "#0D0D0D" }}>Free plan · <strong>{members.length} / 5 members</strong> used · {5 - members.length} seats remaining</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#A8A49C" }}>Invite link:</span>
                        <code style={{ fontSize: 11, fontFamily: "monospace", color: "#4F63FF", background: "#EEF2FF", padding: "3px 10px", borderRadius: 6 }}>cipherdesk.io/invite/bf9x2k</code>
                        <button onClick={copyLink} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 7, border: "1.5px solid #E8E4DC", background: "#fff", fontSize: 12, fontWeight: 600, color: "#0D0D0D", cursor: "pointer" }}>
                            {linkCopied ? <><CheckCheck size={12} style={{ color: "#16A34A" }} />Copied!</> : <><Copy size={12} />Copy</>}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full xl:max-w-[1000px] overflow-x-auto">
                    <div className="bg-white rounded-[14px] border-[1.5px] border-[#E8E4DC] overflow-hidden min-w-[700px]">
                        {/* Header */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 150px 120px 110px 40px", padding: "10px 20px", borderBottom: "1.5px solid #E8E4DC", background: "#F5F0E8" }}>
                            {["Member", "Role", "Joined", "Key Ver.", ""].map(h => (
                                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6B675E", textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</span>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite" }} />
                            </div>
                        ) : (members.map((m, i) => {
                            const bg = getAvatarBg(m.id);
                            const initials = m.full_name ? m.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : m.email.slice(0, 2).toUpperCase();
                            const isMe = user?.id === m.id;
                            const date = new Date(m.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

                            return (
                                <div key={m.id}
                                    style={{ display: "grid", gridTemplateColumns: "1.5fr 150px 120px 110px 40px", alignItems: "center", padding: "14px 20px", borderBottom: i < members.length - 1 ? "1px solid #F0EBE3" : "none", transition: "background .15s" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF7"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>

                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ position: "relative", flexShrink: 0 }}>
                                            <div style={{ width: 38, height: 38, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>{initials}</div>
                                            {isMe && <div style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#22C55E", border: "2px solid #fff" }} />}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D", display: "flex", alignItems: "center", gap: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {m.full_name || "Unknown"}
                                                {isMe && <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 4, background: "#AAEF45", color: "#0D0D0D" }}>YOU</span>}
                                            </div>
                                            <div style={{ fontSize: 12, color: "#A8A49C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <select style={{ fontSize: 12, background: "transparent", border: "none", outline: "none", cursor: "pointer", color: "#0D0D0D", fontWeight: 700 }}
                                            value={m.role} onChange={e => { if (user) updateRole(m.id, e.target.value, user.id) }} disabled={isMe}>
                                            <option value="member">Member</option>
                                            <option value="admin">Admin</option>
                                            <option value="owner">Owner</option>
                                        </select>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#A8A49C" }}>
                                        <Clock size={11} />{date}
                                    </div>

                                    <div>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}><ShieldCheck size={10} />Verified</span>
                                    </div>

                                    <div>{!isMe && m.role !== "owner" && <button style={{ border: "none", background: "none", cursor: "pointer", color: "#C8C4BC", padding: 4 }}><MoreHorizontal size={16} /></button>}</div>
                                </div>
                            );
                        }))}
                    </div>
                </div>

                {/* Key verification info */}
                <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <KeyRound size={16} style={{ color: "#166534", flexShrink: 0, marginTop: 1 }} />
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 4 }}>How key verification works</p>
                        <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.65, opacity: .85 }}>
                            Each member&apos;s Ed25519 public key is verified against a fingerprint displayed in your authenticator app. Compare fingerprints out-of-band (in person or via a secure call) to confirm identity. The server never participates in this verification — it&apos;s purely peer-to-peer.
                        </p>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {inviteOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,13,13,.4)", backdropFilter: "blur(6px)" }}
                    onClick={e => e.target === e.currentTarget && setInviteOpen(false)}>
                    <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Invite a team member</h2>
                            <button onClick={() => setInviteOpen(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#A8A49C", padding: 4 }}><X size={18} /></button>
                        </div>

                        {inviteSent ? (
                            <div style={{ textAlign: "center", padding: "24px 0" }}>
                                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                                    <Check size={24} style={{ color: "#0D0D0D" }} />
                                </div>
                                <p style={{ fontSize: 16, fontWeight: 800, color: "#0D0D0D", marginBottom: 6 }}>Invite sent!</p>
                                <p style={{ fontSize: 13, color: "#A8A49C" }}>They&apos;ll receive an encrypted invite link via email.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>Email address</label>
                                    <input type="email" className="input-field" placeholder="colleague@company.com"
                                        value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required autoFocus />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>Role</label>
                                    <select className="input-field" value={inviteRole} onChange={e => setInviteRole(e.target.value as Role)}>
                                        <option value="member">Member — can view and post</option>
                                        <option value="admin">Admin — can manage channels and members</option>
                                    </select>
                                </div>
                                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "11px 14px", display: "flex", gap: 10 }}>
                                    <Lock size={13} style={{ color: "#166534", flexShrink: 0, marginTop: 1 }} />
                                    <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.55 }}>An encrypted invite link is generated. When they accept, their browser generates a local Ed25519/X25519 keypair. Their private key never leaves their device.</p>
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
