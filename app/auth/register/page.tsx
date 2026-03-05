"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CryptoManager } from "@/lib/crypto";
import { useRouter } from "next/navigation";

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
const STRENGTH_COLORS = ["", "#E53935", "#F57C00", "#F59E0B", "#2E7D32", "#1B5E20"];
const STRENGTH_BG = ["", "#FFEBEE", "#FFF3E0", "#FFFDE7", "#E8F5E9", "#E8F5E9"];

export default function RegisterPage() {
    const router = useRouter();
    const [workspace, setWorkspace] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const score = strengthScore(password);
    const wsSlug = workspace.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!workspace || !name || !email || !password) { setError("Please fill in all fields."); return; }
        if (score < 2) { setError("Password is too weak. Add uppercase, numbers, or symbols."); return; }
        setLoading(true);
        // Gen real key
        await CryptoManager.getOrGenerateLocalKey();

        const { error: err } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name, workspace_name: workspace },
            },
        });
        setLoading(false);
        if (err) { setError(err.message); return; }
        router.push("/app/chat/general");
        router.refresh();
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex" }}>

            {/* Left dark panel */}
            <div style={{
                width: 420, flexShrink: 0, background: "#0D0D0D",
                display: "flex", flexDirection: "column", padding: 48,
                position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", bottom: "10%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,239,69,.2) 0%, transparent 70%)", filter: "blur(40px)" }} />

                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: "auto" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Shield size={16} style={{ color: "#0D0D0D" }} />
                    </div>
                    <span style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff", letterSpacing: "-.02em" }}>CipherDesk</span>
                </Link>

                <div style={{ position: "relative" }}>
                    <h2 style={{ fontSize: "1.9rem", fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff", letterSpacing: "-.03em", marginBottom: 20, lineHeight: 1.1 }}>
                        Keys generated locally.<br />Server sees nothing.
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                            { icon: Lock, text: "Ed25519 signing keypair generated in your browser" },
                            { icon: Shield, text: "X25519 key exchange keypair for encrypted sessions" },
                            { icon: Check, text: "Private keys never leave your device — ever" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(170,239,69,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Icon size={13} style={{ color: "#AAEF45" }} />
                                </div>
                                <span style={{ fontSize: 13, color: "#4A4740", lineHeight: 1.5, marginTop: 5 }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", overflowY: "auto" }}>
                <div className="animate-in" style={{ width: "100%", maxWidth: 440 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D", letterSpacing: "-.03em", marginBottom: 8 }}>
                        Create your workspace
                    </h1>
                    <p style={{ fontSize: 15, color: "#6B675E", marginBottom: 32 }}>
                        Set up your encrypted team workspace in seconds.
                    </p>

                    {error && (
                        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", color: "#991B1B", fontSize: 14, marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>Workspace Name</label>
                            <input id="workspace" type="text" className="input-field" placeholder="Acme Inc."
                                value={workspace} onChange={e => setWorkspace(e.target.value)} required autoFocus />
                            {wsSlug && (
                                <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 6 }}>
                                    URL: <span style={{ fontFamily: "monospace", color: "#0D0D0D", fontWeight: 600 }}>app.cipherdesk.io/{wsSlug}</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>Full Name</label>
                            <input id="fullname" type="text" className="input-field" placeholder="Jane Doe"
                                value={name} onChange={e => setName(e.target.value)} required />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>Work Email</label>
                            <input id="email" type="email" className="input-field" placeholder="you@company.com"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <input id="password" type={showPw ? "text" : "password"} className="input-field" style={{ paddingRight: 44 }}
                                    placeholder="Min 12 characters" value={password} onChange={e => setPassword(e.target.value)} required />
                                <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password"
                                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#A8A49C" }}>
                                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div style={{ marginTop: 10 }}>
                                    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= score ? STRENGTH_COLORS[score] : "var(--grey-2)", transition: "all .3s" }} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 12, color: STRENGTH_COLORS[score] || "#A8A49C", fontWeight: 600 }}>
                                        {STRENGTH_LABELS[score] || "Enter a password"}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "13px 24px", fontSize: 15, marginTop: 4 }} disabled={loading}>
                            {loading ? (
                                <>
                                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(13,13,13,.2)", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite", display: "inline-block" }} />
                                    Generating your keys…
                                </>
                            ) : <>Create Workspace <ArrowRight size={17} /></>}
                        </button>

                        <p style={{ fontSize: 12, color: "#A8A49C", textAlign: "center" }}>
                            By continuing, you agree to our{" "}
                            <a href="#" style={{ color: "#0D0D0D", fontWeight: 600, textDecoration: "none" }}>Terms</a> and{" "}
                            <a href="#" style={{ color: "#0D0D0D", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>.
                        </p>
                    </form>

                    <p style={{ textAlign: "center", fontSize: 14, color: "#A8A49C", marginTop: 24 }}>
                        Already have a workspace?{" "}
                        <Link href="/auth/login" style={{ color: "#0D0D0D", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
