"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Shield, Lock, Zap, MessageSquare, CheckSquare, FolderLock,
  Sparkles, ChevronRight, ArrowRight, Star, Menu, X,
  Eye, EyeOff, KeyRound, Cpu, Globe, Check, Github,
  Twitter, Terminal, Layers, Fingerprint,
} from "lucide-react";

/* ── Particle dot component ───────────────────── */
function Orb({ size, x, y, color, delay }: { size: number; x: string; y: string; color: string; delay: string }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, borderRadius: "50%",
      background: color, filter: `blur(${size * 1.5}px)`,
      opacity: 0.35, animationDelay: delay,
      animation: "float 8s ease-in-out infinite",
    }} />
  );
}

/* ── Encrypted typing text ────────────────────── */
function EncryptedTag() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 14px", borderRadius: 100,
      background: "rgba(6,182,212,.07)",
      border: "1px solid rgba(6,182,212,.18)",
      fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
      color: "rgba(34,211,238,.8)", letterSpacing: ".04em",
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse-dot 2s ease-in-out infinite" }} />
      Zero-trust · Zero-knowledge · Signal-grade E2EE
    </div>
  );
}

/* ── Sticky Navbar ───────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
    { label: "Roadmap", href: "#roadmap" },
  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all .3s",
      ...(scrolled ? {
        background: "rgba(3,7,17,.85)",
        backdropFilter: "blur(24px) saturate(160%)",
        borderBottom: "1px solid rgba(255,255,255,.07)",
        boxShadow: "0 4px 32px rgba(0,0,0,.4)"
      } : {}),
    }}>
      <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(99,102,241,.5)",
          }}>
            <Shield size={17} style={{ color: "#fff" }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#F8FAFC" }}>
            Cipher<span className="text-gradient">Desk</span>
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 2, listStyle: "none" }} className="hidden md:flex">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              padding: "8px 16px", borderRadius: 8,
              fontSize: 14, fontWeight: 500, color: "#94A3B8",
              textDecoration: "none", transition: "all .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F1F5F9"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#94A3B8"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden md:flex">
          <Link href="/auth/login" className="btn-ghost" style={{ fontSize: 14 }}>Sign in</Link>
          <Link href="/auth/register" className="btn-primary" style={{ fontSize: 14, padding: "9px 20px", borderRadius: 10 }}>
            Get Started <ChevronRight size={15} />
          </Link>
        </div>

        <button className="btn-ghost md:hidden" style={{ padding: "8px" }} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div style={{ background: "rgba(3,7,17,.97)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "12px 24px 20px" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "12px 8px", fontSize: 15, color: "#94A3B8", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <Link href="/auth/login" className="btn-secondary" style={{ justifyContent: "center" }}>Sign in</Link>
            <Link href="/auth/register" className="btn-primary" style={{ justifyContent: "center" }}>Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── App Mockup ──────────────────────────────── */
function AppMockup() {
  const msgs = [
    { av: "AM", c: "#6366F1", n: "Arjun M.", t: "10:32", m: "Pushed auth flow. Review when you get a chance 🚀" },
    { av: "PS", c: "#8B5CF6", n: "Priya S.", t: "10:34", m: "On it! Converting the deploy issue to a task →" },
    { av: "Y", c: "#06B6D4", n: "You", t: "10:35", m: "Done, Kanban card created with P1 priority." },
  ];
  return (
    <div style={{
      position: "relative", borderRadius: 20, overflow: "hidden",
      background: "rgba(6,13,31,.9)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,.08)",
      boxShadow: "0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(99,102,241,.15), inset 0 1px 0 rgba(255,255,255,.05)",
    }}>
      {/* Title bar */}
      <div style={{ height: 48, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, background: "rgba(12,24,50,.9)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: .8 }} />)}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "4px 14px", borderRadius: 7, background: "rgba(3,7,17,.8)", fontSize: 11, fontFamily: "monospace", color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}>
            🔒 <span>app.cipherdesk.io</span>
          </div>
        </div>
        <span className="encrypted-label"><Lock size={9} />E2E</span>
      </div>

      <div style={{ display: "flex", height: 420 }}>
        {/* Icon rail */}
        <div style={{ width: 52, flexShrink: 0, background: "rgba(3,7,17,.95)", borderRight: "1px solid rgba(255,255,255,.05)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 0" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(99,102,241,.4)", marginBottom: 4 }}>
            <Shield size={14} style={{ color: "#fff" }} />
          </div>
          <div style={{ height: 1, width: 24, background: "rgba(255,255,255,.06)" }} />
          {[MessageSquare, CheckSquare, FolderLock].map((Icon, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
              background: i === 0 ? "rgba(99,102,241,.2)" : "transparent",
              color: i === 0 ? "#818CF8" : "#475569",
              border: i === 0 ? "1px solid rgba(99,102,241,.3)" : "1px solid transparent",
            }}>
              <Icon size={16} />
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, background: "rgba(6,13,31,.9)", borderRight: "1px solid rgba(255,255,255,.05)", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }} className="hidden sm:flex">
          <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.04)", borderRadius: 9, marginBottom: 4, border: "1px solid rgba(255,255,255,.07)" }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={10} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0" }}>BuildFast HQ</span>
          </div>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "#475569", padding: "4px 8px", marginTop: 4 }}>Channels</p>
          {["# general", "# engineering", "# design", "# builds"].map((ch, i) => (
            <div key={ch} style={{
              padding: "7px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
              background: i === 0 ? "rgba(99,102,241,.12)" : "transparent",
              color: i === 0 ? "#A5B4FC" : "#64748B",
              border: i === 0 ? "1px solid rgba(99,102,241,.2)" : "1px solid transparent",
            }}>
              {ch}
              {i === 0 && <span style={{ marginLeft: "auto", background: "#6366F1", color: "#fff", fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>}
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "rgba(3,7,17,.97)" }}>
          <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}># general</span>
            <span className="encrypted-label"><Lock size={9} />E2E Encrypted</span>
          </div>
          <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
            {msgs.map(m => (
              <div key={m.n} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                  {m.av}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1" }}>{m.n}</span>
                    <span style={{ fontSize: 10, color: "#475569" }}>{m.t}</span>
                    <Lock size={8} style={{ color: "rgba(6,182,212,.4)" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2, lineHeight: 1.5 }}>{m.m}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, background: "rgba(12,24,50,.8)", border: "1px solid rgba(255,255,255,.07)" }}>
              <Lock size={12} style={{ color: "rgba(6,182,212,.4)" }} />
              <span style={{ fontSize: 12, color: "#475569" }}>Message #general (encrypted)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════ */
export default function LandingPage() {

  const features = [
    {
      icon: MessageSquare, title: "Encrypted Chat", badge: "E2E Encrypted", color: "#6366F1", glow: "rgba(99,102,241,.2)",
      desc: "Double Ratchet protocol. AES-256-GCM per message. 1-to-1 and group channels. Zero server-side plaintext, ever.",
      pts: ["Real-time via WebSockets", "Thread replies + reactions", "Message → Task conversion"]
    },
    {
      icon: CheckSquare, title: "Task Boards", badge: "Zero-Knowledge", color: "#06B6D4", glow: "rgba(6,182,212,.2)",
      desc: "Kanban & list views. Tasks stored as encrypted JSON blobs — the server has no idea what your sprint looks like.",
      pts: ["Kanban + List toggle", "Priority, labels, assignees", "One-click msg → task"]
    },
    {
      icon: FolderLock, title: "File Vault", badge: "Client Encrypted", color: "#8B5CF6", glow: "rgba(139,92,246,.2)",
      desc: "Files split into 512KB chunks, each AES-256-GCM encrypted with a unique key. Reassembled only on authorized devices.",
      pts: ["Per-chunk encryption", "5 GB free / 100 GB Pro", "Secure preview & sharing"]
    },
    {
      icon: Sparkles, title: "AI Digest", badge: "Pro — Local AI", color: "#F59E0B", glow: "rgba(245,158,11,.2)",
      desc: "AI runs after client-side decryption locally. Summarizes threads, extracts decisions, auto-suggests tasks. Server sees nothing.",
      pts: ["Chat summarization", "Decision extraction", "Encrypted digest emails"]
    },
  ];

  const flowSteps = [
    { n: "01", icon: Terminal, t: "Compose", d: "You write on your device." },
    { n: "02", icon: Lock, t: "Encrypt Locally", d: "AES-256-GCM + workspace key." },
    { n: "03", icon: Globe, t: "TLS Transit", d: "Ciphertext travels double-encrypted." },
    { n: "04", icon: Cpu, t: "Server Stores", d: "Only encrypted payload + metadata." },
    { n: "05", icon: Fingerprint, t: "You Decrypt", d: "Only your device can read it." },
  ];

  const cryptoSpecs = [
    { l: "Key Exchange", v: "X25519" }, { l: "Signatures", v: "Ed25519" },
    { l: "Symmetric", v: "AES-256-GCM" }, { l: "Hashing", v: "SHA-256" },
    { l: "KDF", v: "HKDF" }, { l: "Password", v: "Argon2id" },
  ];

  const testimonials = [
    {
      name: "Arjun Mehta", role: "Founder, BuildFast.io", av: "AM", color: "#6366F1",
      text: "Switched from Slack. The encryption-first approach is non-negotiable for us. Message → task conversion saves 30 min a day."
    },
    {
      name: "Priya Sharma", role: "CTO, Stackly", av: "PS", color: "#8B5CF6",
      text: "Signal-level security with a Slack-level interface. No bloat, no ads. Exactly what a dev team needs."
    },
    {
      name: "Rahul Nair", role: "Indie Hacker", av: "RN", color: "#10B981",
      text: "Privacy-first, lightweight, honest pricing. CipherDesk is everything I wished existed for my team."
    },
  ];

  const freeFeatures = ["5 team members", "5 GB encrypted storage", "Encrypted messaging", "Task boards", "Secure file vault"];
  const proFeatures = ["Unlimited members", "100 GB encrypted storage", "AI chat summarization", "AI decision extraction", "Encrypted digest emails", "Device management", "Advanced 2FA", "Priority support", "Audit log"];

  return (
    <div style={{ minHeight: "100vh", background: "#030711", overflowX: "hidden" }} className="mesh-bg grid-bg">
      <Navbar />

      {/* ─── HERO ─────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", overflow: "hidden" }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <Orb size={500} x="10%" y="-10%" color="rgba(99,102,241,.6)" delay="0s" />
          <Orb size={400} x="65%" y="60%" color="rgba(6,182,212,.5)" delay="2s" />
          <Orb size={300} x="45%" y="20%" color="rgba(139,92,246,.4)" delay="4s" />
        </div>

        <div className="animate-in" style={{ position: "relative", textAlign: "center", maxWidth: 860, margin: "0 auto" }}>
          <EncryptedTag />

          <h1 className="hero-heading" style={{ marginTop: 28, marginBottom: 24 }}>
            Your team&apos;s workspace,<br />
            <span className="text-gradient">end-to-end encrypted.</span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "#94A3B8", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.75 }}>
            CipherDesk combines real-time messaging, task boards, and a secure file vault —
            all encrypted on your device. <span style={{ color: "#CBD5E1", fontWeight: 500 }}>The server never sees your data.</span>
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: 16, padding: "14px 28px", borderRadius: 12 }}>
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link href="/app/chat/general" className="btn-secondary" style={{ fontSize: 16, padding: "13px 28px", borderRadius: 12 }}>
              <Eye size={17} /> View Demo
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {["No credit card required", "5 members free forever", "No ads. No tracking."].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748B" }}>
                <Check size={13} style={{ color: "#10B981" }} />{t}
              </span>
            ))}
          </div>
        </div>

        {/* App mockup */}
        <div className="animate-in" style={{ position: "relative", width: "100%", maxWidth: 1000, margin: "64px auto 0", animationDelay: ".2s" }}>
          <AppMockup />
          {/* Reflection glow */}
          <div style={{ position: "absolute", bottom: -32, left: "50%", transform: "translateX(-50%)", width: "70%", height: 40, background: "rgba(99,102,241,.1)", borderRadius: "50%", filter: "blur(20px)" }} />
        </div>
      </section>

      {/* ─── TRUST BAR ─────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(6,13,31,.6)", backdropFilter: "blur(12px)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px 40px" }}>
          {[{ icon: Lock, t: "AES-256-GCM" }, { icon: Shield, t: "Zero-Knowledge" }, { icon: KeyRound, t: "Double Ratchet" }, { icon: EyeOff, t: "No Plaintext Storage" }, { icon: Zap, t: "Real-Time WebSockets" }].map(({ icon: Icon, t }) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748B" }}>
              <Icon size={15} style={{ color: "#06B6D4" }} />{t}
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ──────────────────────────── */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="badge-accent" style={{ marginBottom: 16, display: "inline-flex" }}>Core Features</span>
            <h2 className="section-heading">Everything your startup needs.</h2>
            <p className="section-subheading" style={{ margin: "12px auto 0", textAlign: "center" }}>
              No bloat. No lock-in. Just what small teams actually use — on a cryptographic foundation you can audit.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(480px,1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,.06)",
                borderRadius: 20, padding: 28,
                transition: "all .3s cubic-bezier(.22,1,.36,1)",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-5px)";
                  el.style.borderColor = `rgba(${f.color === "#6366F1" ? "99,102,241" : f.color === "#06B6D4" ? "6,182,212" : f.color === "#8B5CF6" ? "139,92,246" : "245,158,11"},.3)`;
                  el.style.boxShadow = `0 16px 48px rgba(0,0,0,.6), 0 0 40px ${f.glow}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "";
                  el.style.borderColor = "rgba(255,255,255,.06)";
                  el.style.boxShadow = "";
                }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.glow}`, border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 20px ${f.glow}` }}>
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9" }}>{f.title}</h3>
                      <span className="badge-ghost" style={{ fontSize: 10 }}>{f.badge}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.65 }}>{f.desc}</p>
                  </div>
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.05)" }}>
                  {f.pts.map(p => (
                    <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#CBD5E1" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECURITY ──────────────────────────── */}
      <section id="security" style={{ padding: "100px 24px", background: "rgba(6,13,31,.6)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="badge-primary" style={{ marginBottom: 16, display: "inline-flex" }}>Zero-Trust Architecture</span>
            <h2 className="section-heading">The server never<br />sees your data.</h2>
            <p className="section-subheading" style={{ margin: "12px auto 0", textAlign: "center" }}>
              Every message is encrypted on your device before transit. We&apos;re physically incapable of reading your conversations.
            </p>
          </div>

          {/* Flow */}
          <div style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap", justifyContent: "center" }}>
            {flowSteps.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 140 }}>
                <div style={{
                  flex: 1, padding: "20px 16px", borderRadius: 16, textAlign: "center",
                  background: "rgba(12,24,50,.75)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,.07)",
                  transition: "all .3s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,.35)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,102,241,.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.07)"; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "#475569", marginBottom: 10 }}>{s.n}</div>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <s.icon size={17} style={{ color: "#818CF8" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0", marginBottom: 4 }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>{s.d}</div>
                </div>
                {i < flowSteps.length - 1 && (
                  <ArrowRight size={14} style={{ color: "rgba(99,102,241,.4)", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Crypto specs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            {cryptoSpecs.map(c => (
              <div key={c.l} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 18px", borderRadius: 12,
                background: "rgba(3,7,17,.9)", border: "1px solid rgba(255,255,255,.06)",
              }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>{c.l}</span>
                <span style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 600, color: "#22D3EE" }}>{c.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 className="section-heading">Trusted by indie founders</h2>
            <p className="section-subheading" style={{ margin: "12px auto 0", textAlign: "center" }}>Built for the privacy-conscious startup community.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{
                background: "rgba(12,24,50,.65)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: 28,
                transition: "all .3s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,.06)"; }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
                </div>
                <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.75, marginBottom: 20 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: `0 0 16px ${t.color}55` }}>
                    {t.av}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────── */}
      <section id="pricing" style={{ padding: "100px 24px", background: "rgba(6,13,31,.6)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="badge-accent" style={{ display: "inline-flex", marginBottom: 16 }}>Pricing</span>
            <h2 className="section-heading">Simple, honest pricing.</h2>
            <p className="section-subheading" style={{ margin: "12px auto 0", textAlign: "center" }}>No tricks. No data selling. Revenue from subscriptions only.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Free */}
            <div style={{ background: "rgba(12,24,50,.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column" }}>
              <span className="badge-ghost" style={{ display: "inline-flex", marginBottom: 20 }}>Free Forever</span>
              <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", lineHeight: 1 }}>₹0</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6, marginBottom: 28 }}>Up to 5 members</div>
              <ul style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {freeFeatures.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94A3B8" }}>
                    <Check size={15} style={{ color: "#10B981", flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-secondary" style={{ justifyContent: "center" }}>Get Started Free</Link>
            </div>

            {/* Pro */}
            <div style={{ position: "relative", padding: 1, borderRadius: 21, background: "linear-gradient(135deg, rgba(99,102,241,.6), rgba(6,182,212,.3), rgba(99,102,241,.2))", display: "flex" }}>
              <span className="badge-primary" style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", boxShadow: "0 0 20px rgba(99,102,241,.4)" }}>Most Popular</span>
              <div style={{ background: "rgba(8,16,40,.97)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", flex: 1 }}>
                <span className="badge-primary" style={{ display: "inline-flex", marginBottom: 20 }}>Pro Plan</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", color: "#F1F5F9", lineHeight: 1 }}>₹299</span>
                  <span style={{ fontSize: 14, color: "#94A3B8" }}>/user/mo</span>
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 6, marginBottom: 28 }}>Billed monthly · Cancel anytime</div>
                <ul style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {proFeatures.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#CBD5E1" }}>
                      <Check size={15} style={{ color: "#818CF8", flexShrink: 0 }} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className="btn-primary" style={{ justifyContent: "center" }}>
                  Start Pro Trial <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROADMAP ───────────────────────────── */}
      <section id="roadmap" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="badge-ghost" style={{ display: "inline-flex", marginBottom: 16 }}>Roadmap</span>
            <h2 className="section-heading">Built in public.</h2>
            <p className="section-subheading" style={{ margin: "12px auto 0", textAlign: "center" }}>Three focused phases. No scope creep. No VC-bloat.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { phase: "Phase 1", t: "Encrypted Chat + Tasks", badge: "badge-primary", s: "In Progress", items: ["E2E encrypted messaging", "Group channels", "Message → Task", "Kanban board"] },
              { phase: "Phase 2", t: "AI Layer + File Vault", badge: "badge-ghost", s: "Coming Soon", items: ["AI summarization", "Auto task detection", "Secure vault", "File chunking"] },
              { phase: "Phase 3", t: "Mobile + Security Audit", badge: "badge-ghost", s: "Planned", items: ["React Native app", "Security audit", "Whitepaper", "Compliance tools"] },
            ].map(r => (
              <div key={r.phase} style={{ background: "rgba(12,24,50,.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 18, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#475569" }}>{r.phase}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#E2E8F0" }}>{r.t}</h3>
                  </div>
                  <span className={r.badge}>{r.s}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {r.items.map(item => <span key={item} className="badge-ghost" style={{ fontSize: 11 }}>{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", boxShadow: "0 0 48px rgba(99,102,241,.55)" }} className="animate-float">
            <Shield size={32} style={{ color: "#fff" }} />
          </div>
          <h2 className="section-heading" style={{ marginBottom: 16 }}>Ready to encrypt<br />your workflow?</h2>
          <p className="section-subheading" style={{ margin: "0 auto 36px", textAlign: "center" }}>
            Start free. No credit card needed. First 5 team members are on us, forever.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: 16, padding: "14px 28px", borderRadius: 12 }}>
              Create Workspace <ArrowRight size={18} />
            </Link>
            <Link href="/app/chat/general" className="btn-secondary" style={{ fontSize: 16, padding: "13px 28px", borderRadius: 12 }}>
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={13} style={{ color: "#fff" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "#CBD5E1" }}>CipherDesk</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {["Privacy Policy", "Security", "Terms", "Contact", "Docs"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", transition: "color .15s" }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "#CBD5E1"}
                onMouseLeave={e => (e.target as HTMLElement).style.color = "#64748B"}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="https://github.com/mayankbohara0-dev/CiperDesk" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: 8 }}><Github size={18} /></a>
            <a href="#" className="btn-ghost" style={{ padding: 8 }}><Twitter size={18} /></a>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "20px auto 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.04)", textAlign: "center", fontSize: 12, color: "#475569" }}>
          © 2026 CipherDesk. No ads. No data selling. Revenue from subscriptions only. Built for privacy-first founders.
        </div>
      </footer>
    </div>
  );
}
