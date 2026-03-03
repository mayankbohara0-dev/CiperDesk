"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Sparkles,
    Lock,
    Brain,
    ListChecks,
    FileText,
    Mail,
    ChevronRight,
    RefreshCw,
    Clock,
    Zap,
    Shield,
    Star,
    MessageSquare,
    CheckSquare,
    TrendingUp,
} from "lucide-react";

const DECISIONS = [
    "Team agreed to use Argon2id over bcrypt for all password operations.",
    "Key rotation will be triggered automatically when any member is removed.",
    "File vault will split files into 512KB chunks before encryption.",
    "AI runs only after client-side decryption — no raw logs server-side.",
];

const AUTO_TASKS = [
    { title: "Write migration script for Argon2id", priority: "High", from: "#engineering" },
    { title: "Document key rotation protocol", priority: "Medium", from: "#engineering" },
    { title: "Review WebSocket reconnection edge cases", priority: "High", from: "#builds" },
    { title: "Add E2E tests for file upload", priority: "Low", from: "#engineering" },
];

const CHAT_SUMMARY = `Over the past week, the team focused on:

**Security hardening** — Arjun finished the Argon2id password hashing implementation and opened a PR. Priya reviewed and approved with one requested change on the salt generation.

**Encryption architecture** — Major discussion around workspace key rotation. Consensus reached: rotation triggers on member removal, and all active device keys are re-encrypted synchronously before the operation completes.

**File vault** — Design spec finalized with 512KB chunk size, AES-256-GCM per chunk, file key wrapped with workspace key.

**Deploy pipeline** — Rahul identified and fixed the staging env variable issue that broke builds last week.`;

export default function AiPage() {
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(true);
    const [addedTasks, setAddedTasks] = useState<string[]>([]);

    const addTask = (title: string) => {
        setAddedTasks((prev) => [...prev, title]);
    };

    const regenerate = () => {
        setGenerating(true);
        setGenerated(false);
        setTimeout(() => {
            setGenerating(false);
            setGenerated(true);
        }, 1800);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-slate-100">AI Digest</h1>
                    <span className="badge-warning gap-1">
                        <Sparkles size={10} />
                        Pro Feature
                    </span>
                    <span className="encrypted-label">
                        <Lock size={10} />
                        Client-Decrypted Only
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock size={12} />
                        Last generated: Today, 8:00 AM
                    </span>
                    <button
                        onClick={regenerate}
                        disabled={generating}
                        className="btn-secondary gap-2 text-sm"
                    >
                        <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
                        {generating ? "Generating..." : "Regenerate"}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* How it works banner */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/5 border border-primary-500/20">
                    <Shield size={16} className="text-primary-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-slate-200 mb-0.5">Privacy-preserving AI</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Chat is decrypted <strong className="text-slate-300">locally on your device</strong> before AI processing.
                            Summaries are generated in-browser. No raw messages, no conversation logs, no AI training data sent to servers.
                        </p>
                    </div>
                </div>

                {generating && (
                    <div className="flex flex-col items-center py-16 gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            <Brain size={26} className="text-yellow-400 animate-pulse" />
                        </div>
                        <p className="text-sm text-slate-300 font-semibold">Decrypting and analyzing locally...</p>
                        <p className="text-xs text-slate-500 font-mono">Processing #general · #engineering · #builds</p>
                        <div className="w-48 h-1 bg-surface-border rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full w-2/3 animate-pulse" />
                        </div>
                    </div>
                )}

                {generated && !generating && (
                    <>
                        {/* Weekly summary */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                    <FileText size={17} className="text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-100">Weekly Summary</h2>
                                    <p className="text-xs text-slate-400">Feb 24 – Mar 3 · 4 channels · 127 messages</p>
                                </div>
                            </div>
                            <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                                {CHAT_SUMMARY.split("\n\n").map((para, i) => (
                                    <p key={i}
                                        dangerouslySetInnerHTML={{
                                            __html: para
                                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-200">$1</strong>')
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Key decisions */}
                            <div className="card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-accent-400/10 border border-accent-400/20 flex items-center justify-center">
                                        <TrendingUp size={17} className="text-accent-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-100">Key Decisions</h2>
                                        <p className="text-xs text-slate-400">Extracted from conversations</p>
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    {DECISIONS.map((d, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-accent-400/15 border border-accent-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-accent-400">{i + 1}</span>
                                            </div>
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Auto task suggestions */}
                            <div className="card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                                        <ListChecks size={17} className="text-primary-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-100">Suggested Tasks</h2>
                                        <p className="text-xs text-slate-400">AI found action items in chat</p>
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    {AUTO_TASKS.map((t) => {
                                        const added = addedTasks.includes(t.title);
                                        return (
                                            <li key={t.title} className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${added ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                                        {t.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`text-xs font-semibold ${t.priority === "High" ? "text-red-400" : t.priority === "Medium" ? "text-yellow-400" : "text-slate-500"}`}>
                                                            {t.priority}
                                                        </span>
                                                        <span className="text-xs text-slate-500">{t.from}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => addTask(t.title)}
                                                    disabled={added}
                                                    className={`text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-all ${added
                                                            ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                                                            : "btn-secondary py-1"
                                                        }`}
                                                >
                                                    {added ? "✓ Added" : "+ Add Task"}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        {/* Encrypted digest email */}
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                        <Mail size={17} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-100">Weekly Encrypted Digest</h2>
                                        <p className="text-xs text-slate-400">
                                            Send this summary as an <span className="font-mono text-accent-400">encrypted email</span> to your team
                                        </p>
                                    </div>
                                </div>
                                <button className="btn-primary gap-2 text-sm">
                                    <Mail size={14} />
                                    Send Digest
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
