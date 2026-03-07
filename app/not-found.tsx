"use client";

import Link from "next/link";
import { Shield, Home, Lock } from "lucide-react";

export default function NotFound() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--cream)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "Inter, sans-serif",
        }}>
            {/* Lime accent blob */}
            <div style={{
                position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
                width: 500, height: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(170,239,69,.3) 0%, transparent 70%)",
                pointerEvents: "none", filter: "blur(80px)",
            }} />

            <div className="animate-in" style={{ position: "relative", textAlign: "center", maxWidth: 480 }}>

                {/* Big 404 */}
                <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
                    <div style={{
                        fontSize: "9rem", fontWeight: 900,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: "var(--grey-2)",
                        lineHeight: 1, userSelect: "none", letterSpacing: "-.04em",
                    }}>
                        404
                    </div>
                    <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 22,
                            background: "#fff", border: "1.5px solid var(--grey-2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "var(--shadow-md)",
                        }}>
                            <Lock size={36} style={{ color: "#0D0D0D" }} />
                        </div>
                    </div>
                </div>

                <h1 style={{
                    fontSize: 28, fontWeight: 900,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#0D0D0D", letterSpacing: "-.03em",
                    marginBottom: 12,
                }}>
                    Page not found
                </h1>
                <p style={{ fontSize: 15, color: "#6B675E", lineHeight: 1.7, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
                    This page is either encrypted beyond reach, or it simply doesn&apos;t exist.
                    Either way, you&apos;re in the clear.
                </p>

                {/* Encrypted flavor badge */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 16px", borderRadius: 999,
                    background: "#fff", border: "1.5px solid var(--grey-2)",
                    fontSize: 12, fontFamily: "monospace", color: "#6B675E",
                    boxShadow: "var(--shadow-sm)", marginBottom: 36,
                }}>
                    <Lock size={11} style={{ color: "#AAEF45" }} />
                    <span>Error: <span style={{ color: "#0D0D0D", fontWeight: 700 }}>0x404</span> — Plaintext not found</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                    <Link href="/" className="btn-primary" style={{ fontSize: 14, padding: "11px 22px" }}>
                        <Home size={15} />
                        Back to Home
                    </Link>
                    <Link href="/app/chat/general" className="btn-dark" style={{ fontSize: 14, padding: "11px 22px" }}>
                        <Shield size={15} />
                        Open App
                    </Link>
                </div>
            </div>
        </div>
    );
}
