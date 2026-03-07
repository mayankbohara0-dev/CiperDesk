"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Hash, Shield, Lock, Send, Smile, Paperclip, MoreHorizontal,
    Check, Search, Pin, Trash2, X, Pencil,
} from "lucide-react";
import { useUser, useMessages, useChannels, useMembers, sendMentionNotification } from "@/lib/hooks";
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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [reactions, setReactions] = useState<Record<string, string[]>>({});
    const [typingUsers, setTypingUsers] = useState<Record<string, { name: string, exp: number }>>({});
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Typing broadcasts
    useEffect(() => {
        if (!resolvedChannelId || !user) return;
        const channel = supabase.channel(`typing-${resolvedChannelId}`);
        channel.on("broadcast", { event: "typing" }, (payload: any) => {
            if (payload.payload.userId === user?.id) return;
            setTypingUsers(p => ({ ...p, [payload.payload.userId]: { name: payload.payload.name, exp: Date.now() + 4000 } }));
        }).subscribe();

        const cleanup = setInterval(() => {
            const now = Date.now();
            setTypingUsers(p => {
                const next = { ...p };
                let changed = false;
                for (const k in next) if (next[k].exp < now) { delete next[k]; changed = true; }
                return changed ? next : p;
            });
        }, 1000);

        return () => { supabase.removeChannel(channel); clearInterval(cleanup); };
    }, [resolvedChannelId, user]);

    useEffect(() => {
        if (!resolvedChannelId || !user) return;
        const pingInterval = setInterval(() => {
            if (input.length > 0) {
                supabase.channel(`typing-${resolvedChannelId}`).send({
                    type: "broadcast",
                    event: "typing",
                    payload: { userId: user.id, name: profile?.full_name || profile?.email || "Someone" },
                });
            }
        }, 2000);
        return () => clearInterval(pingInterval);
    }, [input, resolvedChannelId, user, profile]);

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
        const content = input.trim();
        await sendMessage(user.id, content);

        // Detect @mentions and notify mentioned members
        const senderName = profile?.full_name || profile?.email || "Someone";
        const channelName = currentChannel?.name ?? channelId;
        const mentions = content.match(/@([\w\s]+?)(?=\s|$)/g) ?? [];
        for (const mention of mentions) {
            const mentionName = mention.slice(1).trim().toLowerCase();
            const mentionedMember = members.find(m =>
                (m.full_name || "").toLowerCase().startsWith(mentionName) ||
                (m.email || "").toLowerCase().startsWith(mentionName)
            );
            if (mentionedMember && mentionedMember.id !== user.id) {
                await sendMentionNotification(mentionedMember.id, senderName, channelName, content);
            }
        }

        setInput("");
        setSending(false);
        setMentionQuery(null);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
        if (e.key === "Escape") { setMentionQuery(null); }
    };

    const handleInputChange = (val: string) => {
        setInput(val);
        // Detect @mention trigger
        const atIndex = val.lastIndexOf("@");
        if (atIndex !== -1 && atIndex === val.length - 1) {
            setMentionQuery("");
        } else if (atIndex !== -1 && val.slice(atIndex + 1).match(/^[\w\s]{0,20}$/) && mentionQuery !== null) {
            setMentionQuery(val.slice(atIndex + 1));
        } else {
            setMentionQuery(null);
        }
    };

    const mentionSuggestions = mentionQuery !== null
        ? members.filter(m => {
            const q = mentionQuery.toLowerCase();
            return (m.full_name || "").toLowerCase().includes(q) || (m.email || "").toLowerCase().includes(q);
        }).slice(0, 5)
        : [];

    const insertMention = (m: typeof members[0]) => {
        const atIndex = input.lastIndexOf("@");
        const mentionText = m.full_name || m.email;
        setInput(input.slice(0, atIndex) + `@${mentionText} `);
        setMentionQuery(null);
        inputRef.current?.focus();
    };

    const handleEditSave = async (msgId: string) => {
        if (!editContent.trim()) return;
        const key = await (await import("@/lib/crypto")).CryptoManager.getOrGenerateLocalKey();
        const encrypted = await (await import("@/lib/crypto")).CryptoManager.encrypt(editContent.trim(), key);
        await supabase.from("messages").update({ content: encrypted }).eq("id", msgId);
        setEditingId(null);
        setEditContent("");
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
                                {editingId === msg.id ? (
                                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                                        <input
                                            autoFocus
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") handleEditSave(msg.id); if (e.key === "Escape") { setEditingId(null); } }}
                                            style={{ flex: 1, fontSize: 14, padding: "5px 10px", borderRadius: 8, border: "1.5px solid #0D0D0D", outline: "none", fontFamily: "Inter,sans-serif" }}
                                        />
                                        <button onClick={() => handleEditSave(msg.id)} style={{ padding: "4px 10px", borderRadius: 7, background: "#AAEF45", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Save</button>
                                        <button onClick={() => setEditingId(null)} style={{ padding: "4px 8px", borderRadius: 7, background: "#F5F0E8", border: "1px solid #E8E4DC", cursor: "pointer", fontSize: 12 }}>Cancel</button>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: 14, color: "#2D2D2D", lineHeight: 1.55, wordBreak: "break-word" }}>
                                        {msg.content.split(/(@\w[\w\s]*)/g).map((part, i) =>
                                            part.startsWith("@") ? <mark key={i} style={{ background: "#D4F7A0", borderRadius: 3, padding: "0 2px", color: "#2E7D32", fontWeight: 700 }}>{part}</mark> : part
                                        )}
                                    </p>
                                )}
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
                                {/* Timestamp on hover */}
                                <span style={{ fontSize: 10, color: "#C8C4BC", alignSelf: "center", marginRight: 4, fontFamily: "monospace" }}>{time}</span>
                                <button onClick={() => setReacting(reacting === msg.id ? null : msg.id)}
                                    style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B675E" }}>
                                    <Smile size={13} />
                                </button>
                                {isOwn && (
                                    <button onClick={() => { setEditingId(msg.id); setEditContent(msg.content); }}
                                        style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B675E" }}>
                                        <Pencil size={12} />
                                    </button>
                                )}
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

            {Object.values(typingUsers).length > 0 && (
                <div style={{ padding: "0 24px 6px", fontSize: 11, color: "#A8A49C", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#A8A49C", animation: "pulse 1s ease-in-out infinite" }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#A8A49C", animation: "pulse 1s ease-in-out infinite .2s" }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#A8A49C", animation: "pulse 1s ease-in-out infinite .4s" }} />
                    </div>
                    {Object.values(typingUsers).map(t => t.name).join(", ")} is typing…
                </div>
            )}

            {/* Composer */}
            <div style={{ padding: "12px 20px", borderTop: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0, position: "relative" }}>
                {/* @mention autocomplete */}
                {mentionSuggestions.length > 0 && (
                    <div style={{ position: "absolute", bottom: "100%", left: 20, right: 20, background: "#fff", border: "1.5px solid #E8E4DC", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.12)", overflow: "hidden", marginBottom: 4 }}>
                        {mentionSuggestions.map(m => (
                            <button key={m.id} onClick={() => insertMention(m)}
                                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", transition: "background .1s" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F5F0E8"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                <div style={{ width: 26, height: 26, borderRadius: 7, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#AAEF45" }}>
                                    {(m.full_name || m.email).slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0D0D0D" }}>{m.full_name || m.email}</div>
                                    <div style={{ fontSize: 11, color: "#A8A49C" }}>{m.role}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#F5F0E8", border: "1.5px solid #E8E4DC", borderRadius: 14, padding: "8px 12px", transition: "border-color .15s" }}
                    onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "#0D0D0D"}
                    onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DC"}>
                    <button style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#A8A49C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Paperclip size={15} />
                    </button>
                    <textarea ref={inputRef} placeholder={`Message #${currentChannel?.name ?? channelId}… (@ to mention)`}
                        value={input} onChange={e => {
                            handleInputChange(e.target.value);
                            if (e.target.value.length === 1 && resolvedChannelId && user) {
                                supabase.channel(`typing-${resolvedChannelId}`).send({ type: "broadcast", event: "typing", payload: { userId: user.id, name: profile?.full_name || profile?.email || "Someone" } });
                            }
                        }} onKeyDown={handleKeyDown} rows={1}
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
