import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
    workspace: string | null;
    created_at: string;
}

export interface Message {
    id: string;
    channel_id: string;
    user_id: string;
    content: string;
    created_at: string;
    profile?: Profile;
}

export interface Channel {
    id: string;
    name: string;
    description: string | null;
    is_private: boolean;
}

// ─── Auth ───────────────────────────────────────────────────────
export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) fetchProfile(user.id);
            else setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const u = session?.user ?? null;
            setUser(u);
            if (u) fetchProfile(u.id);
            else { setProfile(null); setLoading(false); }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    async function fetchProfile(uid: string) {
        const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
        setProfile(data ?? null);
        setLoading(false);
    }

    return { user, profile, loading };
}

// ─── Sign out ────────────────────────────────────────────────────
export async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
}

// ─── Channels ────────────────────────────────────────────────────
export function useChannels() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("channels")
            .select("*")
            .order("created_at")
            .then(({ data }) => {
                setChannels(data ?? []);
                setLoading(false);
            });
    }, []);

    return { channels, loading };
}

// ─── Messages ────────────────────────────────────────────────────
export function useMessages(channelId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = useCallback(async () => {
        if (!channelId) return;
        const { data } = await supabase
            .from("messages")
            .select("*, profile:profiles(id, full_name, email, avatar_url, role)")
            .eq("channel_id", channelId)
            .order("created_at", { ascending: true })
            .limit(100);
        setMessages((data as Message[]) ?? []);
        setLoading(false);
    }, [channelId]);

    useEffect(() => {
        setLoading(true);
        fetchMessages();

        if (!channelId) return;

        // Realtime subscription
        const channel = supabase
            .channel(`messages:${channelId}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `channel_id=eq.${channelId}`,
            }, async (payload) => {
                // Fetch full message with profile
                const { data } = await supabase
                    .from("messages")
                    .select("*, profile:profiles(id, full_name, email, avatar_url, role)")
                    .eq("id", payload.new.id)
                    .single();
                if (data) setMessages(prev => [...prev, data as Message]);
            })
            .on("postgres_changes", {
                event: "DELETE",
                schema: "public",
                table: "messages",
            }, (payload) => {
                setMessages(prev => prev.filter(m => m.id !== payload.old.id));
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [channelId, fetchMessages]);

    const sendMessage = useCallback(async (userId: string, content: string) => {
        if (!channelId || !content.trim()) return;
        await supabase.from("messages").insert({
            channel_id: channelId,
            user_id: userId,
            content: content.trim(),
        });
    }, [channelId]);

    const deleteMessage = useCallback(async (id: string) => {
        await supabase.from("messages").delete().eq("id", id);
    }, []);

    return { messages, loading, sendMessage, deleteMessage };
}

// ─── Tasks ───────────────────────────────────────────────────────
export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    assignee_id: string | null;
    created_by: string | null;
    due_date: string | null;
    created_at: string;
    assignee?: Profile;
}

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        const { data } = await supabase
            .from("tasks")
            .select("*, assignee:profiles!tasks_assignee_id_fkey(id, full_name, email, avatar_url, role)")
            .order("created_at", { ascending: false });
        setTasks((data as Task[]) ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const createTask = useCallback(async (task: Partial<Task> & { title: string }, userId: string) => {
        const { data } = await supabase.from("tasks").insert({ ...task, created_by: userId }).select().single();
        if (data) setTasks(prev => [data as Task, ...prev]);
    }, []);

    const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
        const { data } = await supabase.from("tasks").update(updates).eq("id", id).select().single();
        if (data) setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } as Task : t));
    }, []);

    const deleteTask = useCallback(async (id: string) => {
        await supabase.from("tasks").delete().eq("id", id);
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    return { tasks, loading, createTask, updateTask, deleteTask };
}

// ─── Members (profiles) ─────────────────────────────────────────
export function useMembers() {
    const [members, setMembers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("profiles")
            .select("*")
            .order("created_at")
            .then(({ data }) => {
                setMembers(data ?? []);
                setLoading(false);
            });
    }, []);

    const updateRole = useCallback(async (id: string, role: string, actorId: string) => {
        await supabase.from("profiles").update({ role }).eq("id", id);
        setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
        logAudit(actorId, "member", "Role Changed", `Changed role for user ${id} to ${role}`, "warn");
    }, []);

    return { members, loading, updateRole };
}

// ─── Vault ───────────────────────────────────────────────────────
export interface VaultFile {
    id: string;
    name: string;
    size_bytes: number;
    mime_type: string | null;
    storage_path: string | null;
    uploaded_by: string | null;
    created_at: string;
    uploader?: Profile;
}

export function useVault() {
    const [files, setFiles] = useState<VaultFile[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFiles = useCallback(async () => {
        const { data } = await supabase
            .from("vault_files")
            .select("*, uploader:profiles!vault_files_uploaded_by_fkey(id, full_name, email, avatar_url, role)")
            .order("created_at", { ascending: false });
        setFiles((data as VaultFile[]) ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchFiles(); }, [fetchFiles]);

    const uploadFile = useCallback(async (file: Partial<VaultFile>, userId: string) => {
        const { data } = await supabase.from("vault_files").insert({ ...file, uploaded_by: userId }).select().single();
        if (data) {
            setFiles(prev => [data as VaultFile, ...prev]);
            logAudit(userId, "file", "File Uploaded", `Uploaded file: ${file.name}`);
        }
    }, []);

    const deleteFile = useCallback(async (id: string, userId: string) => {
        const f = files.find(x => x.id === id);
        await supabase.from("vault_files").delete().eq("id", id);
        setFiles(prev => prev.filter(file => file.id !== id));
        if (f) logAudit(userId, "file", "File Deleted", `Deleted file: ${f.name}`, "warn");
    }, [files]);

    return { files, loading, uploadFile, deleteFile };
}

export async function logAudit(actorId: string, type: string, action: string, detail?: string, severity = "info") {
    await supabase.from("audit_log").insert({ actor_id: actorId, type, action, detail, severity });
}

// ─── Profile Update (Settings) ──────────────────────────────────
export async function updateProfile(uid: string, updates: Partial<Profile>) {
    await supabase.from("profiles").update(updates).eq("id", uid);
    logAudit(uid, "member", "Profile Updated", `User ${updates.full_name || updates.role || "profile"} updated`);
}

// ─── Notifications ──────────────────────────────────────────────
export interface Notification {
    id: string;
    user_id: string;
    type: "mention" | "task_assigned" | "security" | "system" | "message" | "task" | "invite";
    title: string;
    body: string | null;
    is_read: boolean;
    action_url: string | null;
    created_at: string;
}

export function useNotifications(userId: string | undefined) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .then(({ data }) => {
                setNotifications(data ?? []);
                setLoading(false);
            });
    }, [userId]);

    const markAsRead = useCallback(async (id: string) => {
        await supabase.from("notifications").update({ is_read: true }).eq("id", id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }, []);

    const clearAll = useCallback(async () => {
        if (!userId) return;
        await supabase.from("notifications").delete().eq("user_id", userId);
        setNotifications([]);
    }, [userId]);

    return { notifications, loading, markAsRead, clearAll };
}

// ─── Audit Log ─────────────────────────────────────────────────
export interface AuditLogEntry {
    id: number;
    type: string;
    action: string;
    actor_id: string | null;
    detail: string | null;
    ip: string | null;
    severity: "info" | "warn" | "critical";
    created_at: string;
    actor?: Profile;
}

export function useAuditLog() {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("audit_log")
            .select("*, actor:profiles!audit_log_actor_id_fkey(id, full_name, email, avatar_url, role)")
            .order("created_at", { ascending: false })
            .limit(100)
            .then(({ data }) => {
                setLogs(data ?? []);
                setLoading(false);
            });
    }, []);

    // Insert an audit log (helper)
    const logAction = useCallback(async (actorId: string, type: string, action: string, detail?: string, severity = "info") => {
        const { data } = await supabase.from("audit_log").insert({
            actor_id: actorId, type, action, detail, severity
        }).select("*, actor:profiles!audit_log_actor_id_fkey(full_name, email)").single();
        if (data) setLogs(prev => [data as AuditLogEntry, ...prev]);
    }, []);

    return { logs, loading, logAction };
}

// ─── Workspace Keys ────────────────────────────────────────────
export interface WorkspaceKey {
    id: string;
    name: string;
    key_type: string;
    status: "active" | "rotated" | "revoked";
    version: number;
    created_by: string | null;
    created_at: string;
    rotated_at: string | null;
    creator?: Profile;
}

export function useKeys() {
    const [keys, setKeys] = useState<WorkspaceKey[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchKeys = useCallback(async () => {
        const { data } = await supabase
            .from("workspace_keys")
            .select("*, creator:profiles!workspace_keys_created_by_fkey(id, full_name, email, avatar_url, role)")
            .order("created_at", { ascending: false });
        setKeys((data as WorkspaceKey[]) ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchKeys(); }, [fetchKeys]);

    const createKey = useCallback(async (name: string, userId: string) => {
        const { data } = await supabase.from("workspace_keys").insert({ name, created_by: userId }).select().single();
        if (data) setKeys(prev => [data as WorkspaceKey, ...prev]);
    }, []);

    const rotateKey = useCallback(async (id: string, userId: string) => {
        // Find existing to get old version
        const oldKey = keys.find(k => k.id === id);
        if (!oldKey) return;

        // Mark old as rotated
        await supabase.from("workspace_keys").update({ status: "rotated", rotated_at: new Date().toISOString() }).eq("id", id);

        // Create new
        const { data } = await supabase.from("workspace_keys").insert({
            name: oldKey.name,
            version: oldKey.version + 1,
            created_by: userId
        }).select("*, creator:profiles!workspace_keys_created_by_fkey(*)").single();

        if (data) {
            fetchKeys(); // Refresh list to get updated statuses and new key
            logAudit(userId, "security", "Workspace Key Rotated", `Rotated AES-256-GCM key to version ${oldKey.version + 1}`, "critical");
        }
    }, [keys, fetchKeys]);

    return { keys, loading, createKey, rotateKey };
}
