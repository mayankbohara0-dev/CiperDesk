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
    Building2,
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
        <div className="min-h-screen bg-dark grid-pattern flex items-center justify-center px-6 py-12">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md animate-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-primary">
                            <Shield size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-100">
                            Cipher<span className="text-gradient">Desk</span>
                        </span>
                    </Link>
                </div>

                {step === "review" && (
                    <>
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-slate-100">You&apos;re invited!</h1>
                            <p className="text-sm text-slate-400 mt-2">
                                You&apos;ve been invited to join an encrypted workspace.
                            </p>
                        </div>

                        <div className="card space-y-5">
                            {/* Workspace info */}
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-dark border border-surface-border">
                                <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-primary">
                                    <Shield size={22} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-100">{WORKSPACE.name}</p>
                                    <p className="text-xs text-slate-400">Invited by {WORKSPACE.admin}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <Users size={11} />
                                            {WORKSPACE.members} members
                                        </span>
                                        <span className="badge-primary text-xs py-0.5">{WORKSPACE.plan}</span>
                                    </div>
                                </div>
                            </div>

                            {/* What happens */}
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">What happens when you join</p>
                                <ul className="space-y-3">
                                    {[
                                        { icon: KeyRound, text: "A new Ed25519/X25519 keypair is generated locally on your device", color: "text-accent-400" },
                                        { icon: Lock, text: "The workspace key is encrypted with your public key and sent to you", color: "text-primary-400" },
                                        { icon: Shield, text: "Your private key never leaves this device. The server cannot read your messages.", color: "text-green-400" },
                                    ].map(({ icon: Icon, text, color }) => (
                                        <li key={text} className="flex items-start gap-2.5">
                                            <Icon size={14} className={`${color} flex-shrink-0 mt-0.5`} />
                                            <span className="text-xs text-slate-400 leading-relaxed">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Invite token */}
                            <div className="px-3 py-2 rounded-lg bg-dark border border-surface-border font-mono text-xs text-slate-500 truncate">
                                Invite token: <span className="text-accent-400">{token.slice(0, 8)}…{token.slice(-8)}</span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock size={11} className="text-yellow-400" />
                                Invite link expires in <span className="text-yellow-400 font-semibold ml-1">47h 22m</span>
                            </div>

                            <div className="flex gap-3">
                                <Link href="/" className="btn-secondary flex-1 justify-center text-sm">
                                    Decline
                                </Link>
                                <button onClick={handleAccept} className="btn-primary flex-1 justify-center text-sm">
                                    Accept Invite
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {step === "keypair" && (
                    <div className="card text-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto">
                            <KeyRound size={26} className="text-primary-400 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-100 mb-1">
                                {progress < 40 ? "Generating your keypair…" : progress < 80 ? "Encrypting workspace key…" : "Distributing keys…"}
                            </h2>
                            <p className="text-xs text-slate-400 font-mono">{progress}% complete</p>
                        </div>
                        <div className="space-y-2.5">
                            {[
                                { label: "Generate Ed25519 signing key", done: progress >= 20 },
                                { label: "Generate X25519 key exchange key", done: progress >= 40 },
                                { label: "Receive encrypted workspace key", done: progress >= 65 },
                                { label: "Decrypt & store locally", done: progress >= 85 },
                                { label: "Sync complete", done: progress >= 100 },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-2.5 text-left">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${s.done ? "bg-green-500" : "bg-surface-raised border border-surface-border"}`}>
                                        {s.done && <Check size={10} className="text-white" />}
                                    </div>
                                    <span className={`text-xs font-mono ${s.done ? "text-slate-300" : "text-slate-500"}`}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {step === "done" && (
                    <div className="card text-center space-y-5">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                            <Check size={30} className="text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 mb-1">You&apos;re in! 🔐</h2>
                            <p className="text-sm text-slate-400">
                                Welcome to <span className="text-slate-200 font-semibold">{WORKSPACE.name}</span>. Your keys are set up and secure.
                            </p>
                        </div>
                        <div className="space-y-2 text-left">
                            {[
                                "Keypair generated and stored locally",
                                "Workspace key decrypted and cached",
                                "E2E encryption active for all channels",
                            ].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <Check size={13} className="text-green-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-400">{s}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/app/chat/general" className="btn-primary w-full justify-center">
                            Open Workspace
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
