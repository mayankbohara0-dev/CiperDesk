"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, Smartphone, Check, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Step = "credentials" | "twofa";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("credentials");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tfaCode, setTfaCode] = useState("");
    const [error, setError] = useState("");

    const handleCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) { setError("Please fill in all fields."); return; }
        setLoading(true);
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (err) { setError(err.message); return; }
        // Skip 2FA step for now and go straight to app
        router.push("/app/chat/general");
        router.refresh();
    };

    const handleTfa = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (tfaCode.length !== 6) { setError("Please enter a 6-digit code."); return; }
        setLoading(true);
        setTimeout(() => { router.push("/app/chat/general"); }, 800);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex" }}>

            {/* Left panel — form */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
                <div className="animate-in" style={{ width: "100%", maxWidth: 420 }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 40, textDecoration: "none" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Shield size={17} style={{ color: "#AAEF45" }} />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D", letterSpacing: "-.02em" }}>CipherDesk</span>
                    </Link>

                    <h1 style={{ fontSize: 30, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D", letterSpacing: "-.03em", marginBottom: 8 }}>
                        {step === "credentials" ? "Welcome back" : "Two-factor auth"}
                    </h1>
                    <p style={{ fontSize: 15, color: "#6B675E", marginBottom: 32 }}>
                        {step === "credentials" ? "Sign in to your encrypted workspace." : "Enter the 6-digit code from your authenticator app."}
                    </p>

                    {/* Step indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: step === "twofa" ? "#AAEF45" : "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: step === "twofa" ? "#0D0D0D" : "#fff" }}>
                                {step === "twofa" ? <Check size={12} /> : "1"}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: step === "credentials" ? "#0D0D0D" : "#A8A49C" }}>Credentials</span>
                        </div>
                        <div style={{ flex: 1, height: 1.5, background: step === "twofa" ? "#0D0D0D" : "var(--grey-3)" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: step === "twofa" ? "#0D0D0D" : "var(--grey-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: step === "twofa" ? "#fff" : "#A8A49C" }}>2</div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: step === "twofa" ? "#0D0D0D" : "#A8A49C" }}>2FA</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", color: "#991B1B", fontSize: 14, marginBottom: 16 }}>
                            {error}
                        </div>
                    )}

                    {step === "credentials" ? (
                        <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#2D2D2D", marginBottom: 8 }}>Work Email</label>
                                <input id="email" type="email" className="input-field" placeholder="you@company.com"
                                    value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <label style={{ fontSize: 14, fontWeight: 600, color: "#2D2D2D" }}>Password</label>
                                    <a href="#" style={{ fontSize: 13, color: "#6B675E", textDecoration: "none" }}>Forgot password?</a>
                                </div>
                                <div style={{ position: "relative" }}>
                                    <input id="password" type={showPw ? "text" : "password"} className="input-field" style={{ paddingRight: 44 }}
                                        placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                                    <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password"
                                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#A8A49C" }}>
                                        {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "13px 24px", fontSize: 15, marginTop: 4 }} disabled={loading}>
                                {loading
                                    ? <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(13,13,13,.2)", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite", display: "inline-block" }} /> Signing in…</>
                                    : <>Continue <ArrowRight size={16} /></>}
                            </button>

                            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                                <Lock size={13} style={{ color: "#166534", flexShrink: 0, marginTop: 1 }} />
                                <p style={{ fontSize: 12, color: "#166534" }}>
                                    Your password is verified with <span style={{ fontFamily: "monospace", fontWeight: 700 }}>Supabase Auth</span>. Session is managed securely via HTTP-only cookies.
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleTfa} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ width: 60, height: 60, borderRadius: 18, background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                                <Smartphone size={26} style={{ color: "#0D0D0D" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#2D2D2D", marginBottom: 10, textAlign: "center" }}>
                                    Enter 6-digit verification code
                                </label>
                                <input id="two-factor-code" type="text" className="input-field" style={{ textAlign: "center", fontSize: 28, fontFamily: "monospace", letterSpacing: "0.5em", fontWeight: 700 }}
                                    placeholder="000000" maxLength={6} pattern="[0-9]*" inputMode="numeric"
                                    value={tfaCode} onChange={e => setTfaCode(e.target.value.replace(/\D/g, ""))} autoFocus />
                            </div>
                            <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "13px 24px", fontSize: 15 }} disabled={loading}>
                                {loading
                                    ? <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(13,13,13,.2)", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite", display: "inline-block" }} /> Signing you in…</>
                                    : <>Verify &amp; Sign In <Lock size={16} /></>}
                            </button>
                            <button type="button" onClick={() => setStep("credentials")} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B675E", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                <ChevronLeft size={14} /> Back to login
                            </button>
                        </form>
                    )}

                    <p style={{ textAlign: "center", fontSize: 14, color: "#A8A49C", marginTop: 28 }}>
                        No account yet?{" "}
                        <Link href="/auth/register" style={{ color: "#0D0D0D", fontWeight: 700, textDecoration: "none" }}>
                            Create workspace
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right panel — decorative */}
            <div style={{ width: 480, flexShrink: 0, background: "#0D0D0D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(170,239,69,.25) 0%, transparent 70%)", filter: "blur(40px)" }} />
                <div style={{ position: "relative", textAlign: "center" }}>
                    <div style={{ width: 80, height: 80, borderRadius: 24, background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }} className="animate-float">
                        <Shield size={36} style={{ color: "#0D0D0D" }} />
                    </div>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff", letterSpacing: "-.03em", marginBottom: 16, lineHeight: 1.1 }}>
                        Zero-knowledge.<br />Zero-trust. Zero-compromise.
                    </h2>
                    <p style={{ fontSize: 14, color: "#4A4740", lineHeight: 1.7, marginBottom: 36 }}>
                        Your workspace data is encrypted on your device before it ever reaches our servers. We literally cannot read your messages.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                        {["AES-256-GCM", "X25519", "Ed25519", "Argon2id", "HKDF"].map(s => (
                            <span key={s} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontFamily: "monospace", color: "#A8A49C" }}>{s}</span>
                        ))}
                    </div>
                    <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                        <div style={{ display: "flex", gap: 3 }}>
                            {Array(5).fill(0).map((_, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 16 }}>★</span>)}
                        </div>
                        <span style={{ fontSize: 13, color: "#4A4740" }}>4.9/5 from 1,200+ teams</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
