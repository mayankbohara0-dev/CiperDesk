"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Hash, Shield, Lock, Send, Smile, Paperclip, MoreHorizontal,
    Check, Search, Pin, Trash2, X,
} from "lucide-react";
import { useUser, useMessages, useChannels, useMembers } from "@/lib/hooks";
import { supabase } from "@/lib/supabase/client";

const REACTIONS = ["👍", "❤️", "🔥", "✅", "😂", "🎉"];

export default function ChatPage() {
    const { channelId } = useParams<{ channelId: string }>();
    const router = useRouter();

    const { user, profile, loading: userLoading } = useUser();
    const { channels } = useChannels();
    const [resolvedChannelId, setResolvedChannelId] = useState<string | null>(null);

    // Resolve channel name/id → real channel id
    useEffect(() => {
        async function resolve() {
            if (!channelId || !user) return;

            // 1. Try by exact name
            const { data: byName } = await supabase.from("channels").select("id").eq("name", channelId).maybeSingle();
            if (byName) { setResolvedChannelId(byName.id); return; }

            // 2. Try by exact id
            if (channelId.length === 36) {
                const { data: byId } = await supabase.from("channels").select("id").eq("id", channelId).maybeSingle();
                if (byId) { setResolvedChannelId(byId.id); return; }
            }

            // 3. Assume channelId is a user UUID for a DM. Create or find DM channel deterministic name.
            const u1 = user.id < channelId ? user.id : channelId;
            const u2 = user.id < channelId ? channelId : user.id;
            const dmName = `dm_${u1}_${u2}`;

            let { data: dmChannel } = await supabase.from("channels").select("id").eq("name", dmName).maybeSingle();
            if (!dmChannel) {
                const { data: newCh } = await supabase.from("channels").insert({
                    name: dmName,
                    description: "Direct Message",
                    type: "private"
                }).select("id").single();
                dmChannel = newCh;
            }
            if (dmChannel) setResolvedChannelId(dmChannel.id);
        }
        resolve();
    }, [channelId, user]);

    const { messages, loading: msgsLoading, sendMessage, deleteMessage } = useMessages(resolvedChannelId);

    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [reacting, setReacting] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [reactions, setReactions] = useState<Record<string, string[]>>({});
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const { members } = useMembers();

    if (userLoading) {
        return (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                    <p style={{ fontSize: 14, color: "#A8A49C" }}>Loading…</p>
                </div>
            </div>
        );
    }

    const currentChannel = channels.find(c => c.name === channelId || c.id === channelId);
    const dmMember = !currentChannel ? members.find(m => m.id === channelId) : null;
    const headerTitle = currentChannel?.name ?? (dmMember ? dmMember.full_name || dmMember.email : channelId);
    const headerDesc = currentChannel?.description ?? (dmMember ? "Direct message (End-to-End Encrypted)" : "");
    const initials = dmMember?.full_name ? dmMember.full_name.slice(0, 2).toUpperCase() : dmMember?.email.slice(0, 2).toUpperCase() || "DM";

    // Filter messages for search
    const displayMessages = search
        ? messages.filter(m => m.content.toLowerCase().includes(search.toLowerCase()))
        : messages;

    const handleSend = async () => {
        if (!input.trim() || !user || !resolvedChannelId || sending) return;
        setSending(true);
        await sendMessage(user.id, input);
        setInput("");
        setSending(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const toggleReaction = (msgId: string, emoji: string) => {
        setReacting(null);
        setReactions(prev => {
            const cur = prev[msgId] ?? [];
            return { ...prev, [msgId]: cur.includes(emoji) ? cur.filter(e => e !== emoji) : [...cur, emoji] };
        });
    };

    const getInitials = (name: string | null | undefined, email: string) => {
        if (name) return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
        return email.slice(0, 2).toUpperCase();
    };

    const getAvatarBg = (id: string) => {
        const colors = ["#4F63FF", "#9333EA", "#2E7D32", "#D97706", "#DC2626", "#0891B2"];
        return colors[id.charCodeAt(0) % colors.length];
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "#fff" }}>

            {/* Channel header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1.5px solid #E8E4DC", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: dmMember ? "#0D0D0D" : "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", color: dmMember ? "#fff" : "#6B675E", fontSize: 13, fontWeight: 800 }}>
                        {dmMember ? initials : <Hash size={15} style={{ color: "#6B675E" }} />}
                    </div>
                    <div>
                        <h1 style={{ fontSize: 15, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.01em" }}>
                            {headerTitle}
                        </h1>
                        {headerDesc && (
                            <p style={{ fontSize: 11, color: "#A8A49C" }}>{headerDesc}</p>
                        )}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 4 }}>
                        <Lock size={9} /> E2EE
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setShowSearch(!showSearch)}
                        style={{ width: 32, height: 32, borderRadius: 9, border: "1.5px solid #E8E4DC", background: showSearch ? "#0D0D0D" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: showSearch ? "#AAEF45" : "#6B675E" }}>
                        <Search size={14} />
                    </button>
                    <button style={{ width: 32, height: 32, borderRadius: 9, border: "1.5px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B675E" }}>
                        <Pin size={14} />
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 9, background: "#F5F0E8", border: "1.5px solid #E8E4DC" }}>
                        <Shield size={12} style={{ color: "#0D0D0D" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#0D0D0D" }}>Messages: {messages.length}</span>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            {showSearch && (
                <div style={{ padding: "8px 20px", borderBottom: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", gap: 8 }}>
                    <Search size={14} style={{ color: "#A8A49C" }} />
                    <input autoFocus placeholder="Search messages…" value={search} onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#0D0D0D", background: "transparent" }} />
                    {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#A8A49C" }}><X size={14} /></button>}
                </div>
            )}

            {/* Messages list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
                {msgsLoading && (
                    <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite" }} />
                    </div>
                )}

                {!msgsLoading && displayMessages.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                            <Hash size={22} style={{ color: "#C8C4BC" }} />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#0D0D0D" }}>No messages yet</p>
                        <p style={{ fontSize: 13, color: "#A8A49C", marginTop: 4 }}>Send the first message to #{currentChannel?.name ?? channelId}!</p>
                    </div>
                )}

                {displayMessages.map((msg, idx) => {
                    const isOwn = msg.user_id === user?.id;
                    const prev = displayMessages[idx - 1];
                    const isSameUser = prev && prev.user_id === msg.user_id &&
                        (new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime()) < 60000;
                    const name = msg.profile?.full_name ?? msg.profile?.email ?? "User";
                    const initials = getInitials(msg.profile?.full_name, msg.profile?.email ?? "U");
                    const avatarBg = getAvatarBg(msg.user_id);
                    const msgReactions = reactions[msg.id] ?? [];
                    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    return (
                        <div key={msg.id}
                            style={{ display: "flex", gap: 10, padding: "3px 6px", borderRadius: 10, marginTop: isSameUser ? 1 : 10, position: "relative" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF7"}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; if (reacting === msg.id) setReacting(null); }}>

                            {/* Avatar */}
                            <div style={{ width: 34, flexShrink: 0 }}>
                                {!isSameUser && (
                                    <div style={{ width: 34, height: 34, borderRadius: 10, background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>
                                        {initials}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {!isSameUser && (
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>{name}</span>
                                        {isOwn && <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 999, background: "#AAEF45", color: "#0D0D0D" }}>You</span>}
                                        <span style={{ fontSize: 11, color: "#C8C4BC" }}>{time}</span>
                                    </div>
                                )}
                                <p style={{ fontSize: 14, color: "#2D2D2D", lineHeight: 1.55, wordBreak: "break-word" }}>{msg.content}</p>
                                {msgReactions.length > 0 && (
                                    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                                        {msgReactions.map(emoji => (
                                            <button key={emoji} onClick={() => toggleReaction(msg.id, emoji)}
                                                style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 99, background: "#F5F0E8", border: "1.5px solid #E8E4DC", cursor: "pointer", fontSize: 13 }}>
                                                {emoji} <span style={{ fontSize: 11, fontWeight: 700, color: "#6B675E" }}>1</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions (hover) */}
                            <div style={{ display: "flex", gap: 4, position: "absolute", right: 8, top: 4 }}>
                                <button onClick={() => setReacting(reacting === msg.id ? null : msg.id)}
                                    style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B675E" }}>
                                    <Smile size={13} />
                                </button>
                                {isOwn && (
                                    <button onClick={() => deleteMessage(msg.id)}
                                        style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #FECACA", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#DC2626" }}>
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>

                            {/* Emoji picker */}
                            {reacting === msg.id && (
                                <div style={{ position: "absolute", right: 8, top: 36, zIndex: 10, background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 12, padding: "8px 10px", display: "flex", gap: 6, boxShadow: "0 4px 20px rgba(0,0,0,.10)" }}>
                                    {REACTIONS.map(emoji => (
                                        <button key={emoji} onClick={() => toggleReaction(msg.id, emoji)}
                                            style={{ fontSize: 18, cursor: "pointer", background: "none", border: "none", padding: "2px 4px", borderRadius: 6, transition: "transform .1s" }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.3)"}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}>
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <div style={{ padding: "12px 20px", borderTop: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#F5F0E8", border: "1.5px solid #E8E4DC", borderRadius: 14, padding: "8px 12px", transition: "border-color .15s" }}
                    onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "#0D0D0D"}
                    onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DC"}>
                    <button style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#A8A49C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Paperclip size={15} />
                    </button>
                    <textarea ref={inputRef} placeholder={`Message #${currentChannel?.name ?? channelId}…`}
                        value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} rows={1}
                        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#0D0D0D", resize: "none", fontFamily: "Inter,sans-serif", lineHeight: 1.5, maxHeight: 120, overflowY: "auto" }} />
                    <button style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#A8A49C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Smile size={15} />
                    </button>
                    <button onClick={handleSend} disabled={!input.trim() || sending}
                        style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, border: "none", background: input.trim() ? "#0D0D0D" : "#E8E4DC", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", transition: "all .15s" }}>
                        {sending
                            ? <Check size={16} style={{ color: "#AAEF45" }} />
                            : <Send size={15} style={{ color: input.trim() ? "#AAEF45" : "#A8A49C", transform: "rotate(0deg)" }} />}
                    </button>
                </div>
                <p style={{ fontSize: 11, color: "#C8C4BC", textAlign: "center", marginTop: 6 }}>Shift+Enter for new line · E2EE · messages stored in Supabase</p>
            </div>
        </div>
    );
}
