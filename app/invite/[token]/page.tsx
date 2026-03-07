"use client";

import { use } from "react";
import Link from "next/link";
import { useState } from "react";
import {
    Shield,
    Lock,
    Check,
    Users,
    KeyRound,
    ArrowRight,
    Clock,
} from "lucide-react";

const WORKSPACE = {
    name: "BuildFast HQ",
    admin: "Arjun Mehta",
    members: 4,
    plan: "Pro",
};

type Step = "review" | "keypair" | "done";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const [step, setStep] = useState<Step>("review");
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleAccept = () => {
        setGenerating(true);
        setStep("keypair");
        let p = 0;
        const iv = setInterval(() => {
            p += 18;
            setProgress(Math.min(p, 100));
            if (p >= 100) {
                clearInterval(iv);
                setTimeout(() => {
                    setGenerating(false);
                    setStep("done");
                }, 600);
            }
        }, 200);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--cream)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter, sans-serif",
        }}>
            {/* Lime blob background */}
            <div style={{
                position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
                width: 500, height: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(170,239,69,.3) 0%, transparent 70%)",
                pointerEvents: "none", filter: "blur(80px)",
            }} />

            <div className="animate-in" style={{ position: "relative", width: "100%", maxWidth: 440 }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link href="/" style={{
                        display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none",
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12, background: "#0D0D0D",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Shield size={20} style={{ color: "#AAEF45" }} />
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0D0D0D", letterSpacing: "-.02em" }}>
                            CipherDesk
                        </span>
                    </Link>
                </div>

                {/* ── Step: Review ── */}
                {step === "review" && (
                    <>
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <h1 style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0D0D0D", letterSpacing: "-.03em", marginBottom: 8 }}>
                                You&apos;re invited!
                            </h1>
                            <p style={{ fontSize: 14, color: "#6B675E" }}>
                                You&apos;ve been invited to join an encrypted workspace.
                            </p>
                        </div>

                        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {/* Workspace info */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                                borderRadius: 14, background: "var(--cream)", border: "1.5px solid var(--grey-2)",
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14, background: "#0D0D0D",
                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <Shield size={22} style={{ color: "#AAEF45" }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0D0D0D" }}>{WORKSPACE.name}</p>
                                    <p style={{ fontSize: 12, color: "#A8A49C", marginTop: 2 }}>Invited by {WORKSPACE.admin}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6B675E" }}>
                                            <Users size={11} /> {WORKSPACE.members} members
                                        </span>
                                        <span className="badge-lime badge" style={{ fontSize: 10, padding: "2px 8px" }}>{WORKSPACE.plan}</span>
                                    </div>
                                </div>
                            </div>

                            {/* What happens */}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: "#A8A49C", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>
                                    What happens when you join
                                </p>
                                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {[
                                        { icon: KeyRound, text: "A new Ed25519/X25519 keypair is generated locally on your device", color: "#0D0D0D" },
                                        { icon: Lock, text: "The workspace key is encrypted with your public key and sent to you", color: "#0D0D0D" },
                                        { icon: Shield, text: "Your private key never leaves this device. The server cannot read your messages.", color: "#2E7D32" },
                                    ].map(({ icon: Icon, text, color }) => (
                                        <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                            <Icon size={14} style={{ color, flexShrink: 0, marginTop: 2 }} />
                                            <span style={{ fontSize: 13, color: "#6B675E", lineHeight: 1.5 }}>{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Token badge */}
                            <div style={{
                                padding: "8px 14px", borderRadius: 10,
                                background: "var(--cream)", border: "1.5px solid var(--grey-2)",
                                fontFamily: "monospace", fontSize: 12, color: "#A8A49C",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                                Token: <span style={{ color: "#0D0D0D", fontWeight: 700 }}>{token.slice(0, 8)}…{token.slice(-8)}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#A8A49C" }}>
                                <Clock size={11} style={{ color: "#F59E0B" }} />
                                Invite link expires in <span style={{ color: "#F59E0B", fontWeight: 700, marginLeft: 2 }}>47h 22m</span>
                            </div>

                            <div style={{ display: "flex", gap: 10 }}>
                                <Link href="/" className="btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 14 }}>
                                    Decline
                                </Link>
                                <button onClick={handleAccept} className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 14 }}>
                                    Accept Invite <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Step: Generating keypair ── */}
                {step === "keypair" && (
                    <div className="card" style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 18, background: "#F5F0E8",
                            border: "1.5px solid var(--grey-2)",
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                        }}>
                            <KeyRound size={26} style={{ color: "#0D0D0D", animation: "spin 1.5s linear infinite" }} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0D0D0D", marginBottom: 4 }}>
                                {progress < 40 ? "Generating your keypair…" : progress < 80 ? "Encrypting workspace key…" : "Distributing keys…"}
                            </h2>
                            <p style={{ fontSize: 12, color: "#A8A49C", fontFamily: "monospace" }}>{progress}% complete</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[
                                { label: "Generate Ed25519 signing key", done: progress >= 20 },
                                { label: "Generate X25519 key exchange key", done: progress >= 40 },
                                { label: "Receive encrypted workspace key", done: progress >= 65 },
                                { label: "Decrypt & store locally", done: progress >= 85 },
                                { label: "Sync complete", done: progress >= 100 },
                            ].map((s) => (
                                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        background: s.done ? "#AAEF45" : "var(--grey-2)",
                                        border: `1.5px solid ${s.done ? "#8ED630" : "var(--grey-3)"}`,
                                        transition: "all .3s",
                                    }}>
                                        {s.done && <Check size={10} style={{ color: "#0D0D0D" }} />}
                                    </div>
                                    <span style={{ fontSize: 12, fontFamily: "monospace", color: s.done ? "#0D0D0D" : "#A8A49C" }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                        {/* Progress bar */}
                        <div style={{ width: "100%", height: 6, borderRadius: 99, background: "var(--grey-2)", overflow: "hidden" }}>
                            <div style={{
                                height: "100%", background: "#AAEF45", borderRadius: 99,
                                width: `${progress}%`, transition: "width .3s ease",
                            }} />
                        </div>
                    </div>
                )}

                {/* ── Step: Done ── */}
                {step === "done" && (
                    <div className="card" style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 20, background: "#F0FDF4",
                            border: "1.5px solid #BBF7D0",
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                        }}>
                            <Check size={30} style={{ color: "#16A34A" }} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0D0D0D", marginBottom: 8 }}>
                                You&apos;re in! 🔐
                            </h2>
                            <p style={{ fontSize: 14, color: "#6B675E" }}>
                                Welcome to <span style={{ fontWeight: 700, color: "#0D0D0D" }}>{WORKSPACE.name}</span>. Your keys are set up and secure.
                            </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                            {[
                                "Keypair generated and stored locally",
                                "Workspace key decrypted and cached",
                                "E2E encryption active for all channels",
                            ].map((s) => (
                                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Check size={13} style={{ color: "#16A34A", flexShrink: 0 }} />
                                    <span style={{ fontSize: 13, color: "#6B675E" }}>{s}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/app/chat/general" className="btn-primary" style={{ justifyContent: "center" }}>
                            Open Workspace <ArrowRight size={15} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
