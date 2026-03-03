"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, Smartphone, Check, ChevronLeft } from "lucide-react";

type Step = "credentials" | "twofa";

export default function LoginPage() {
    const [step, setStep] = useState<Step>("credentials");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tfaCode, setTfaCode] = useState("");
    const [error, setError] = useState("");

    const handleCredentials = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) { setError("Please fill in all fields."); return; }
        setLoading(true);
        setTimeout(() => { setLoading(false); setStep("twofa"); }, 900);
    };

    const handleTfa = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (tfaCode.length !== 6) { setError("Please enter a 6-digit code."); return; }
        setLoading(true);
        setTimeout(() => { window.location.href = "/app/chat/general"; }, 1200);
    };

    const styles = {
        page: { minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" } as React.CSSProperties,
        glow: { width: 500, height: 500, background: "rgba(79,70,229,.07)", borderRadius: "50%", filter: "blur(80px)", position: "absolute" as const, top: "33%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" as const },
        logo: { width: 40, height: 40, borderRadius: 12, background: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(79,70,229,.4)" },
        step: (active: boolean, done: boolean) => ({ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: active ? "#4F46E5" : done ? "#22C55E" : "#263248", color: active || done ? "#fff" : "#64748B", flexShrink: 0 }),
        notice: { background: "rgba(34,211,238,.05)", border: "1px solid rgba(34,211,238,.15)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 },
        err: { background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "10px 14px", color: "#F87171", fontSize: 14, marginBottom: 16 },
        tfa: { width: 56, height: 56, borderRadius: 16, background: "rgba(79,70,229,.12)", border: "1px solid rgba(79,70,229,.22)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" },
    };

    return (
        <div style={styles.page} className="grid-pattern">
            <div style={styles.glow} />
            <div className="relative w-full animate-in" style={{ maxWidth: 440 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                        <div style={styles.logo}><Shield size={20} className="text-white" /></div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>Cipher<span className="text-gradient">Desk</span></span>
                    </Link>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#F1F5F9" }}>
                        {step === "credentials" ? "Welcome back" : "Two-Factor Auth"}
                    </h1>
                    <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 8 }}>
                        {step === "credentials" ? "Sign in to your encrypted workspace." : "Enter the 6-digit code from your authenticator app."}
                    </p>
                </div>

                <div className="card">
                    {/* Steps */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={styles.step(step === "credentials", step === "twofa")}>
                                {step === "twofa" ? <Check size={12} /> : "1"}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: step === "credentials" ? "#E2E8F0" : "#475569" }}>Credentials</span>
                        </div>
                        <div style={{ flex: 1, height: 1, background: step === "twofa" ? "#4F46E5" : "#334155" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={styles.step(step === "twofa", false)}>2</div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: step === "twofa" ? "#E2E8F0" : "#475569" }}>2FA</span>
                        </div>
                    </div>

                    {error && <div style={styles.err}>{error}</div>}

                    {step === "credentials" ? (
                        <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#CBD5E1", marginBottom: 8 }}>Work Email</label>
                                <input id="email" type="email" className="input-field" placeholder="you@company.com"
                                    value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <label style={{ fontSize: 14, fontWeight: 500, color: "#CBD5E1" }}>Password</label>
                                    <a href="#" style={{ fontSize: 12, color: "#818CF8", textDecoration: "none" }}>Forgot password?</a>
                                </div>
                                <div style={{ position: "relative" }}>
                                    <input id="password" type={showPw ? "text" : "password"} className="input-field" style={{ paddingRight: 44 }}
                                        placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                                    <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password"
                                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
                                        {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <p style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>
                                        Hashed with <span style={{ fontFamily: "monospace", color: "#22D3EE" }}>Argon2id</span> before leaving your browser.
                                    </p>
                                )}
                            </div>
                            <button type="submit" className="btn-primary justify-center py-3 w-full" disabled={loading}>
                                {loading
                                    ? <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} /> Verifying…</>
                                    : <>Continue <ArrowRight size={16} /></>}
                            </button>
                            <div style={styles.notice}>
                                <Lock size={13} style={{ color: "#22D3EE", flexShrink: 0, marginTop: 1 }} />
                                <p style={{ fontSize: 12, color: "#94A3B8" }}>
                                    Your password is hashed with <span style={{ fontFamily: "monospace", color: "#22D3EE" }}>Argon2id</span> before leaving your browser. We never store plaintext credentials.
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleTfa} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={styles.tfa}><Smartphone size={26} style={{ color: "#818CF8" }} /></div>
                            <div>
                                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#CBD5E1", marginBottom: 10, textAlign: "center" }}>
                                    Enter 6-digit verification code
                                </label>
                                <input id="two-factor-code" type="text" className="input-field" style={{ textAlign: "center", fontSize: 24, fontFamily: "monospace", letterSpacing: "0.5em" }}
                                    placeholder="000000" maxLength={6} pattern="[0-9]*" inputMode="numeric"
                                    value={tfaCode} onChange={e => setTfaCode(e.target.value.replace(/\D/g, ""))} autoFocus />
                            </div>
                            <button type="submit" className="btn-primary justify-center py-3 w-full" disabled={loading}>
                                {loading
                                    ? <><span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} /> Signing you in…</>
                                    : <>Verify &amp; Sign In <Lock size={16} /></>}
                            </button>
                            <button type="button" onClick={() => setStep("credentials")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                <ChevronLeft size={13} /> Back to login
                            </button>
                        </form>
                    )}
                </div>

                <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginTop: 20 }}>
                    No account yet?{" "}
                    <Link href="/auth/register" style={{ color: "#818CF8", fontWeight: 500, textDecoration: "none" }}>
                        Create workspace
                    </Link>
                </p>
            </div>
        </div>
    );
}
