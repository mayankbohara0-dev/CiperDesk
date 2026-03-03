"use client";
import Link from "next/link";
import { Shield, Github, ArrowRight } from "lucide-react";

const sections = [
    {
        id: "overview", title: "1. Security Overview",
        content: `CipherDesk is built on a zero-trust architecture: we assume the server is always compromised. Every piece of user data is encrypted on the client device before it is transmitted to our servers. The server stores only ciphertext and minimal metadata required for routing.

Our security model has three core guarantees:
• Server operators cannot read your messages, tasks, or files — ever.
• Compromising the server yields only encrypted blobs, not plaintext.
• We cannot assist law enforcement with message content because we do not possess decryption keys.`,
    },
    {
        id: "key-architecture", title: "2. Key Architecture",
        content: `Each user has two asymmetric keypairs generated locally on first registration:

Ed25519 Signing Keypair
Purpose: Digital signatures for message authenticity.
Generation: WebCrypto API (window.crypto.subtle.generateKey) in the browser.
Storage: Private key stored in IndexedDB, encrypted with a key derived from the user's passphrase via Argon2id.

X25519 Key Exchange Keypair
Purpose: Deriving shared secrets for encrypted sessions (Double Ratchet).
Generation: Same WebCrypto API call.
Storage: Same passphrase-encrypted IndexedDB store.

Workspace Key (AES-256-GCM)
Purpose: Encrypting all workspace content (channel messages, tasks, file metadata).
Generation: Randomly generated on workspace creation.
Distribution: Encrypted with each member's X25519 public key using ECDH + HKDF, then stored server-side per-member.`,
    },
    {
        id: "messaging", title: "3. Messaging Encryption",
        content: `CipherDesk messaging uses a simplified Double Ratchet algorithm inspired by the Signal Protocol:

Per-Session Ratchet
1. Alice and Bob perform X25519 Diffie-Hellman to derive a Root Key.
2. The Root Key is fed into HKDF to derive a Chain Key and a Message Key.
3. Each message uses a unique Message Key (AES-256-GCM, 256-bit, 12-byte nonce).
4. After each message, keys are ratcheted forward — old keys are deleted.

Group Channels
Groups use a Sender Keys scheme: each member generates a group sender key. When sending, the message is encrypted with the sender's group key. The group key is encrypted individually for each member using their X25519 public key.

Key Properties
• Forward secrecy: Past messages cannot be decrypted even if current keys are compromised.
• Break-in recovery: Future messages are safe even after current key compromise.`,
    },
    {
        id: "file-vault", title: "4. File Vault Encryption",
        content: `Files are encrypted using a chunk-based scheme to support streaming decryption and integrity verification:

Encryption Process
1. File is split into 512KB chunks.
2. Each chunk is encrypted with a unique AES-256-GCM key.
3. A File Encryption Key (FEK) wraps all chunk keys.
4. The FEK is wrapped with the workspace key.
5. Encrypted chunks are uploaded to object storage.

Metadata Encryption
File names, sizes, MIME types, and directory structure are all encrypted before upload. 
The server sees only opaque binary blobs and a UUID.

Integrity Verification
Each chunk includes a GCM authentication tag (128-bit). 
A SHA-256 Merkle tree of chunk hashes is computed and stored encrypted.`,
    },
    {
        id: "authentication", title: "5. Authentication & Identity",
        content: `Password Handling
Passwords are never sent to the server. Instead:
1. User enters password.
2. Argon2id (m=64MB, t=3, p=4) derives a 256-bit key from password + random salt.
3. This key encrypts the user's private keys in IndexedDB.
4. A separate Argon2id derivation (different salt) produces a "server auth token."
5. Only the server auth token is sent to the server for authentication.

Two-Factor Authentication
CipherDesk requires TOTP (RFC 6238, SHA-1, 6 digits, 30s window) as a required second factor.
Backup codes are generated locally, stored encrypted.

Device Approval
New device logins require explicit approval from an existing approved device.
The approval process verifies the new device's public key fingerprint via the existing device.`,
    },
    {
        id: "transport", title: "6. Transport Security",
        content: `All communication between clients and servers uses TLS 1.3 with:
• ECDHE key exchange (mandatory)
• AES-256-GCM cipher suite
• Certificate pinning in native clients
• HSTS with 1-year max-age

Real-time messaging uses WebSockets over TLS (wss://). 
Messages are encrypted end-to-end before entering the WebSocket layer.
TLS provides a second layer of encryption in transit.

Note: Because messages are E2E encrypted before TLS, even a TLS compromise would not expose plaintext message content.`,
    },
    {
        id: "threat-model", title: "7. Threat Model",
        content: `Protected Against
✓ Compromised server: Server stores only ciphertext.
✓ Network interception: TLS + E2EE double protection.
✓ Server employee access: Zero-knowledge architecture.
✓ Legal subpoenas: We cannot produce plaintext we do not have.
✓ Brute-force password attacks: Argon2id rate-limits guessing.

Not Protected Against
✗ Compromised client device: If your device is malware-infected, your keys can be stolen.
✗ Compromised user: A user with legitimate access can exfiltrate content they can decrypt.
✗ Metadata: CipherDesk minimizes but cannot eliminate all metadata (e.g., message timing).`,
    },
    {
        id: "audit", title: "8. Security Audit",
        content: `Phase 3 audit is planned and will be conducted by an independent third-party security firm.

Planned Scope
• Cryptographic implementation review
• WebCrypto API usage audit
• Key storage and lifecycle review
• Network protocol analysis
• WebSocket security review
• Dependency vulnerability scan

Commitment
• Full audit report will be published publicly.
• All critical and high findings will be fixed before any report publication.
• A responsible disclosure policy (security@cipherdesk.io) is active.`,
    },
];

export default function SecurityPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#030711" }} className="mesh-bg grid-bg">
            {/* Nav */}
            <header style={{ position: "sticky", top: 0, background: "rgba(3,7,17,.9)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,.06)", zIndex: 50 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(99,102,241,.4)" }}>
                            <Shield size={14} style={{ color: "#fff" }} />
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>
                            CipherDesk
                        </span>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <a href="https://github.com/mayankbohara0-dev/CiperDesk" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ gap: 7, fontSize: 13 }}>
                            <Github size={15} />View Source
                        </a>
                        <Link href="/auth/register" className="btn-primary" style={{ fontSize: 13, padding: "8px 18px" }}>
                            Get Started <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 100px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 48, alignItems: "start" }}>

                {/* TOC */}
                <nav style={{ position: "sticky", top: 84, background: "rgba(12,24,50,.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px 12px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#475569", marginBottom: 10, padding: "0 8px" }}>Contents</p>
                    {sections.map(s => (
                        <a key={s.id} href={`#${s.id}`} style={{
                            display: "block", padding: "7px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                            color: "#64748B", textDecoration: "none", transition: "all .15s",
                            lineHeight: 1.4,
                        }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#CBD5E1"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.05)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#64748B"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                            {s.title}
                        </a>
                    ))}
                </nav>

                {/* Main content */}
                <main>
                    {/* Hero */}
                    <div style={{ marginBottom: 48 }}>
                        <span className="badge-accent" style={{ display: "inline-flex", marginBottom: 16 }}>Technical Security Documentation</span>
                        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", lineHeight: 1.15, letterSpacing: "-.02em", marginBottom: 16 }}>
                            CipherDesk Security <span className="text-gradient">Whitepaper</span>
                        </h1>
                        <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.75, maxWidth: 640, marginBottom: 24 }}>
                            A detailed technical reference of CipherDesk&apos;s zero-trust, end-to-end encrypted architecture.
                            Intended for security researchers, CTOs, and privacy-conscious users.
                        </p>

                        {/* Spec cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 8 }}>
                            {[
                                { l: "Key Exchange", v: "X25519" }, { l: "Signatures", v: "Ed25519" },
                                { l: "Symmetric", v: "AES-256-GCM" }, { l: "Hash", v: "SHA-256" },
                                { l: "KDF", v: "HKDF" }, { l: "Password", v: "Argon2id" },
                            ].map(c => (
                                <div key={c.l} style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(12,24,50,.7)", border: "1px solid rgba(255,255,255,.07)", display: "flex", flexDirection: "column", gap: 3 }}>
                                    <span style={{ fontSize: 10, color: "#64748B" }}>{c.l}</span>
                                    <span style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 600, color: "#22D3EE" }}>{c.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sections */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {sections.map(s => (
                            <div key={s.id} id={s.id} style={{ background: "rgba(12,24,50,.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "24px 28px", scrollMarginTop: 100 }}>
                                <h2 style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", marginBottom: 16 }}>{s.title}</h2>
                                <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.85, whiteSpace: "pre-line" }}>
                                    {s.content.split("\n").map((line, i) => {
                                        if (line.startsWith("•") || line.startsWith("✓") || line.startsWith("✗") || line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.") || line.startsWith("5.")) {
                                            return (
                                                <p key={i} style={{ marginBottom: 6, color: line.startsWith("✓") ? "#6EE7B7" : line.startsWith("✗") ? "#FDA4AF" : "#CBD5E1" }}>
                                                    {line}
                                                </p>
                                            );
                                        }
                                        if (line.trim() === "") return <div key={i} style={{ height: 10 }} />;
                                        // Subheadings (lines that are short and followed by content)
                                        if (line.length < 50 && !line.startsWith(" ") && line.endsWith("")) {
                                            const isSubheading = sections.some(() => false) || (line.trim().length > 0 && !line.includes(" ") || line.split(" ").length <= 4);
                                            if (isSubheading && line.length < 40) {
                                                return <p key={i} style={{ fontSize: 13, fontWeight: 700, color: "#818CF8", marginTop: 14, marginBottom: 6, fontFamily: "monospace" }}>{line}</p>;
                                            }
                                        }
                                        return <p key={i} style={{ marginBottom: 6 }}>{line}</p>;
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ marginTop: 24, padding: "24px 28px", borderRadius: 16, background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                        <div>
                            <p style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 4 }}>Found a security issue?</p>
                            <p style={{ fontSize: 13, color: "#94A3B8" }}>We have a responsible disclosure program. Report privately and we&apos;ll respond within 48 hours.</p>
                        </div>
                        <a href="mailto:security@cipherdesk.io" className="btn-primary" style={{ gap: 8, whiteSpace: "nowrap" }}>
                            <Shield size={15} />security@cipherdesk.io
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
}
