"use client";

import { useState } from "react";
import {
    Lock,
    Hash,
    Smile,
    Paperclip,
    Send,
    MoreHorizontal,
    Reply,
    Edit2,
    Trash2,
    CheckSquare,
    SmilePlus,
    Users,
    ChevronRight,
    CheckCheck,
    Flame,
    Pin,
} from "lucide-react";

type Message = {
    id: string;
    user: string;
    avatar: string;
    color: string;
    text: string;
    time: string;
    reactions?: { emoji: string; count: number }[];
    isOwn?: boolean;
    encrypted?: boolean;
    pinned?: boolean;
};

const MOCK_MESSAGES: Message[] = [
    {
        id: "1",
        user: "Arjun Mehta",
        avatar: "AM",
        color: "bg-primary-500",
        text: "Morning everyone! Just finished the auth flow implementation. Pushed to staging. Can someone review before we merge?",
        time: "10:28 AM",
        encrypted: true,
        reactions: [{ emoji: "🔥", count: 3 }, { emoji: "✅", count: 2 }],
    },
    {
        id: "2",
        user: "Priya Sharma",
        avatar: "PS",
        color: "bg-violet-500",
        text: "On it! I'll review ASAP. Also @Arjun — we should track the deploy issue as a task. That regression from last week is still open.",
        time: "10:31 AM",
        encrypted: true,
    },
    {
        id: "3",
        user: "Rahul Nair",
        avatar: "RN",
        color: "bg-green-600",
        text: "Agree. We should prioritize that. What's the ETA on the fix?",
        time: "10:33 AM",
        encrypted: true,
        reactions: [{ emoji: "👍", count: 1 }],
    },
    {
        id: "4",
        user: "You",
        avatar: "Y",
        color: "bg-accent-500",
        text: "I'll create a task now from Priya's message. Should be ready for review by EOD today.",
        time: "10:35 AM",
        encrypted: true,
        isOwn: true,
    },
    {
        id: "5",
        user: "Priya Sharma",
        avatar: "PS",
        color: "bg-violet-500",
        text: "Great! I've also started working on the file vault encryption spec. Will share the doc in #engineering soon.",
        time: "10:38 AM",
        encrypted: true,
        reactions: [{ emoji: "🙌", count: 2 }],
    },
    {
        id: "6",
        user: "Arjun Mehta",
        avatar: "AM",
        color: "bg-primary-500",
        text: "The workspace key rotation logic is the tricky part — we need to re-encrypt all member keys when someone leaves. I've drafted the flow.",
        time: "10:42 AM",
        encrypted: true,
        pinned: true,
    },
    {
        id: "7",
        user: "You",
        avatar: "Y",
        color: "bg-accent-500",
        text: "Agreed. Let me take a look at your flow doc. Also the double ratchet implementation looks solid btw 🔒",
        time: "10:44 AM",
        encrypted: true,
        isOwn: true,
    },
];

function MessageBubble({ msg, onConvertToTask }: { msg: Message; onConvertToTask: (msg: Message) => void }) {
    const [hovering, setHovering] = useState(false);

    return (
        <div
            className={`flex items-start gap-3 group ${msg.isOwn ? "flex-row-reverse" : ""}`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-xl ${msg.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5`}
            >
                {msg.avatar[0]}
            </div>

            <div className={`flex-1 max-w-[75%] ${msg.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                {/* Header */}
                <div className={`flex items-center gap-2 mb-1 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                    <span className="text-sm font-semibold text-slate-200">{msg.user}</span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                    {msg.encrypted && <Lock size={10} className="text-accent-400/60" />}
                    {msg.pinned && <Pin size={10} className="text-yellow-400/70" />}
                    <CheckCheck size={11} className="text-primary-400/50" />
                </div>

                {/* Bubble */}
                <div
                    className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isOwn
                            ? "bg-primary-500/20 border border-primary-500/30 text-slate-200 rounded-tr-md"
                            : "bg-surface-DEFAULT border border-surface-border text-slate-300 rounded-tl-md"
                        }`}
                >
                    {msg.text}
                </div>

                {/* Reactions */}
                {msg.reactions && (
                    <div className={`flex items-center gap-1 mt-1.5 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                        {msg.reactions.map((r) => (
                            <button
                                key={r.emoji}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-raised border border-surface-border text-xs hover:border-primary-500/40 transition-colors"
                            >
                                {r.emoji} <span className="text-slate-400">{r.count}</span>
                            </button>
                        ))}
                        <button className="p-0.5 rounded-full text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <SmilePlus size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* Hover actions */}
            <div
                className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.isOwn ? "order-first" : "order-last"
                    }`}
            >
                {[
                    { icon: SmilePlus, label: "React" },
                    { icon: Reply, label: "Reply" },
                    { icon: Edit2, label: "Edit" },
                ].map(({ icon: Icon, label }) => (
                    <button
                        key={label}
                        title={label}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all"
                    >
                        <Icon size={13} />
                    </button>
                ))}
                <button
                    title="Convert to Task"
                    onClick={() => onConvertToTask(msg)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-accent-400 hover:bg-accent-400/10 transition-all"
                >
                    <CheckSquare size={13} />
                </button>
                <button
                    title="More"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all"
                >
                    <MoreHorizontal size={13} />
                </button>
            </div>
        </div>
    );
}

function TaskConvertModal({ msg, onClose }: { msg: Message; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface-DEFAULT border border-surface-border rounded-2xl w-full max-w-md p-6 shadow-card animate-scale-in">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-accent-400/10 border border-accent-400/20 flex items-center justify-center">
                        <CheckSquare size={19} className="text-accent-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-100">Convert to Task</h2>
                        <p className="text-xs text-slate-400">Message from {msg.user}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Title</label>
                        <input className="input-field" defaultValue={msg.text.slice(0, 60) + (msg.text.length > 60 ? "..." : "")} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Assignee</label>
                            <select className="input-field text-slate-300">
                                <option>You</option>
                                <option>Arjun Mehta</option>
                                <option>Priya Sharma</option>
                                <option>Rahul Nair</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Priority</label>
                            <select className="input-field text-slate-300">
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Due Date</label>
                        <input type="date" className="input-field" />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
                    <button onClick={onClose} className="btn-primary flex-1 justify-center">
                        Create Task
                        <Lock size={14} />
                    </button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-3 flex items-center justify-center gap-1.5">
                    <Lock size={11} className="text-accent-400" />
                    Task will be encrypted before storage
                </p>
            </div>
        </div>
    );
}

export default function ChatPage({ params }: { params: { channelId: string } }) {
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [input, setInput] = useState("");
    const [taskMsg, setTaskMsg] = useState<Message | null>(null);

    const channelName = params.channelId;

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                user: "You",
                avatar: "Y",
                color: "bg-accent-500",
                text: input,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                encrypted: true,
                isOwn: true,
            },
        ]);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border bg-dark/50 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <Hash size={17} className="text-slate-400" />
                    <span className="text-base font-bold text-slate-200">{channelName}</span>
                    <div className="w-px h-4 bg-surface-border mx-1" />
                    <span className="text-sm text-slate-500">4 members</span>
                    <div className="flex -space-x-1.5">
                        {["AM", "PS", "RN", "Y"].map((av, i) => (
                            <div
                                key={av}
                                className={`w-5 h-5 rounded-full border border-dark text-[10px] font-bold text-white flex items-center justify-center ${["bg-primary-500", "bg-violet-500", "bg-green-600", "bg-accent-500"][i]
                                    }`}
                            >
                                {av[0]}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="encrypted-label">
                        <Lock size={10} />
                        E2E Encrypted
                    </span>
                    <button className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all">
                        <Users size={16} />
                    </button>
                    <button className="p-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all">
                        <Pin size={16} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scroll-smooth">
                {/* Day divider */}
                <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-surface-border" />
                    <span className="text-xs text-slate-500 font-medium px-2">Today</span>
                    <div className="flex-1 h-px bg-surface-border" />
                </div>

                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        msg={msg}
                        onConvertToTask={(m) => setTaskMsg(m)}
                    />
                ))}
            </div>

            {/* Composer */}
            <div className="px-4 pb-4 pt-2 flex-shrink-0">
                <div className="bg-surface-DEFAULT rounded-2xl border border-surface-border overflow-hidden">
                    <div className="flex items-center px-4 py-1 border-b border-surface-border gap-2">
                        <button className="btn-ghost text-xs px-2 py-1 gap-1.5">
                            <strong>B</strong>
                        </button>
                        <button className="btn-ghost text-xs px-2 py-1 gap-1.5 italic">I</button>
                        <button className="btn-ghost text-xs px-2 py-1 gap-1.5 font-mono">{"</>"}</button>
                    </div>
                    <div className="flex items-end gap-3 px-4 py-3">
                        <Lock size={15} className="text-accent-400/60 flex-shrink-0 mb-1" />
                        <textarea
                            id="message-composer"
                            className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 resize-none outline-none leading-relaxed max-h-32"
                            placeholder={`Message #${channelName} (encrypted)`}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <div className="flex items-center gap-1.5 flex-shrink-0 mb-0.5">
                            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-raised transition-all">
                                <Smile size={17} />
                            </button>
                            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-raised transition-all">
                                <Paperclip size={17} />
                            </button>
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim()}
                                className={`p-2 rounded-xl transition-all ${input.trim()
                                        ? "bg-primary-500 text-white shadow-glow-primary hover:bg-primary-400"
                                        : "bg-surface-raised text-slate-600"
                                    }`}
                            >
                                <Send size={15} />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-600 mt-2 flex items-center justify-center gap-1.5">
                    <Lock size={10} />
                    Messages are encrypted with AES-256-GCM before leaving your device
                </p>
            </div>

            {/* Task convert modal */}
            {taskMsg && (
                <TaskConvertModal msg={taskMsg} onClose={() => setTaskMsg(null)} />
            )}
        </div>
    );
}
