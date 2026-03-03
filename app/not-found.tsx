"use client";

import Link from "next/link";
import { Shield, Home, ArrowLeft, Lock } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-dark grid-pattern flex items-center justify-center px-6">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center space-y-6 animate-in">
                {/* Big 404 */}
                <div className="relative inline-block">
                    <div className="text-[9rem] font-black text-surface-raised leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                            <Lock size={36} className="text-primary-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-100">Page not found</h1>
                    <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
                        This page is either encrypted beyond reach, or it simply doesn&apos;t exist.
                        Either way, you&apos;re in the clear.
                    </p>
                </div>

                {/* Encryption flavor text */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-DEFAULT border border-surface-border text-xs font-mono text-slate-500">
                    <Lock size={11} className="text-accent-400" />
                    <span>Error: <span className="text-accent-400">0x404</span> — Plaintext not found</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                    <Link href="/" className="btn-primary gap-2">
                        <Home size={15} />
                        Back to Home
                    </Link>
                    <Link href="/app/chat/general" className="btn-secondary gap-2">
                        <Shield size={15} />
                        Open App
                    </Link>
                </div>
            </div>
        </div>
    );
}
