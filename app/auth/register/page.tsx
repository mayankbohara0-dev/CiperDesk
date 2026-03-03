"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, Check, Building2 } from "lucide-react";

const STRENGTH_LEVELS = [
    { label: "Weak", color: "bg-danger" },
    { label: "Fair", color: "bg-yellow-400" },
    { label: "Good", color: "bg-blue-400" },
    { label: "Strong", color: "bg-green-400" },
];

function getPasswordStrength(pw: string): number {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
}

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [workspaceName, setWorkspaceName] = useState("");

    const strength = getPasswordStrength(password);
    const strengthInfo = STRENGTH_LEVELS[Math.max(0, strength - 1)];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = "/app/chat/general";
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
                    <h1 className="text-2xl font-bold text-slate-100">Create your workspace</h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Free for up to 5 members. No credit card required.
                    </p>
                </div>

                <div className="card space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Workspace name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Workspace Name
                            </label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="workspace-name"
                                    type="text"
                                    className="input-field pl-10"
                                    placeholder="Acme, Inc."
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            {workspaceName && (
                                <p className="text-xs text-slate-500 mt-1">
                                    Workspace URL: <span className="font-mono text-accent-400">app.cipherdesk.io/{workspaceName.toLowerCase().replace(/\s+/g, "-")}</span>
                                </p>
                            )}
                        </div>

                        {/* Full name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Your Full Name
                            </label>
                            <input
                                id="full-name"
                                type="text"
                                className="input-field"
                                placeholder="Arjun Mehta"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Work Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                placeholder="you@company.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="input-field pr-11"
                                    placeholder="Min 12 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {/* Password strength */}
                            {password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthInfo.color : "bg-surface-border"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Strength:{" "}
                                        <span className="font-medium text-slate-300">{strengthInfo?.label ?? "Too short"}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn-primary w-full justify-center py-3">
                            Create Workspace
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* What happens next */}
                    <div className="border-t border-surface-border pt-5 space-y-2.5">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What happens next</p>
                        {[
                            "Keypair generated locally on your device",
                            "Workspace encryption key created client-side",
                            "Invite your team via secure email link",
                        ].map((step) => (
                            <div key={step} className="flex items-start gap-2">
                                <Check size={14} className="text-accent-400 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-slate-400">{step}</span>
                            </div>
                        ))}
                    </div>

                    {/* Security badge */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-400/5 border border-accent-400/15">
                        <Lock size={14} className="text-accent-400 flex-shrink-0" />
                        <p className="text-xs text-slate-400">
                            Your keys never leave your device. Password hashed with{" "}
                            <span className="font-mono text-accent-400">Argon2id</span>.
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have a workspace?{" "}
                    <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
