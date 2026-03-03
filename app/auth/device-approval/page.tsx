"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Shield,
    Monitor,
    Laptop,
    Smartphone,
    Globe,
    Lock,
    AlertTriangle,
    Check,
    ChevronRight,
    Clock,
    MapPin,
    ArrowRight,
} from "lucide-react";

type DeviceRequest = {
    id: string;
    name: string;
    icon: React.ElementType;
    os: string;
    browser: string;
    location: string;
    ip: string;
    time: string;
};

const PENDING_DEVICE: DeviceRequest = {
    id: "new-1",
    name: "Windows PC",
    icon: Monitor,
    os: "Windows 11",
    browser: "Chrome 122",
    location: "Bengaluru, India",
    ip: "103.xx.xx.42",
    time: "Just now",
};

type Status = "pending" | "approved" | "rejected";

export default function DeviceApprovalPage() {
    const [status, setStatus] = useState<Status>("pending");

    return (
        <div className="min-h-screen bg-dark grid-pattern flex items-center justify-center px-6 py-12">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md animate-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-primary">
                            <Shield size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-100">
                            Cipher<span className="text-gradient">Desk</span>
                        </span>
                    </Link>
                </div>

                {status === "pending" && (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={26} className="text-yellow-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-100">New Device Login</h1>
                            <p className="text-sm text-slate-400 mt-2">
                                Someone is trying to sign into your CipherDesk account from a new device.
                            </p>
                        </div>

                        <div className="card space-y-5">
                            {/* Device details */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-dark border border-surface-border">
                                <div className="w-12 h-12 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-center flex-shrink-0">
                                    <PENDING_DEVICE.icon size={22} className="text-slate-400" />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-base font-bold text-slate-100">{PENDING_DEVICE.name}</p>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                            <Globe size={11} className="text-slate-500" />
                                            {PENDING_DEVICE.os} · {PENDING_DEVICE.browser}
                                        </p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                            <MapPin size={11} className="text-slate-500" />
                                            {PENDING_DEVICE.location} · IP: {PENDING_DEVICE.ip}
                                        </p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                            <Clock size={11} className="text-slate-500" />
                                            {PENDING_DEVICE.time}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security note */}
                            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                                <Lock size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Approving this device will distribute a copy of your{" "}
                                    <span className="font-mono text-yellow-400">workspace encryption key</span> encrypted to this device&apos;s public key.
                                    Only approve devices you own.
                                </p>
                            </div>

                            {/* What happens details */}
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">If you approve</p>
                                <ul className="space-y-2">
                                    {[
                                        "Device keypair is verified via challenge-response",
                                        "Workspace key encrypted and sent to new device",
                                        "Device added to your trusted device list",
                                        "You can revoke access anytime from Settings",
                                    ].map((s) => (
                                        <li key={s} className="flex items-center gap-2 text-xs text-slate-400">
                                            <Check size={12} className="text-green-400 flex-shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStatus("rejected")}
                                    className="btn-danger flex-1 justify-center"
                                >
                                    Reject & Block
                                </button>
                                <button
                                    onClick={() => setStatus("approved")}
                                    className="btn-primary flex-1 justify-center"
                                >
                                    Approve Device
                                    <ChevronRight size={15} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 text-center">
                                Not you?{" "}
                                <Link href="/app/settings" className="text-danger hover:text-red-300 transition-colors">
                                    Secure your account immediately
                                </Link>
                            </p>
                        </div>
                    </>
                )}

                {status === "approved" && (
                    <div className="card text-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                            <Check size={28} className="text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">Device Approved</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                The new device can now access your encrypted workspace.
                            </p>
                        </div>
                        <div className="text-left space-y-2">
                            {[
                                "Workspace key distributed to new device",
                                "Device added to your trusted list",
                                "Audit log entry created",
                            ].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <Check size={13} className="text-green-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-400">{s}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/app/settings" className="btn-secondary w-full justify-center">
                            Manage Devices
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                )}

                {status === "rejected" && (
                    <div className="card text-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto">
                            <AlertTriangle size={28} className="text-danger" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">Device Blocked</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                This device has been rejected and flagged. No keys were distributed.
                            </p>
                        </div>
                        <div className="text-left space-y-2">
                            {[
                                "Login attempt rejected",
                                "Device fingerprint flagged",
                                "Account remains secure — all active sessions intact",
                                "Consider changing your password if this was unexpected",
                            ].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <Check size={13} className="text-accent-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-400">{s}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <Link href="/app/settings" className="btn-secondary flex-1 justify-center text-sm">
                                Manage Security
                            </Link>
                            <Link href="/app/chat/general" className="btn-primary flex-1 justify-center text-sm">
                                Back to App
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
