"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

function strengthScore(pw: string) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^a-zA-Z0-9]/.test(pw)) s++;
    return s;
}
const STRENGTH_LABELS = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const STRENGTH_COLORS = ["", "#EF4444", "#F97316", "#F59E0B", "#22C55E", "#10B981"];

export default function RegisterPage() {
    const [workspace, setWorkspace] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const score = strengthScore(password);
    const wsSlug = workspace.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!workspace || !name || !email || !password) { setError("Please fill in all fields."); return; }
        if (score < 2) { setError("Password is too weak. Add uppercase, numbers, or symbols."); return; }
        setLoading(true);
        setTimeout(() => { window.location.href = "/app/chat/general"; }, 1500);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }} className="grid-pattern">
            <div style={{ width: 500, height: 500, background: "rgba(79,70,229,.07)", borderRadius: "50%", filter: "blur(80px)", position: "absolute", top: "33%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

            <div className="relative w-full animate-in" style={{ maxWidth: 480 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(79,70,229,.4)" }}>
                            <Shield size={20} className="text-white" />
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>Cipher<span className="text-gradient">Desk</span></span>
                    </Link>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9" }}>Create your workspace</h1>
                    <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 8 }}>
                        Set up your encrypted team workspace in seconds.
                    </p>
                </div>

                <div className="card">
                    {error && (
                        <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 14, marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {/* Workspace name */}
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#CBD5E1", marginBottom: 8 }}>Workspace Name</label>
                            <input id="workspace" type="text" className="input-field" placeholder="Acme Inc."
                                value={workspace} onChange={e => setWorkspace(e.target.value)} required autoFocus />
                            {wsSlug && (
                                <p style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>
                                    Your workspace URL:{" "}
                                    <span style={{ fontFamily: "monospace", color: "#818CF8" }}>app.cipherdesk.io/{wsSlug}</span>
                                </p>
                            )}
                        </div>

                        {/* Name */}
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#CBD5E1", marginBottom: 8 }}>Full Name</label>
                            <input id="fullname" type="text" className="input-field" placeholder="Jane Doe"
                                value={name} onChange={e => setName(e.target.value)} required />
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#CBD5E1", marginBottom: 8 }}>Work Email</label>
                            <input id="email" type="email" className="input-field" placeholder="you@company.com"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#CBD5E1", marginBottom: 8 }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <input id="password" type={showPw ? "text" : "password"} className="input-field" style={{ paddingRight: 44 }}
                                    placeholder="Min 12 characters" value={password} onChange={e => setPassword(e.target.value)} required />
                                <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password"
                                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>

                            {password.length > 0 && (
                                <div style={{ marginTop: 10 }}>
                                    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= score ? STRENGTH_COLORS[score] : "#263248", transition: "all .3s" }} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 12, color: STRENGTH_COLORS[score] || "#64748B" }}>
                                        {STRENGTH_LABELS[score] || "Enter a password"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Key generation notice */}
                        <div style={{ background: "rgba(34,211,238,.05)", border: "1px solid rgba(34,211,238,.15)", borderRadius: 10, padding: "14px" }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>What happens when you register</p>
                            <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {[
                                    "Ed25519 signing keypair generated locally in your browser",
                                    "X25519 key exchange keypair generated for encrypted sessions",
                                    "Private keys never leave your device — ever",
                                    "Workspace AES-256 key generated and wrapped with your public key",
                                ].map(s => (
                                    <li key={s} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#94A3B8" }}>
                                        <Lock size={11} style={{ color: "#22D3EE", flexShrink: 0, marginTop: 2 }} />{s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button type="submit" className="btn-primary justify-center py-3.5 w-full" disabled={loading} style={{ fontSize: "1rem" }}>
                            {loading ? (
                                <>
                                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} />
                                    Generating your keys…
                                </>
                            ) : <>Create Workspace <ArrowRight size={17} /></>}
                        </button>

                        <p style={{ fontSize: 12, color: "#475569", textAlign: "center" }}>
                            By creating a workspace, you agree to our{" "}
                            <a href="#" style={{ color: "#818CF8" }}>Terms</a> and{" "}
                            <a href="#" style={{ color: "#818CF8" }}>Privacy Policy</a>.
                        </p>
                    </form>
                </div>

                <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginTop: 20 }}>
                    Already have a workspace?{" "}
                    <Link href="/auth/login" style={{ color: "#818CF8", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
