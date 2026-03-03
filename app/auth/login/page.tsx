"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, ArrowRight, Smartphone } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!showTwoFactor) {
            setShowTwoFactor(true);
        } else {
            window.location.href = "/app/chat/general";
        }
    };

    return (
        <div className="min-h-screen bg-dark grid-pattern flex items-center justify-center px-6 py-12">
            {/* Background glow */}
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
                    <h1 className="text-2xl font-bold text-slate-100">
                        {showTwoFactor ? "Two-Factor Authentication" : "Welcome back"}
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        {showTwoFactor
                            ? "Enter the 6-digit code from your authenticator app."
                            : "Sign in to your encrypted workspace."}
                    </p>
                </div>

                <div className="card">
                    {!showTwoFactor ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Work Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-slate-300">Password</label>
                                    <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="input-field pr-11"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full justify-center py-3">
                                Continue
                                <ArrowRight size={16} />
                            </button>

                            {/* Encryption notice */}
                            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-accent-400/5 border border-accent-400/15">
                                <Lock size={14} className="text-accent-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-400">
                                    Your password is hashed with <span className="font-mono text-accent-400">Argon2id</span> before
                                    leaving your browser. We never store plaintext credentials.
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex justify-center mb-2">
                                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                                    <Smartphone size={26} className="text-primary-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
                                    6-digit verification code
                                </label>
                                <input
                                    id="two-factor-code"
                                    type="text"
                                    className="input-field text-center text-xl font-mono tracking-[0.5em] letter-spacing-4"
                                    placeholder="000000"
                                    maxLength={6}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    autoFocus
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full justify-center py-3">
                                Verify & Sign In
                                <Lock size={16} />
                            </button>

                            <button
                                type="button"
                                className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors text-center"
                                onClick={() => setShowTwoFactor(false)}
                            >
                                ← Back to login
                            </button>
                        </form>
                    )}
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    No account yet?{" "}
                    <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        Create workspace
                    </Link>
                </p>
            </div>
        </div>
    );
}
