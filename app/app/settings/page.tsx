"use client";

import { useState } from "react";
import {
    Shield,
    Lock,
    User,
    Building2,
    Smartphone,
    Key,
    Trash2,
    LogOut,
    AlertTriangle,
    Check,
    ChevronRight,
    Monitor,
    Laptop,
    Globe,
    Clock,
    Bell,
    Eye,
    EyeOff,
    RotateCcw,
    Flame,
    Timer,
    Sparkles,
} from "lucide-react";

type Tab = "profile" | "workspace" | "security" | "billing";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "workspace", label: "Workspace", icon: Building2 },
    { id: "security", label: "Security & Devices", icon: Shield },
    { id: "billing", label: "Billing", icon: Sparkles },
];

const DEVICES = [
    {
        id: "1",
        name: "MacBook Pro 16\"",
        icon: Laptop,
        os: "macOS 14.3",
        location: "Mumbai, India",
        lastActive: "Active now",
        isCurrent: true,
        browser: "Chrome 122",
    },
    {
        id: "2",
        name: "Windows PC",
        icon: Monitor,
        os: "Windows 11",
        location: "Pune, India",
        lastActive: "2 hours ago",
        isCurrent: false,
        browser: "Edge 121",
    },
    {
        id: "3",
        name: "iPhone 15 Pro",
        icon: Smartphone,
        os: "iOS 17.3",
        location: "Mumbai, India",
        lastActive: "Yesterday, 9:30 PM",
        isCurrent: false,
        browser: "Safari",
    },
];

function ProfileTab() {
    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Profile Settings</h2>
                <div className="card space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                            Y
                        </div>
                        <div>
                            <button className="btn-secondary text-sm py-1.5">Change Avatar</button>
                            <p className="text-xs text-slate-500 mt-1.5">Avatars are stored locally. Not synced to server.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input className="input-field" defaultValue="You (Admin)" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                            <input className="input-field" defaultValue="you" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input className="input-field" defaultValue="you@buildfast.io" type="email" />
                        </div>
                    </div>

                    <button className="btn-primary">Save Changes</button>
                </div>
            </div>

            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Change Password</h2>
                <div className="card space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                        <input className="input-field" type="password" placeholder="••••••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                        <input className="input-field" type="password" placeholder="Min 12 characters" />
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-400/5 border border-accent-400/15">
                        <Lock size={13} className="text-accent-400" />
                        <p className="text-xs text-slate-400">Hashed with <span className="font-mono text-accent-400">Argon2id</span> before changing. Keys re-derived locally.</p>
                    </div>
                    <button className="btn-secondary">Update Password</button>
                </div>
            </div>
        </div>
    );
}

function WorkspaceTab() {
    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Workspace Settings</h2>
                <div className="card space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Workspace Name</label>
                        <input className="input-field" defaultValue="BuildFast HQ" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Workspace URL</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 font-mono">app.cipherdesk.io/</span>
                            <input className="input-field flex-1" defaultValue="buildfast-hq" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Member Limit</label>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark border border-surface-border">
                            <div className="flex -space-x-1.5">
                                {["AM", "PS", "RN", "Y"].map((av, i) => (
                                    <div key={av} className={`w-6 h-6 rounded-full border border-dark text-[9px] font-bold text-white flex items-center justify-center ${["bg-primary-500", "bg-violet-500", "bg-green-600", "bg-accent-500"][i]}`}>
                                        {av[0]}
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm text-slate-300">4 / 5 members</span>
                            <span className="badge-ghost ml-auto">Free Plan</span>
                        </div>
                    </div>
                    <button className="btn-primary">Save Changes</button>
                </div>
            </div>

            {/* Invites */}
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Invite Members</h2>
                <div className="card space-y-4">
                    <div className="flex gap-3">
                        <input className="input-field flex-1" placeholder="teammate@company.com" type="email" />
                        <select className="input-field w-32">
                            <option>Member</option>
                            <option>Admin</option>
                        </select>
                    </div>
                    <button className="btn-primary gap-2">
                        <Lock size={14} />
                        Send Secure Invite
                    </button>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Shield size={11} className="text-accent-400" />
                        Invite links are cryptographically signed. Expire after 48 hours.
                    </p>
                </div>
            </div>

            {/* Danger zone */}
            <div>
                <h2 className="text-base font-bold text-danger mb-4">Danger Zone</h2>
                <div className="card border-danger/20 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-200">Delete Workspace</p>
                            <p className="text-xs text-slate-400 mt-1">Permanently delete workspace and all encrypted data. Irreversible.</p>
                        </div>
                        <button className="btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecurityTab() {
    const [burnConfirm, setBurnConfirm] = useState(false);

    return (
        <div className="space-y-6 max-w-2xl">
            {/* 2FA */}
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Two-Factor Authentication</h2>
                <div className="card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <Check size={18} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-200">2FA Enabled</p>
                            <p className="text-xs text-slate-400">Using Authenticator App (TOTP)</p>
                        </div>
                    </div>
                    <button className="btn-secondary text-sm">Reconfigure</button>
                </div>
            </div>

            {/* Key rotation */}
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Workspace Key Management</h2>
                <div className="card space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                            <Key size={18} className="text-primary-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-200 mb-1">Workspace Encryption Key</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                256-bit AES key generated client-side. Distributed encrypted to each member via their public key.
                            </p>
                            <div className="flex items-center gap-2 mt-2 font-mono text-xs text-slate-500">
                                Last rotated: <span className="text-slate-300">Feb 25, 2026 · 10:00 AM</span>
                            </div>
                        </div>
                    </div>
                    <button className="btn-secondary gap-2">
                        <RotateCcw size={14} />
                        Rotate Workspace Key
                    </button>
                    <p className="text-xs text-slate-500">
                        Key rotation re-encrypts access for all current members. Removed members lose access permanently.
                    </p>
                </div>
            </div>

            {/* Burn mode */}
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Flame size={16} className="text-danger" />
                    Burn Mode
                </h2>
                <div className="card border-danger/20 space-y-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-danger flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-slate-200">Destroy Thread Encryption Key</p>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                Permanently destroys the encryption key for a selected thread. Messages become permanently unreadable.
                                This action is <span className="text-danger font-semibold">irreversible</span>.
                            </p>
                        </div>
                    </div>
                    <button className="btn-danger gap-2" onClick={() => setBurnConfirm(!burnConfirm)}>
                        <Flame size={14} />
                        Initiate Burn Mode
                    </button>
                </div>
            </div>

            {/* Auto-delete */}
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Timer size={16} className="text-slate-400" />
                    Auto-Delete Policy
                </h2>
                <div className="card space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-200">Message TTL</p>
                            <p className="text-xs text-slate-400 mt-1">Automatically delete messages after a set period.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select className="input-field py-1.5 text-sm w-36">
                                <option>Never</option>
                                <option>7 days</option>
                                <option>30 days</option>
                                <option>90 days</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn-secondary text-sm">Save Policy</button>
                </div>
            </div>

            {/* Devices */}
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Active Devices</h2>
                <div className="space-y-3">
                    {DEVICES.map((device) => (
                        <div key={device.id} className="card flex items-center gap-4 p-4">
                            <div className="w-10 h-10 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-center flex-shrink-0">
                                <device.icon size={18} className="text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-slate-200">{device.name}</p>
                                    {device.isCurrent && <span className="badge-success text-xs">Current</span>}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>{device.os}</span>
                                    <span>·</span>
                                    <span>{device.browser}</span>
                                    <span>·</span>
                                    <div className="flex items-center gap-1">
                                        <Globe size={10} />
                                        {device.location}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                                    <Clock size={10} />
                                    {device.lastActive}
                                </div>
                            </div>
                            {!device.isCurrent && (
                                <button className="btn-danger py-1.5 text-xs gap-1.5">
                                    <LogOut size={13} />
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BillingTab() {
    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Current Plan</h2>
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                                <Shield size={18} className="text-primary-400" />
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-100">Free Plan</p>
                                <p className="text-xs text-slate-400">5 members · 5 GB storage</p>
                            </div>
                        </div>
                        <span className="badge-ghost">Active</span>
                    </div>
                    <button className="btn-primary w-full justify-center gap-2">
                        <Sparkles size={15} />
                        Upgrade to Pro — ₹299/user/month
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-base font-bold text-slate-200 mb-4">Pro Plan Includes</h2>
                <div className="card space-y-3">
                    {[
                        "Unlimited members",
                        "100 GB encrypted storage",
                        "AI chat summarization",
                        "AI task suggestions",
                        "Weekly encrypted digest",
                        "Advanced security controls",
                        "Device management",
                        "Priority support",
                    ].map((f) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                            <Check size={14} className="text-primary-400 flex-shrink-0" />
                            {f}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-dark border border-surface-border">
                <Lock size={14} className="text-accent-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                    No ads. No data selling. Revenue comes from subscriptions only.
                    We are financially incentivized to protect your privacy.
                </p>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("security");

    const TAB_CONTENT: Record<Tab, React.ReactNode> = {
        profile: <ProfileTab />,
        workspace: <WorkspaceTab />,
        security: <SecurityTab />,
        billing: <BillingTab />,
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-border flex-shrink-0">
                <h1 className="text-lg font-bold text-slate-100">Settings</h1>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Tab sidebar */}
                <div className="w-52 flex-shrink-0 border-r border-surface-border p-3 space-y-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${activeTab === tab.id
                                    ? "bg-primary-500/15 text-primary-300 border border-primary-500/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-surface-raised"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {TAB_CONTENT[activeTab]}
                </div>
            </div>
        </div>
    );
}
