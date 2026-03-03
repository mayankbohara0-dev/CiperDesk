"use client";

import { useState } from "react";
import {
    Plus,
    Lock,
    List,
    Columns,
    Filter,
    Search,
    ChevronDown,
    Circle,
    Clock,
    CheckCircle,
    AlertCircle,
    MoreHorizontal,
    Calendar,
    User,
    Tag,
    ArrowUpDown,
    Sparkles,
    MessageSquare,
} from "lucide-react";

type Priority = "high" | "medium" | "low";
type Status = "todo" | "in-progress" | "done";

type Task = {
    id: string;
    title: string;
    desc: string;
    assignee: string;
    assigneeAvatar: string;
    assigneeColor: string;
    dueDate: string;
    priority: Priority;
    status: Status;
    tags: string[];
    fromMessage?: boolean;
};

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string; dot: string }> = {
    high: { label: "High", className: "badge-danger", dot: "bg-red-400" },
    medium: { label: "Medium", className: "badge-warning", dot: "bg-yellow-400" },
    low: { label: "Low", className: "badge-ghost", dot: "bg-slate-400" },
};

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ElementType; color: string }> = {
    "todo": { label: "To Do", icon: Circle, color: "text-slate-400" },
    "in-progress": { label: "In Progress", icon: Clock, color: "text-primary-400" },
    "done": { label: "Done", icon: CheckCircle, color: "text-green-400" },
};

const INITIAL_TASKS: Task[] = [
    {
        id: "1",
        title: "Implement Argon2id password hashing",
        desc: "Replace bcrypt with Argon2id for all password operations. Update auth service.",
        assignee: "Arjun M.",
        assigneeAvatar: "AM",
        assigneeColor: "bg-primary-500",
        dueDate: "Mar 5",
        priority: "high",
        status: "in-progress",
        tags: ["security", "auth"],
        fromMessage: true,
    },
    {
        id: "2",
        title: "Fix staging deployment regression",
        desc: "Environment variables not loading correctly. Build fails on healthcheck.",
        assignee: "Priya S.",
        assigneeAvatar: "PS",
        assigneeColor: "bg-violet-500",
        dueDate: "Mar 4",
        priority: "high",
        status: "todo",
        tags: ["devops", "bug"],
        fromMessage: true,
    },
    {
        id: "3",
        title: "Design workspace key rotation flow",
        desc: "Document and implement key rotation when a member is removed from the workspace.",
        assignee: "You",
        assigneeAvatar: "Y",
        assigneeColor: "bg-accent-500",
        dueDate: "Mar 8",
        priority: "medium",
        status: "todo",
        tags: ["cryptography", "design"],
    },
    {
        id: "4",
        title: "Build Kanban board component",
        desc: "Implement drag-and-drop Kanban with encrypted task cards.",
        assignee: "Priya S.",
        assigneeAvatar: "PS",
        assigneeColor: "bg-violet-500",
        dueDate: "Mar 10",
        priority: "medium",
        status: "in-progress",
        tags: ["frontend"],
    },
    {
        id: "5",
        title: "Setup WebSocket server",
        desc: "Real-time message delivery via WebSocket. Include reconnection logic.",
        assignee: "Arjun M.",
        assigneeAvatar: "AM",
        assigneeColor: "bg-primary-500",
        dueDate: "Mar 7",
        priority: "high",
        status: "in-progress",
        tags: ["backend", "realtime"],
    },
    {
        id: "6",
        title: "Landing page copy review",
        desc: "Final review and proofreading of all landing page copy.",
        assignee: "Rahul N.",
        assigneeAvatar: "RN",
        assigneeColor: "bg-green-600",
        dueDate: "Mar 3",
        priority: "low",
        status: "done",
        tags: ["marketing"],
    },
    {
        id: "7",
        title: "User auth flow testing",
        desc: "E2E tests for registration, login, 2FA, and device approval flows.",
        assignee: "You",
        assigneeAvatar: "Y",
        assigneeColor: "bg-accent-500",
        dueDate: "Mar 6",
        priority: "medium",
        status: "done",
        tags: ["testing", "auth"],
    },
];

function TaskCard({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: Status) => void }) {
    const priority = PRIORITY_CONFIG[task.priority];
    const status = STATUS_CONFIG[task.status];

    return (
        <div className="bg-dark rounded-xl border border-surface-border p-4 hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={priority.className}>{priority.label}</span>
                    {task.fromMessage && (
                        <span className="badge-accent text-xs gap-1">
                            <MessageSquare size={9} />
                            From chat
                        </span>
                    )}
                </div>
                <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all">
                    <MoreHorizontal size={15} />
                </button>
            </div>

            <h3 className="text-sm font-semibold text-slate-200 mb-1.5 leading-snug">{task.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{task.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {task.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-slate-500 bg-surface-raised border border-surface-border px-2 py-0.5 rounded-md">
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full ${task.assigneeColor} flex items-center justify-center text-[9px] font-bold text-white`}>
                        {task.assigneeAvatar[0]}
                    </div>
                    <span className="text-xs text-slate-400">{task.assignee}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={11} />
                        {task.dueDate}
                    </div>
                    <Lock size={10} className="text-accent-400/40" />
                </div>
            </div>
        </div>
    );
}

const COLUMNS: { status: Status; label: string }[] = [
    { status: "todo", label: "To Do" },
    { status: "in-progress", label: "In Progress" },
    { status: "done", label: "Done" },
];

const COLUMN_COLORS: Record<Status, string> = {
    "todo": "bg-slate-400",
    "in-progress": "bg-primary-400",
    "done": "bg-green-400",
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [view, setView] = useState<"kanban" | "list">("kanban");
    const [search, setSearch] = useState("");

    const updateStatus = (id: string, status: Status) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    };

    const filtered = tasks.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-slate-100">Tasks</h1>
                    <span className="badge-accent">
                        <Lock size={10} />
                        Encrypted
                    </span>
                    <span className="text-xs text-slate-500">{tasks.length} total</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex items-center bg-surface-raised border border-surface-border rounded-lg p-0.5">
                        <button
                            onClick={() => setView("kanban")}
                            className={`p-1.5 rounded-md transition-all ${view === "kanban" ? "bg-primary-500/20 text-primary-400" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            <Columns size={15} />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-primary-500/20 text-primary-400" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            <List size={15} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            className="input-field pl-9 py-2 text-sm w-48"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button className="btn-ghost gap-1.5">
                        <Filter size={14} />
                        Filter
                    </button>

                    <button className="btn-primary gap-1.5">
                        <Plus size={15} />
                        New Task
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {view === "kanban" ? (
                    <div className="flex gap-5 h-full min-w-max">
                        {COLUMNS.map((col) => {
                            const colTasks = filtered.filter((t) => t.status === col.status);
                            return (
                                <div key={col.status} className="w-80 flex-shrink-0 flex flex-col">
                                    {/* Column header */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-2 h-2 rounded-full ${COLUMN_COLORS[col.status]}`} />
                                        <span className="text-sm font-bold text-slate-300">{col.label}</span>
                                        <span className="ml-1 text-xs bg-surface-raised border border-surface-border text-slate-400 rounded-md px-2 py-0.5 font-mono">
                                            {colTasks.length}
                                        </span>
                                        <button className="ml-auto p-1 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-surface-raised transition-all">
                                            <Plus size={13} />
                                        </button>
                                    </div>

                                    {/* Cards */}
                                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                        {colTasks.map((task) => (
                                            <TaskCard key={task.id} task={task} onStatusChange={updateStatus} />
                                        ))}
                                        {colTasks.length === 0 && (
                                            <div className="h-24 border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center">
                                                <span className="text-xs text-slate-600">Drop tasks here</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // List view
                    <div className="max-w-4xl">
                        <div className="bg-surface-DEFAULT rounded-2xl border border-surface-border overflow-hidden">
                            <div className="grid grid-cols-12 px-4 py-2.5 border-b border-surface-border text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <span className="col-span-5">Task</span>
                                <span className="col-span-2">Status</span>
                                <span className="col-span-2">Priority</span>
                                <span className="col-span-2">Assignee</span>
                                <span className="col-span-1">Due</span>
                            </div>
                            {filtered.map((task, i) => {
                                const StatusIcon = STATUS_CONFIG[task.status].icon;
                                return (
                                    <div
                                        key={task.id}
                                        className={`grid grid-cols-12 items-center px-4 py-3 hover:bg-surface-raised transition-colors cursor-pointer ${i < filtered.length - 1 ? "border-b border-surface-border" : ""
                                            }`}
                                    >
                                        <div className="col-span-5 flex items-center gap-2.5">
                                            <StatusIcon size={15} className={STATUS_CONFIG[task.status].color} />
                                            <span className={`text-sm font-medium ${task.status === "done" ? "line-through text-slate-500" : "text-slate-200"}`}>
                                                {task.title}
                                            </span>
                                            {task.fromMessage && <MessageSquare size={12} className="text-accent-400/50" />}
                                            <Lock size={10} className="text-accent-400/30 ml-auto" />
                                        </div>
                                        <div className="col-span-2">
                                            <select
                                                className="text-xs bg-transparent border-none text-slate-400 outline-none cursor-pointer"
                                                value={task.status}
                                                onChange={(e) => updateStatus(task.id, e.target.value as Status)}
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="done">Done</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={PRIORITY_CONFIG[task.priority].className}>
                                                {PRIORITY_CONFIG[task.priority].label}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1.5">
                                            <div className={`w-5 h-5 rounded-full ${task.assigneeColor} flex items-center justify-center text-[9px] font-bold text-white`}>
                                                {task.assigneeAvatar[0]}
                                            </div>
                                            <span className="text-xs text-slate-400">{task.assignee}</span>
                                        </div>
                                        <div className="col-span-1 text-xs text-slate-500">{task.dueDate}</div>
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
