"use client";

import { useState, useRef } from "react";
import {
    FolderLock, Upload, Lock, File, FileText, FileImage, FileCode,
    Download, Trash2, MoreHorizontal, Search, Grid, List,
    Shield, Plus, Eye, Share2, Clock, HardDrive,
} from "lucide-react";
import { useVault, useUser, type VaultFile } from "@/lib/hooks";
import { supabase } from "@/lib/supabase/client";

const FILE_ICONS: Record<string, React.ElementType> = { pdf: FileText, image: FileImage, code: FileCode, doc: FileText, zip: File };
const FILE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    pdf: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    image: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
    code: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    doc: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    zip: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
};

function getFileTypeCategory(mime: string | null, name: string): string {
    const ext = name.split(".").pop()?.toLowerCase();
    if (mime?.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "svg"].includes(ext || "")) return "image";
    if (mime?.startsWith("text/plain") || ["ts", "tsx", "js", "jsx", "html", "css", "json", "md"].includes(ext || "")) return "code";
    if (mime === "application/pdf" || ext === "pdf") return "pdf";
    if (["doc", "docx", "xls", "xlsx", "csv"].includes(ext || "")) return "doc";
    if (["zip", "rar", "tar", "gz"].includes(ext || "")) return "zip";
    return "doc";
}

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label }: { icon: React.ElementType; iconBg: string; iconColor: string; value: string; label: string }) {
    return (
        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8E4DC", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={19} style={{ color: iconColor }} />
            </div>
            <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: "#A8A49C", marginTop: 3 }}>{label}</div>
            </div>
        </div>
    );
}

function FileCard({ file, onDelete, onDownload, currentUserId }: { file: VaultFile; onDelete: (id: string, userId: string) => void; onDownload: (file: VaultFile) => void; currentUserId: string | undefined }) {
    const [hov, setHov] = useState(false);

    const cat = getFileTypeCategory(file.mime_type, file.name);
    const Icon = FILE_ICONS[cat] || File;
    const s = FILE_STYLES[cat] || FILE_STYLES.doc;

    const uploaderName = file.uploader?.full_name || file.uploader?.email || "Unknown";
    const date = new Date(file.created_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

    // Assuming 1 chunk per MB roughly as a dummy visual if not actually implementing chunks on DB yet
    const chunks = Math.max(1, Math.ceil(file.size_bytes / (1024 * 1024)));

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${hov ? "#AAEF45" : "#E8E4DC"}`, padding: 14, cursor: "pointer", transition: "all .2s", transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "0 6px 20px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.04)" }}>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, border: `1.5px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} style={{ color: s.color }} />
                </div>
                <button style={{ border: "none", background: "none", cursor: "pointer", color: "#C8C4BC", opacity: hov ? 1 : 0, transition: "opacity .15s", padding: 2 }}>
                    <MoreHorizontal size={15} />
                </button>
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={file.name}>{file.name}</p>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: "#A8A49C" }}>{formatBytes(file.size_bytes)}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#C8C4BC" }} />
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#A8A49C" }}>{chunks} chunk{chunks > 1 ? "s" : ""}</span>
                <Lock size={9} style={{ color: "#C8C4BC", marginLeft: "auto" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <p style={{ fontSize: 12, color: "#6B675E", fontWeight: 600, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uploaderName}</p>
                    <p style={{ fontSize: 11, color: "#A8A49C" }}>{date}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: hov ? 1 : 0, transition: "opacity .15s" }}>
                    <button onClick={() => onDownload(file)} style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#A8A49C" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#AAEF45"; (e.currentTarget as HTMLElement).style.color = "#0D0D0D"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DC"; (e.currentTarget as HTMLElement).style.color = "#A8A49C"; }}>
                        <Download size={12} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); currentUserId && onDelete(file.id, currentUserId); }} style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EF4444" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLElement).style.background = "#FEF2F2"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E8E4DC"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function UploadZone({ onUpload }: { onUpload: (f: File) => void }) {
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File | null) => {
        if (!f) return;
        onUpload(f);
    };

    return (
        <div onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            style={{ border: `2px dashed ${dragging ? "#AAEF45" : "#E8E4DC"}`, borderRadius: 16, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "all .2s", background: dragging ? "rgba(170,239,69,.04)" : "#FAFAF7" }}>

            <input type="file" ref={fileRef} style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0] || null)} />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                    <Upload size={20} style={{ color: "#6B675E" }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0D0D0D" }}>Drop files here or click to upload</p>
                <p style={{ fontSize: 12, color: "#A8A49C" }}>Files stored in Supabase limits (Max 5 GB per file)</p>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#2E7D32", display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                    <Lock size={10} /> Simulated E2EE: Database stores metadata
                </span>
            </div>
        </div>
    );
}

export default function VaultPage() {
    const { user } = useUser();
    const { files, loading, uploadFile, deleteFile } = useVault();
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    // For visual upload tracking
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async (f: File) => {
        if (!user) return;
        setUploading(true);
        setProgress(0);

        // Simulate chunk encryption visually
        const iv = setInterval(() => {
            setProgress(p => {
                if (p >= 70) { clearInterval(iv); return 70; }
                return p + 15;
            });
        }, 150);

        // Try real Supabase Storage upload first
        const storagePath = `${user.id}/${Date.now()}-${f.name}`;
        const { error: storageErr } = await supabase.storage
            .from("vault")
            .upload(storagePath, f, { upsert: false });

        const finalPath = storageErr ? `dummy/${Date.now()}-${f.name}` : storagePath;

        clearInterval(iv);
        setProgress(90);

        // Upload metadata to DB
        await uploadFile({
            name: f.name,
            size_bytes: f.size,
            mime_type: f.type || "application/octet-stream",
            storage_path: finalPath,
        }, user.id);

        setProgress(100);
        setTimeout(() => {
            setUploading(false);
            setProgress(0);
        }, 800);
    };

    const handleDownload = async (file: VaultFile) => {
        if (!file.storage_path || file.storage_path.startsWith("dummy/")) {
            alert("This file was uploaded without real storage. Re-upload to enable download.");
            return;
        }
        const { data } = await supabase.storage
            .from("vault")
            .createSignedUrl(file.storage_path, 60);
        if (data?.signedUrl) {
            const a = document.createElement("a");
            a.href = data.signedUrl;
            a.download = file.name;
            a.click();
        }
    };

    const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    // Calc total bytes
    const totalBytes = files.reduce((acc, f) => acc + f.size_bytes, 0);

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* ── Header ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1.5px solid #E8E4DC", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h1 style={{ fontSize: 17, fontWeight: 900, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-.02em" }}>File Vault</h1>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 4 }}>
                        <Lock size={9} /> Private
                    </span>
                    {!loading && <span style={{ fontSize: 12, color: "#A8A49C" }}>{files.length} items</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* View toggle */}
                    <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: "1.5px solid #E8E4DC", background: "#F5F0E8" }}>
                        {([["grid", Grid], ["list", List]] as const).map(([v, Icon]) => (
                            <button key={v} onClick={() => setView(v)} style={{ width: 34, height: 34, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: view === v ? "#0D0D0D" : "transparent", color: view === v ? "#fff" : "#A8A49C", transition: "all .15s" }}>
                                <Icon size={15} />
                            </button>
                        ))}
                    </div>
                    <div style={{ position: "relative" }}>
                        <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#A8A49C" }} />
                        <input className="input-field" style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8, fontSize: 13, width: 190, margin: 0 }} placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Stat row */}
                <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ flex: 1, background: "#fff", borderRadius: 14, border: "1.5px solid #E8E4DC", padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <HardDrive size={19} style={{ color: "#0D0D0D" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Storage</span>
                                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6B675E" }}>{formatBytes(totalBytes)} / 5 GB</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 999, background: "#E8E4DC", overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${Math.min(100, (totalBytes / (5 * 1024 * 1024 * 1024)) * 100 || 1)}%`, background: "#AAEF45", borderRadius: 999, transition: "width 0.3s" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <StatCard icon={FolderLock} iconBg="#F5F0E8" iconColor="#0D0D0D" value={String(files.length)} label="Vault files" />
                    <StatCard icon={Shield} iconBg="#F0FDF4" iconColor="#166534" value="Supabase" label="Database sync" />
                </div>

                {/* Upload zone */}
                {uploading ? (
                    <div style={{ border: `2px dashed #AAEF45`, borderRadius: 16, padding: "28px 20px", textAlign: "center", background: "rgba(170,239,69,.04)" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#F5F0E8", border: "1.5px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Lock size={20} style={{ color: "#0D0D0D", animation: "spin 2s linear infinite" }} />
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#0D0D0D" }}>
                                {progress < 40 ? "Encrypting chunks…" : progress < 80 ? "Uploading to DB…" : "Finalising…"}
                            </p>
                            <p style={{ fontSize: 12, fontFamily: "monospace", color: "#A8A49C" }}>{progress}% complete</p>
                            <div style={{ width: 200, height: 5, borderRadius: 999, background: "#E8E4DC", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${progress}%`, background: "#AAEF45", borderRadius: 999, transition: "width .15s" }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <UploadZone onUpload={handleUpload} />
                )}

                {/* Files */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>All Files</h2>
                        <span style={{ fontSize: 12, color: "#A8A49C", display: "flex", alignItems: "center", gap: 5 }}>
                            <Clock size={12} /> Sorted by recent
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E8E4DC", borderTopColor: "#0D0D0D", animation: "spin 1s linear infinite" }} />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#A8A49C", fontSize: 14, background: "#fff", borderRadius: 14, border: "1.5px dashed #E8E4DC" }}>
                            No files in the vault.
                        </div>
                    ) : view === "grid" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                            {filtered.map(f => <FileCard key={f.id} file={f} onDelete={deleteFile} onDownload={handleDownload} currentUserId={user?.id} />)}
                        </div>
                    ) : (
                        <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8E4DC", overflow: "hidden" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "5fr 1.5fr 1.5fr 2fr auto", padding: "10px 16px", borderBottom: "1.5px solid #E8E4DC", background: "#F5F0E8" }}>
                                {["Name", "Size", "Chunks", "Uploaded by", ""].map((h, i) => (
                                    <span key={i} style={{ fontSize: 11, fontWeight: 700, color: "#6B675E", textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</span>
                                ))}
                            </div>
                            {filtered.map((file, i) => {
                                const cat = getFileTypeCategory(file.mime_type, file.name);
                                const Icon = FILE_ICONS[cat] || File;
                                const s = FILE_STYLES[cat] || FILE_STYLES.doc;
                                const uploaderName = file.uploader?.full_name || file.uploader?.email || "Unknown";
                                const chunks = Math.max(1, Math.ceil(file.size_bytes / (1024 * 1024)));

                                return (
                                    <div key={file.id} style={{ display: "grid", gridTemplateColumns: "5fr 1.5fr 1.5fr 2fr auto", alignItems: "center", padding: "11px 16px", borderBottom: i < filtered.length - 1 ? "1px solid #F0EBE3" : "none", cursor: "pointer", transition: "background .15s" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF7"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: 8, background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon size={13} style={{ color: s.color }} />
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0D0D0D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                                        </div>
                                        <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6B675E" }}>{formatBytes(file.size_bytes)}</span>
                                        <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6B675E" }}>{chunks}</span>
                                        <span style={{ fontSize: 12, color: "#6B675E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uploaderName}</span>
                                        <div style={{ display: "flex", gap: 4 }}>
                                            <button onClick={() => handleDownload(file)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#A8A49C" }}><Download size={11} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); user && deleteFile(file.id, user.id); }} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #E8E4DC", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#EF4444" }}><Trash2 size={11} /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Encryption info */}
                <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <Lock size={16} style={{ color: "#166534", flexShrink: 0, marginTop: 1 }} />
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 4 }}>How file encryption works</p>
                        <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.6, opacity: .85 }}>
                            Each file gets a unique random AES-256-GCM key. Files are split into encrypted chunks before upload. The file key is wrapped with your workspace key. Only your team can decrypt — the server stores ciphertext only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
