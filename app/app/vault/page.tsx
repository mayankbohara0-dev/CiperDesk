"use client";

import { useState } from "react";
import {
    FolderLock,
    Upload,
    Lock,
    File,
    FileText,
    FileImage,
    FileCode,
    Download,
    Trash2,
    MoreHorizontal,
    Search,
    Grid,
    List,
    Shield,
    Plus,
    Eye,
    Share2,
    Clock,
    HardDrive,
} from "lucide-react";

type FileItem = {
    id: string;
    name: string;
    size: string;
    type: "pdf" | "image" | "code" | "doc" | "zip";
    uploadedBy: string;
    uploadedAt: string;
    encrypted: boolean;
    chunks: number;
};

const FILE_ICONS: Record<string, React.ElementType> = {
    pdf: FileText,
    image: FileImage,
    code: FileCode,
    doc: FileText,
    zip: File,
};

const FILE_COLORS: Record<string, string> = {
    pdf: "text-red-400 bg-red-400/10 border-red-400/20",
    image: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    code: "text-green-400 bg-green-400/10 border-green-400/20",
    doc: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    zip: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

const MOCK_FILES: FileItem[] = [
    {
        id: "1",
        name: "CipherDesk_Architecture.pdf",
        size: "2.4 MB",
        type: "pdf",
        uploadedBy: "Arjun M.",
        uploadedAt: "Today, 10:30 AM",
        encrypted: true,
        chunks: 5,
    },
    {
        id: "2",
        name: "encryption_flow_diagram.png",
        size: "890 KB",
        type: "image",
        uploadedBy: "Priya S.",
        uploadedAt: "Today, 09:15 AM",
        encrypted: true,
        chunks: 2,
    },
    {
        id: "3",
        name: "workspace_key_rotation.ts",
        size: "12 KB",
        type: "code",
        uploadedBy: "You",
        uploadedAt: "Yesterday, 6:42 PM",
        encrypted: true,
        chunks: 1,
    },
    {
        id: "4",
        name: "Q1_2026_Roadmap.pdf",
        size: "1.1 MB",
        type: "pdf",
        uploadedBy: "Rahul N.",
        uploadedAt: "Yesterday, 3:00 PM",
        encrypted: true,
        chunks: 3,
    },
    {
        id: "5",
        name: "design_system_v2.png",
        size: "4.2 MB",
        type: "image",
        uploadedBy: "Priya S.",
        uploadedAt: "Mar 2, 11:00 AM",
        encrypted: true,
        chunks: 9,
    },
    {
        id: "6",
        name: "auth_service.ts",
        size: "8.5 KB",
        type: "code",
        uploadedBy: "Arjun M.",
        uploadedAt: "Mar 1, 2:15 PM",
        encrypted: true,
        chunks: 1,
    },
    {
        id: "7",
        name: "team_assets_v1.zip",
        size: "18.6 MB",
        type: "zip",
        uploadedBy: "You",
        uploadedAt: "Feb 28, 9:00 AM",
        encrypted: true,
        chunks: 38,
    },
];

function FileCard({ file }: { file: FileItem }) {
    const Icon = FILE_ICONS[file.type] || File;
    const colorClass = FILE_COLORS[file.type];

    return (
        <div className="bg-dark rounded-xl border border-surface-border p-4 hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${colorClass}`}>
                    <Icon size={20} />
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all">
                    <MoreHorizontal size={15} />
                </button>
            </div>

            <p className="text-sm font-semibold text-slate-200 mb-1 truncate" title={file.name}>
                {file.name}
            </p>

            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500">{file.size}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-xs font-mono text-slate-500">{file.chunks} chunk{file.chunks > 1 ? "s" : ""}</span>
                <Lock size={9} className="text-accent-400/50 ml-auto" />
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-400">{file.uploadedBy}</p>
                    <p className="text-xs text-slate-500">{file.uploadedAt}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Preview" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all">
                        <Eye size={13} />
                    </button>
                    <button title="Download & Decrypt" className="p-1.5 rounded-lg text-slate-500 hover:text-accent-400 hover:bg-accent-400/10 transition-all">
                        <Download size={13} />
                    </button>
                    <button title="Share" className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-raised transition-all">
                        <Share2 size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function UploadZone() {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const simulateUpload = () => {
        setUploading(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setUploading(false);
                        setProgress(0);
                    }, 800);
                    return 100;
                }
                return p + 12;
            });
        }, 180);
    };

    return (
        <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${dragging
                    ? "border-primary-500 bg-primary-500/5"
                    : "border-surface-border hover:border-primary-500/50 hover:bg-surface-raised/30"
                }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); simulateUpload(); }}
            onClick={simulateUpload}
        >
            {uploading ? (
                <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto">
                        <Lock size={22} className="text-primary-400 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-200 mb-1">
                            {progress < 40 ? "Encrypting chunks..." : progress < 80 ? "Uploading encrypted chunks..." : "Finalizing..."}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">{progress}% complete</p>
                    </div>
                    <div className="w-48 mx-auto h-1.5 bg-surface-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-accent-400/70 font-mono flex items-center justify-center gap-1.5">
                        <Lock size={10} />
                        AES-256-GCM encryption active
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface-raised border border-surface-border flex items-center justify-center mx-auto">
                        <Upload size={22} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-300">Drop files here or click to upload</p>
                        <p className="text-xs text-slate-500 mt-1">Files are encrypted client-side before upload. Max 5GB per file.</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                        <Lock size={11} className="text-accent-400/60" />
                        <span className="font-mono text-accent-400/60">Encrypted before leaving your device</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function VaultPage() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    const filtered = MOCK_FILES.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalSize = "27.2 MB";
    const usedPercent = 1; // 27MB / 5GB free plan

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-slate-100">File Vault</h1>
                    <span className="encrypted-label">
                        <Lock size={10} />
                        Client-Side Encrypted
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-surface-raised border border-surface-border rounded-lg p-0.5">
                        <button
                            onClick={() => setView("grid")}
                            className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-primary-500/20 text-primary-400" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            <Grid size={15} />
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
                            placeholder="Search files..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary gap-1.5">
                        <Plus size={15} />
                        Upload File
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Storage usage */}
                <div className="flex items-center gap-6">
                    <div className="flex-1 bg-surface-DEFAULT rounded-xl border border-surface-border p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                            <HardDrive size={18} className="text-primary-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-semibold text-slate-200">Storage</span>
                                <span className="text-xs text-slate-400 font-mono">{totalSize} / 5 GB</span>
                            </div>
                            <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${usedPercent}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-DEFAULT rounded-xl border border-surface-border p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-400/10 border border-accent-400/20 flex items-center justify-center">
                            <FolderLock size={18} className="text-accent-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-slate-100">{MOCK_FILES.length}</div>
                            <div className="text-xs text-slate-400">Encrypted files</div>
                        </div>
                    </div>
                    <div className="bg-surface-DEFAULT rounded-xl border border-surface-border p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <Shield size={18} className="text-green-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-slate-100">100%</div>
                            <div className="text-xs text-slate-400">Encrypted</div>
                        </div>
                    </div>
                </div>

                {/* Upload zone */}
                <UploadZone />

                {/* Files */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-300">All Files</h2>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock size={12} />
                            Sorted by recent
                        </div>
                    </div>

                    {view === "grid" ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.map((file) => (
                                <FileCard key={file.id} file={file} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-surface-DEFAULT rounded-2xl border border-surface-border overflow-hidden">
                            <div className="grid grid-cols-12 px-4 py-2.5 border-b border-surface-border text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <span className="col-span-5">Name</span>
                                <span className="col-span-2">Size</span>
                                <span className="col-span-2">Chunks</span>
                                <span className="col-span-2">Uploaded by</span>
                                <span className="col-span-1" />
                            </div>
                            {filtered.map((file, i) => {
                                const Icon = FILE_ICONS[file.type] || File;
                                const colorClass = FILE_COLORS[file.type];
                                return (
                                    <div
                                        key={file.id}
                                        className={`grid grid-cols-12 items-center px-4 py-3 hover:bg-surface-raised transition-colors cursor-pointer group ${i < filtered.length - 1 ? "border-b border-surface-border" : ""
                                            }`}
                                    >
                                        <div className="col-span-5 flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg border ${colorClass}`}>
                                                <Icon size={14} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-200 truncate">{file.name}</span>
                                            <Lock size={9} className="text-accent-400/40 flex-shrink-0" />
                                        </div>
                                        <span className="col-span-2 text-xs text-slate-400 font-mono">{file.size}</span>
                                        <span className="col-span-2 text-xs text-slate-400 font-mono">{file.chunks} chunk{file.chunks > 1 ? "s" : ""}</span>
                                        <span className="col-span-2 text-xs text-slate-400">{file.uploadedBy}</span>
                                        <div className="col-span-1 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 rounded text-slate-500 hover:text-accent-400"><Download size={13} /></button>
                                            <button className="p-1 rounded text-slate-500 hover:text-danger"><Trash2 size={13} /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Encryption info */}
                <div className="bg-accent-400/5 border border-accent-400/15 rounded-xl p-4 flex items-start gap-3">
                    <Lock size={16} className="text-accent-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-slate-300 mb-1">How file encryption works</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Each file gets a unique random AES-256-GCM key. Files are split into encrypted chunks before upload.
                            The file key is wrapped with your workspace key. Only your team can decrypt — the server stores ciphertext only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
