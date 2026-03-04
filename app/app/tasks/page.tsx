"use client";

import { useState } from "react";
import {
    Plus, Lock, List, Columns, Filter, Search,
    Circle, Clock, CheckCircle, MoreHorizontal, Calendar, MessageSquare, Trash2
} from "lucide-react";
import { useTasks, useUser, type Task } from "@/lib/hooks";

type Priority = "high" | "medium" | "low";
type Status = "todo" | "in_progress" | "done";

const P_STYLE: Record<Priority, { label: string; bg: string; color: string; dot: string }> = {
    high: { label: "High", bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
    medium: { label: "Medium", bg: "#FEF9C3", color: "#854D0E", dot: "#F59E0B" },
    low: { label: "Low", bg: "#F3F4F6", color: "#4B5563", dot: "#9CA3AF" },
};

const S_STYLE: Record<Status, { label: string; Icon: React.ElementType; color: string }> = {
    "todo": { label: "To Do", Icon: Circle, color: "#A8A49C" },
    "in_progress": { label: "In Progress", Icon: Clock, color: "#4F63FF" },
    "done": { label: "Done", Icon: CheckCircle, color: "#22C55E" },
};

const COL_DOT: Record<Status, string> = {
    "todo": "#A8A49C",
    "in_progress": "#4F63FF",
    "done": "#22C55E",
};

const COLUMNS: { status: Status; label: string }[] = [
    { status: "todo", label: "To Do" },
    { status: "in_progress", label: "In Progress" },
    { status: "done", label: "Done" },
];

function PBadge({ p }: { p: Priority }) {
    const s = P_STYLE[p];
    return <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: s.bg, color: s.color }}>{s.label}</span>;
}

function getAvatarBg(id: string) {
    const colors = ["#4F63FF", "#9333EA", "#2E7D32", "#D97706", "#DC2626", "#0891B2"];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function TaskCard({ task, onStatusChange, onDelete }: { task: Task; onStatusChange: (id: string, s: Status) => void; onDelete: (id: string) => void; }) {
    const [hov, setHov] = useState(false);

    const displayName = task.assignee?.full_name || task.assignee?.email || "Unassigned";
    const initials = task.assignee ? (task.assignee.full_name ? task.assignee.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : task.assignee.email.slice(0, 2).toUpperCase()) : "?";
    const avatarBg = task.assignee_id ? getAvatarBg(task.assignee_id) : "#E8E4DC";

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: "#fff", borderRadius: 14, border: `1.5px solid ${hov ? "#AAEF45" : "#E8E4DC"}`,
                padding: 14, cursor: "pointer", transform: hov ? "translateY(-2px)" : "none",
                transition: "all .2s", boxShadow: hov ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.04)",
                position: "relative"
            }}>

            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <PBadge p={task.priority} />
                </div>
                <div style={{ display: "flex", gap: 4, opacity: hov ? 1 : 0, transition: "opacity .15s" }}>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} style={{ border: "none", background: "none", cursor: "pointer", color: "#EF4444", padding: 2 }}>
                        <Trash2 size={13} />
                    </button>
                    <button style={{ border: "none", background: "none", cursor: "pointer", color: "#C8C4BC", padding: 2 }}>
                        <MoreHorizontal size={15} />
                    </button>
                </div>
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D", marginBottom: 4, lineHeight: 1.4 }}>{task.title}</h3>
            {task.description && (
                <p style={{ fontSize: 12, color: "#A8A49C", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{task.description}</p>
            )}

            {/* Bottom */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>
                        {initials}
                    </div>
                    <span style={{ fontSize: 11, color: "#6B675E", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {task.due_date && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#A8A49C" }}>
                            <Calendar size={10} /> {new Date(task.due_date).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                    )}
                    <Lock size={9} style={{ color: "#C8C4BC" }} />
                </div>
            </div>
        </div>
    );
}

export default function TasksPage() {
    const { user } = useUser();
    const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();

    const [view, setView] = useState<"kanban" | "list">("kanban");
    const [search, setSearch] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleCreate = async () => {
        if (!newTitle.trim() || !user) return;
        setIsCreating(true);
        await createTask({ title: newTitle.trim(), status: "todo", priority: "medium" }, user.id);
        setNewTitle("");
        setIsCreating(false);
    };

    const updateStatus = (id: string, status: Status) => updateTask(id, { status });

    const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>Tasks</h1>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 4 }}>
                        <Lock size={9} /> Encrypted
                    </span>
                    {!loading && <span style={{ fontSize: 12, color: "#A8A49C" }}>{tasks.length} tasks</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* View toggle */}
                    <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1.5px solid #E8E4DC", background: "#F5F0E8" }}>
                        {([["kanban", Columns], ["list", List]] as const).map(([v, Icon]) => (
                            <button key={v} onClick={() => setView(v)}
                                style={{ width: 34, height: 34, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: view === v ? "#0D0D0D" : "transparent", color: view === v ? "#fff" : "#A8A49C", transition: "all .15s" }}>
                                <Icon size={15} />
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ position: "relative" }}>
                        <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#A8A49C" }} />
                        <input className="input-field" style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8, fontSize: 13, width: 190, margin: 0 }} placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <input className="input-field" style={{ paddingTop: 8, paddingBottom: 8, fontSize: 13, width: 220, margin: 0 }} placeholder="Quick add task…" value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} />
                        <button className="btn-primary" style={{ padding: "8px 16px" }} onClick={handleCreate} disabled={!newTitle.trim() || isCreating || !user}>
                            <Plus size={14} /> Add
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite" }} />
                    </div>
                ) : view === "kanban" ? (
                    <div style={{ display: "flex", gap: 20, height: "100%", minWidth: "max-content" }}>
                        {COLUMNS.map(col => {
                            const colTasks = filtered.filter(t => t.status === col.status);
                            return (
                                <div key={col.status} style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                                    {/* Column header */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "0 4px" }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: COL_DOT[col.status] }} />
                                        <span style={{ fontSize: 13, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{col.label}</span>
                                        <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "#6B675E", background: "#F5F0E8", padding: "1px 7px", borderRadius: 5 }}>{colTasks.length}</span>
                                    </div>

                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", paddingBottom: 40 }}>
                                        {colTasks.map(task => <TaskCard key={task.id} task={task} onStatusChange={updateStatus} onDelete={deleteTask} />)}
                                        {colTasks.length === 0 && (
                                            <div style={{ height: 80, border: "2px dashed #E8E4DC", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <span style={{ fontSize: 12, color: "#C8C4BC" }}>Empty</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* List view */
                    <div style={{ maxWidth: 860 }}>
                        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E8E4DC", overflow: "hidden" }}>
                            {/* Table header */}
                            <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr", padding: "10px 16px", borderBottom: "1.5px solid #E8E4DC", background: "#F5F0E8" }}>
                                {["Task", "Status", "Priority", "Assignee", "Due"].map(h => (
                                    <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6B675E", textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</span>
                                ))}
                            </div>

                            {filtered.length === 0 && (
                                <div style={{ padding: 30, textAlign: "center", color: "#A8A49C", fontSize: 13 }}>No tasks found.</div>
                            )}

                            {filtered.map((task, i) => {
                                const { Icon: StatusIcon, color } = S_STYLE[task.status];
                                const displayName = task.assignee?.full_name || task.assignee?.email || "Unassigned";
                                const initials = task.assignee ? (task.assignee.full_name ? task.assignee.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : task.assignee.email.slice(0, 2).toUpperCase()) : "?";
                                const avatarBg = task.assignee_id ? getAvatarBg(task.assignee_id) : "#E8E4DC";

                                return (
                                    <div key={task.id} style={{ display: "grid", gridTemplateColumns: "5fr 2fr 2fr 2fr 1fr", alignItems: "center", padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "1px solid #F0EBE3" : "none", cursor: "pointer", transition: "background .15s" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF7"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>

                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <StatusIcon size={14} style={{ color, flexShrink: 0 }} />
                                            <span style={{ fontSize: 13, fontWeight: 600, color: task.status === "done" ? "#A8A49C" : "#0D0D0D", textDecoration: task.status === "done" ? "line-through" : "none" }}>
                                                {task.title}
                                            </span>
                                        </div>

                                        <div>
                                            <select style={{ fontSize: 12, background: "transparent", border: "none", outline: "none", cursor: "pointer", color: "#6B675E", fontFamily: "Inter,sans-serif" }}
                                                value={task.status} onChange={e => updateStatus(task.id, e.target.value as Status)}>
                                                <option value="todo">To Do</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="done">Done</option>
                                            </select>
                                        </div>

                                        <div><PBadge p={task.priority} /></div>

                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ width: 20, height: 20, borderRadius: 6, background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>
                                                {initials}
                                            </div>
                                            <span style={{ fontSize: 12, color: "#6B675E", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</span>
                                        </div>

                                        <span style={{ fontSize: 12, color: "#A8A49C" }}>
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString([], { month: "short", day: "numeric" }) : "—"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
