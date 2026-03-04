"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Shield, Lock, MessageSquare, CheckSquare, FolderLock,
  Sparkles, ArrowRight, Star, Menu, X,
  Eye, KeyRound, Check, Github, Twitter, ArrowUpRight,
  Zap, Users, BarChart2, ChevronRight,
} from "lucide-react";

/* ── Navbar ───────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Product", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
    { label: "Roadmap", href: "#roadmap" },
  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all .3s",
      background: scrolled ? "rgba(245,240,232,.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(13,13,13,.08)" : "1px solid transparent",
    }}>
      <nav style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 28px",
        height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={16} style={{ color: "#AAEF45" }} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D", letterSpacing: "-.02em" }}>
            CipherDesk
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              padding: "8px 14px", borderRadius: 8,
              fontSize: 14, fontWeight: 500, color: "#6B675E",
              textDecoration: "none", transition: "all .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#0D0D0D"; (e.currentTarget as HTMLElement).style.background = "rgba(13,13,13,.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#6B675E"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/auth/login" style={{ padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 600, color: "#0D0D0D", textDecoration: "none", transition: "all .15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(13,13,13,.07)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
            Sign in
          </Link>
          <Link href="/auth/register" className="btn-primary" style={{ fontSize: 14, padding: "9px 20px" }}>
            Get started <ChevronRight size={14} />
          </Link>
          <button className="btn-ghost" style={{ padding: 8, display: "none" }} id="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ background: "rgba(245,240,232,.98)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(13,13,13,.08)", padding: "12px 24px 20px" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              style={{ display: "block", padding: "12px 8px", fontSize: 15, color: "#2D2D2D", textDecoration: "none" }}>
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

/* ── App Mockup (phone-style) ─────────────────── */
function AppMockup() {
  return (
    <div style={{
      width: 280, height: 480,
      borderRadius: 36,
      background: "#fff",
      border: "8px solid #0D0D0D",
      boxShadow: "0 32px 80px rgba(13,13,13,.25), 0 0 0 1px rgba(13,13,13,.1)",
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
    }}>
      {/* Status bar */}
      <div style={{ height: 36, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>9:41</span>
        <div style={{ width: 80, height: 18, borderRadius: 20, background: "#1A1A1A" }} />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{ width: 14, height: 9, borderRadius: 2, border: "1.5px solid #fff", opacity: .7, position: "relative" }}>
            <div style={{ position: "absolute", inset: 1, background: "#fff", borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* App content */}
      <div style={{ padding: "16px 14px", background: "#F5F0E8", flex: 1 }}>
        <p style={{ fontSize: 10, color: "#6B675E", marginBottom: 4 }}>Welcome back</p>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0D0D0D", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 14, letterSpacing: "-.02em" }}>
          BuildFast HQ
        </h3>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            { Icon: MessageSquare, label: "Chat", bg: "#AAEF45" },
            { Icon: CheckSquare, label: "Tasks", bg: "#0D0D0D" },
            { Icon: FolderLock, label: "Vault", bg: "#EDE8DE" },
          ].map(({ Icon, label, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 14, padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <Icon size={16} style={{ color: bg === "#0D0D0D" ? "#fff" : bg === "#EDE8DE" ? "#2D2D2D" : "#0D0D0D" }} />
              <span style={{ fontSize: 9, fontWeight: 600, color: bg === "#0D0D0D" ? "#fff" : "#0D0D0D" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Messages */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 10, border: "1px solid #EDEDEA" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#0D0D0D" }}># general</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 3, background: "#EDEDEA", borderRadius: 20, padding: "2px 6px" }}>
              <Lock size={7} />
              <span style={{ fontSize: 7, fontFamily: "monospace" }}>E2E</span>
            </div>
          </div>
          {[
            { av: "AM", c: "#AAEF45", tc: "#0D0D0D", n: "Arjun", m: "Auth flow is ready 🚀" },
            { av: "PS", c: "#0D0D0D", tc: "#fff", n: "Priya", m: "On it! Moving to tasks →" },
            { av: "Y", c: "#EDE8DE", tc: "#0D0D0D", n: "You", m: "Done, Kanban card created." },
          ].map(m => (
            <div key={m.n} style={{ display: "flex", gap: 7, marginBottom: 7 }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: m.tc, flexShrink: 0 }}>{m.av}</div>
              <div>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#0D0D0D" }}>{m.n}</span>
                <p style={{ fontSize: 9, color: "#6B675E", lineHeight: 1.4 }}>{m.m}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div style={{ marginTop: 8, background: "#fff", border: "1.5px solid #EDEDEA", borderRadius: 12, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          <Lock size={9} style={{ color: "#A8A49C" }} />
          <span style={{ fontSize: 9, color: "#A8A49C" }}>Message #general (encrypted)</span>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 52, background: "#fff", borderTop: "1px solid #EDEDEA", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px 8px" }}>
        {[{ Icon: MessageSquare, active: true }, { Icon: CheckSquare, active: false }, { Icon: FolderLock, active: false }, { Icon: Shield, active: false }].map(({ Icon, active }, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Icon size={16} style={{ color: active ? "#0D0D0D" : "#A8A49C" }} />
            {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#AAEF45" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Floating widget cards ──────────────────────── */
function FloatingWidgets() {
  return (
    <>
      {/* User card */}
      <div className="widget-card animate-float" style={{ top: "8%", left: "3%", animationDelay: "0s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#AAEF45", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>AM</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Arjun Mehta</div>
            <div style={{ fontSize: 11, color: "#6B675E" }}>Founder, BuildFast</div>
          </div>
        </div>
      </div>

      {/* Encrypted badge */}
      <div className="widget-card animate-float" style={{ top: "28%", left: "1%", animationDelay: "1s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2E7D32" }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>E2E Encrypted</span>
        </div>
      </div>

      {/* Task card */}
      <div className="widget-card animate-float" style={{ bottom: "18%", left: "2%", animationDelay: ".5s" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#0D0D0D", marginBottom: 8 }}>P1 — Auth Deploy</div>
        <div style={{ background: "#AAEF45", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, textAlign: "center" }}>
          Mark Done ✓
        </div>
      </div>

      {/* Stars rating */}
      <div className="widget-card animate-float" style={{ top: "12%", right: "2%", animationDelay: "1.5s" }}>
        <div style={{ fontSize: 11, color: "#6B675E", marginBottom: 6 }}>Rated by teams</div>
        <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
          {Array(5).fill(0).map((_, i) => <Star key={i} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D0D0D" }}>4.9 / 5 · 1,200+ teams</div>
      </div>

      {/* Budget / Security spec card */}
      <div className="widget-card animate-float" style={{ bottom: "8%", right: "3%", animationDelay: "2s" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6B675E", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Crypto Stack</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[["ENC", "AES-256-GCM"], ["KX", "X25519"], ["SIG", "Ed25519"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 20, fontSize: 11 }}>
              <span style={{ color: "#A8A49C" }}>{k}</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0D0D0D" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Member card */}
      <div className="widget-card animate-float" style={{ bottom: "35%", right: "1%", animationDelay: ".8s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>PS</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0D0D0D" }}>Priya Sharma</div>
            <div style={{ fontSize: 11, color: "#6B675E" }}>CTO, Stackly</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════════ */
export default function LandingPage() {

  const features = [
    {
      icon: MessageSquare, title: "Encrypted Chat", badge: "E2E",
      desc: "Double Ratchet protocol. AES-256-GCM per message. Real-time channels with zero server-side plaintext, ever.",
      pts: ["Thread replies + reactions", "One-click msg → task", "Real-time via WebSockets"],
      bg: "#AAEF45", textColor: "#0D0D0D",
    },
    {
      icon: CheckSquare, title: "Task Boards", badge: "Zero-Knowledge",
      desc: "Kanban & list views. Tasks stored as encrypted JSON blobs — the server has no idea what your sprint looks like.",
      pts: ["Kanban + List toggle", "Priority + labels + assignees", "Encrypted deadlines"],
      bg: "#0D0D0D", textColor: "#fff",
    },
    {
      icon: FolderLock, title: "File Vault", badge: "Client Encrypted",
      desc: "Files split into 512KB chunks, each AES-256-GCM encrypted. Reassembled only on authorized devices.",
      pts: ["Per-chunk encryption", "5 GB free / 100 GB Pro", "Secure preview & sharing"],
      bg: "#EDE8DE", textColor: "#0D0D0D",
    },
    {
      icon: Sparkles, title: "AI Digest", badge: "Pro — Local AI",
      desc: "AI runs after client-side decryption locally. Summarizes threads, extracts decisions, auto-suggests tasks.",
      pts: ["Chat summarization", "Decision extraction", "Encrypted digest emails"],
      bg: "#AAEF45", textColor: "#0D0D0D",
    },
  ];

  const flowSteps = [
    { n: "01", icon: MessageSquare, t: "You Write", d: "Compose on your device in plaintext." },
    { n: "02", icon: Lock, t: "Local Encrypt", d: "AES-256-GCM + workspace key derivation." },
    { n: "03", icon: Zap, t: "TLS Transit", d: "Encrypted ciphertext travels securely." },
    { n: "04", icon: Shield, t: "Server Stores", d: "Only your encrypted payload + metadata." },
    { n: "05", icon: KeyRound, t: "You Decrypt", d: "Only your device, only your eyes." },
  ];

  const cryptoSpecs = [
    { l: "Key Exchange", v: "X25519" }, { l: "Signatures", v: "Ed25519" },
    { l: "Symmetric", v: "AES-256-GCM" }, { l: "Hashing", v: "SHA-256" },
    { l: "KDF", v: "HKDF" }, { l: "Password", v: "Argon2id" },
  ];

  const testimonials = [
    { name: "Arjun Mehta", role: "Founder, BuildFast.io", av: "AM", text: "Switched from Slack. The encryption-first approach is non-negotiable for us. Message → task conversion saves 30 min/day." },
    { name: "Priya Sharma", role: "CTO, Stackly", av: "PS", text: "Signal-level security with a Slack-level interface. No bloat, no ads. Exactly what a dev team needs." },
    { name: "Rahul Nair", role: "Indie Hacker", av: "RN", text: "Privacy-first, lightweight, honest pricing. CipherDesk is everything I wished existed for my founding team." },
  ];

  const freeFeatures = ["5 team members", "5 GB encrypted storage", "Encrypted messaging", "Task boards", "Secure file vault"];
  const proFeatures = ["Unlimited members", "100 GB encrypted storage", "AI chat summarization", "AI decision extraction", "Encrypted digest emails", "Device management", "Advanced 2FA", "Priority support", "Audit log"];

  const trustLogos = ["BuildFast", "Stackly", "DevLoop", "NovaTech", "Launchpad", "CodeVault", "Prismatic", "Novabase"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", overflowX: "hidden" }}>
      <Navbar />

      {/* ─── HERO ───────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "130px 28px 80px", overflow: "hidden",
      }} className="dot-pattern">

        {/* Lime accent blob */}
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(170,239,69,.35) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(80px)",
        }} />

        <div className="animate-in" style={{ position: "relative", textAlign: "center", maxWidth: 860, margin: "0 auto", zIndex: 2 }}>
          {/* Label pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
            background: "#fff", border: "1px solid var(--grey-2)", borderRadius: 999,
            padding: "7px 16px 7px 10px",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ background: "var(--lime)", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 800, color: "#0D0D0D" }}>NEW</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#6B675E" }}>Signal-grade E2E encryption for your whole team</span>
            <ArrowRight size={13} style={{ color: "#A8A49C" }} />
          </div>

          <h1 className="hero-heading" style={{ marginBottom: 24 }}>
            Your team&apos;s workspace,{" "}
            <span className="underline-lime">encrypted.</span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "#6B675E", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.75 }}>
            CipherDesk combines real-time chat, task boards, and a secure file vault —
            all encrypted on your device. <strong style={{ color: "#0D0D0D" }}>The server never sees your data.</strong>
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>
              Start for free <ArrowRight size={16} />
            </Link>
            <Link href="/app/chat/general" className="btn-dark" style={{ fontSize: 15, padding: "13px 28px" }}>
              <Eye size={15} /> View demo
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
            {["No credit card required", "5 members free forever", "No ads. No tracking."].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#A8A49C" }}>
                <Check size={13} style={{ color: "#2E7D32" }} />{t}
              </span>
            ))}
          </div>
        </div>

        {/* App mockup + floating widgets */}
        <div className="animate-in" style={{
          position: "relative", width: "100%", maxWidth: 900, margin: "72px auto 0",
          display: "flex", justifyContent: "center", animationDelay: ".15s",
        }}>
          <FloatingWidgets />
          <AppMockup />
        </div>
      </section>

      {/* ─── TRUST BAR ──────────────────────────── */}
      <div style={{ background: "#0D0D0D", padding: "20px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#6B675E", whiteSpace: "nowrap", padding: "0 32px", flexShrink: 0 }}>
            Trusted by 1,000s of founders
          </span>
          <div style={{ flex: 1, overflow: "hidden", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <div className="ticker-track">
              {[...trustLogos, ...trustLogos].map((logo, i) => (
                <span key={i} style={{ fontSize: 14, fontWeight: 700, color: "#4A4740", padding: "0 36px", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: ".05em" }}>
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TAB SECTION ────────────────────────── */}
      <section style={{ padding: "80px 28px 60px", background: "#0D0D0D" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 64, background: "rgba(255,255,255,.06)", borderRadius: 999, padding: 4, width: "fit-content" }}>
            {["Chat", "Tasks", "Vault"].map((tab, i) => (
              <button key={tab} style={{
                padding: "8px 24px", borderRadius: 999, fontSize: 14, fontWeight: 700,
                background: i === 0 ? "var(--lime)" : "transparent",
                color: i === 0 ? "#0D0D0D" : "#6B675E",
                border: "none", cursor: "pointer", transition: "all .2s",
              }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#6B675E", marginBottom: 16, display: "block" }}>Encrypted Messaging</span>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff", letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: 20 }}>
                Real-time chat with zero plaintext leaks
              </h2>
              <p style={{ fontSize: 15, color: "#6B675E", lineHeight: 1.75, marginBottom: 32 }}>
                Every message is encrypted on your device using AES-256-GCM before it ever touches our servers. We are <strong style={{ color: "#A8A49C" }}>physically incapable</strong> of reading your conversations.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Double Ratchet protocol (Signal-grade)", "Per-message unique encryption keys", "Message → Task conversion in one click", "Thread replies, reactions & file sharing"].map(pt => (
                  <div key={pt} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Check size={12} style={{ color: "#0D0D0D" }} />
                    </div>
                    <span style={{ fontSize: 14, color: "#A8A49C" }}>{pt}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 36 }}>
                <Link href="/app/chat/general" className="btn-primary" style={{ fontSize: 14 }}>
                  Try it live <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Mini chat preview */}
            <div style={{ background: "#1A1A1A", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}># general</span>
                <div style={{ background: "rgba(170,239,69,.15)", border: "1px solid rgba(170,239,69,.3)", borderRadius: 999, padding: "3px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                  <Lock size={10} style={{ color: "var(--lime)" }} />
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--lime)" }}>E2E Encrypted</span>
                </div>
              </div>
              {[
                { av: "AM", c: "var(--lime)", tc: "#0D0D0D", n: "Arjun Mehta", t: "10:32", m: "Pushed auth flow. Review when you get a chance 🚀" },
                { av: "PS", c: "#fff", tc: "#0D0D0D", n: "Priya Sharma", t: "10:34", m: "On it! Converting the deploy issue to a task →" },
                { av: "Y", c: "#2D2D2D", tc: "#fff", n: "You", t: "10:35", m: "Done. Kanban card created with P1 priority." },
              ].map(m => (
                <div key={m.n} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: m.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: m.tc, flexShrink: 0 }}>{m.av}</div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{m.n}</span>
                      <span style={{ fontSize: 11, color: "#475569" }}>{m.t}</span>
                      <Lock size={9} style={{ color: "rgba(170,239,69,.5)" }} />
                    </div>
                    <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2, lineHeight: 1.5 }}>{m.m}</p>
                  </div>
                </div>
              ))}
              <div style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <Lock size={12} style={{ color: "rgba(170,239,69,.5)" }} />
                <span style={{ fontSize: 12, color: "#475569" }}>Message #general (encrypted)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ──────────────────────── */}
      <section id="features" style={{ padding: "100px 28px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#0D0D0D", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--lime)", textTransform: "uppercase", letterSpacing: ".06em" }}>Everything you need</span>
            </div>
            <h2 className="section-heading">No bloat. Just the goods.</h2>
            <p className="section-subheading" style={{ margin: "16px auto 0", textAlign: "center" }}>
              Chat, tasks, and file vault — all encrypted. Built for startup teams who value privacy.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {features.map((f) => (
              <div key={f.title} className="card-hover" style={{
                background: f.bg, borderRadius: 24, padding: 28,
                border: "1px solid rgba(13,13,13,.08)",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: f.bg === "#0D0D0D" ? "rgba(255,255,255,.08)" : "rgba(13,13,13,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <f.icon size={20} style={{ color: f.textColor }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: f.bg === "#0D0D0D" ? "rgba(255,255,255,.4)" : "rgba(13,13,13,.4)", background: f.bg === "#0D0D0D" ? "rgba(255,255,255,.08)" : "rgba(13,13,13,.06)", borderRadius: 999, padding: "3px 10px" }}>
                    {f.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color: f.textColor, marginBottom: 10, letterSpacing: "-.02em" }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: f.bg === "#0D0D0D" ? "rgba(255,255,255,.55)" : "rgba(13,13,13,.6)", lineHeight: 1.65, marginBottom: 20, flex: 1 }}>{f.desc}</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 7, borderTop: `1px solid ${f.bg === "#0D0D0D" ? "rgba(255,255,255,.08)" : "rgba(13,13,13,.08)"}`, paddingTop: 16 }}>
                  {f.pts.map(p => (
                    <li key={p} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: f.bg === "#0D0D0D" ? "rgba(255,255,255,.65)" : "rgba(13,13,13,.75)" }}>
                      <Check size={13} style={{ color: f.bg === "#0D0D0D" ? "var(--lime)" : "#2E7D32", flexShrink: 0 }} />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECURITY FLOW ──────────────────────── */}
      <section id="security" style={{ padding: "100px 28px", background: "var(--cream-2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--lime)", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
              <Shield size={12} />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Zero-Trust Architecture</span>
            </div>
            <h2 className="section-heading">The server never<br />sees your data.</h2>
            <p className="section-subheading" style={{ margin: "16px auto 0", textAlign: "center" }}>
              Every message is encrypted on your device before transit. We&apos;re physically incapable of reading your conversations.
            </p>
          </div>

          {/* Flow steps */}
          <div style={{ display: "flex", gap: 8, marginBottom: 48, flexWrap: "wrap", justifyContent: "center" }}>
            {flowSteps.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 120 }}>
                <div className="card card-hover" style={{ flex: 1, textAlign: "center", padding: "20px 14px" }}>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "#A8A49C", marginBottom: 10 }}>{s.n}</div>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "#F5F0E8", border: "1px solid var(--grey-3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <s.icon size={17} style={{ color: "#0D0D0D" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#0D0D0D", marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.t}</div>
                  <div style={{ fontSize: 11, color: "#A8A49C", lineHeight: 1.5 }}>{s.d}</div>
                </div>
                {i < flowSteps.length - 1 && (
                  <ArrowRight size={14} style={{ color: "#C8C4BC", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Crypto specs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
            {cryptoSpecs.map(c => (
              <div key={c.l} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", borderRadius: 14,
                background: "#fff", border: "1px solid var(--grey-2)",
                boxShadow: "var(--shadow-sm)",
              }}>
                <span style={{ fontSize: 12, color: "#A8A49C" }}>{c.l}</span>
                <span style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: "#0D0D0D" }}>{c.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────── */}
      <section style={{ padding: "100px 28px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 className="section-heading">Trusted by indie founders</h2>
            <p className="section-subheading" style={{ margin: "16px auto 0", textAlign: "center" }}>Built for privacy-conscious startup teams.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={t.name} className="card-hover" style={{
                background: i === 1 ? "#0D0D0D" : "#fff",
                border: `1px solid ${i === 1 ? "transparent" : "var(--grey-2)"}`,
                borderRadius: 24, padding: 28,
              }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {Array(5).fill(0).map((_, j) => <Star key={j} size={15} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
                </div>
                <p style={{ fontSize: 14, color: i === 1 ? "#A8A49C" : "#6B675E", lineHeight: 1.75, marginBottom: 24 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: i === 0 ? "var(--lime)" : i === 1 ? "var(--lime)" : "var(--cream-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#0D0D0D" }}>
                    {t.av}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: i === 1 ? "#fff" : "#0D0D0D" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "#6B675E" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────── */}
      <section id="pricing" style={{ padding: "100px 28px", background: "var(--cream-2)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--lime)", borderRadius: 999, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Pricing</span>
            </div>
            <h2 className="section-heading">Simple, honest pricing.</h2>
            <p className="section-subheading" style={{ margin: "16px auto 0", textAlign: "center" }}>No tricks. No data selling. Revenue from subscriptions only.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Free */}
            <div className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#A8A49C", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 20 }}>Free Forever</div>
              <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D", lineHeight: 1, letterSpacing: "-.04em" }}>₹0</div>
              <div style={{ fontSize: 13, color: "#A8A49C", marginTop: 6, marginBottom: 28 }}>Up to 5 members</div>
              <ul style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {freeFeatures.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#6B675E" }}>
                    <Check size={15} style={{ color: "#2E7D32", flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-secondary" style={{ justifyContent: "center" }}>Get started free</Link>
            </div>

            {/* Pro */}
            <div style={{ background: "#0D0D0D", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", position: "relative" }}>
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--lime)", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 800, color: "#0D0D0D", whiteSpace: "nowrap" }}>
                Most Popular
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 20 }}>Pro Plan</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff", lineHeight: 1, letterSpacing: "-.04em" }}>₹299</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,.4)" }}>/user/mo</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: 6, marginBottom: 28 }}>Billed monthly · Cancel anytime</div>
              <ul style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {proFeatures.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255,255,255,.65)" }}>
                    <Check size={15} style={{ color: "var(--lime)", flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-primary" style={{ justifyContent: "center" }}>
                Start Pro Trial <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROADMAP ────────────────────────────── */}
      <section id="roadmap" style={{ padding: "100px 28px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 className="section-heading">Built in public.</h2>
            <p className="section-subheading" style={{ margin: "16px auto 0", textAlign: "center" }}>Three focused phases. No scope creep. No VC-bloat.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { phase: "Phase 1", t: "Encrypted Chat + Tasks", status: "Live", bg: "var(--lime)", items: ["E2E encrypted messaging", "Group channels", "Message → Task", "Kanban board"] },
              { phase: "Phase 2", t: "AI Layer + File Vault", status: "Coming Soon", bg: "var(--cream-2)", items: ["AI summarization", "Auto task detection", "Secure vault", "File chunking"] },
              { phase: "Phase 3", t: "Mobile + Security Audit", status: "Planned", bg: "var(--cream-2)", items: ["React Native app", "Security audit", "Whitepaper", "Compliance tools"] },
            ].map(r => (
              <div key={r.phase} className="card" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#A8A49C" }}>{r.phase}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#0D0D0D" }}>{r.t}</h3>
                  </div>
                  <span style={{ background: r.bg, borderRadius: 999, padding: "3px 12px", fontSize: 11, fontWeight: 700, color: "#0D0D0D" }}>{r.status}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {r.items.map(item => <span key={item} className="pill">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────── */}
      <section style={{ padding: "100px 28px", background: "#0D0D0D" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }} className="animate-float">
            <Shield size={32} style={{ color: "#0D0D0D" }} />
          </div>
          <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff", letterSpacing: "-.04em", marginBottom: 20, lineHeight: 1.1 }}>
            Ready to encrypt<br />your workflow?
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#6B675E", margin: "0 auto 40px", lineHeight: 1.75 }}>
            Start free. No credit card needed. First 5 team members are on us, forever.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: 16, padding: "14px 30px" }}>
              Create workspace <ArrowRight size={18} />
            </Link>
            <Link href="/app/chat/general" className="btn-secondary" style={{ fontSize: 16, padding: "13px 30px", borderColor: "rgba(255,255,255,.15)", color: "#fff" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              View live demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────── */}
      <footer style={{ background: "#0D0D0D", borderTop: "1px solid rgba(255,255,255,.06)", padding: "32px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={14} style={{ color: "#0D0D0D" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff" }}>CipherDesk</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {["Privacy Policy", "Security", "Terms", "Contact", "Docs"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: "#4A4740", textDecoration: "none", transition: "color .15s" }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "#A8A49C"}
                onMouseLeave={e => (e.target as HTMLElement).style.color = "#4A4740"}>{l}</a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B675E", transition: "all .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.06)"; (e.currentTarget as HTMLElement).style.color = "#6B675E"; }}>
              <Github size={17} />
            </a>
            <a href="#" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B675E", transition: "all .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.06)"; (e.currentTarget as HTMLElement).style.color = "#6B675E"; }}>
              <Twitter size={17} />
            </a>
            <Link href="/app/chat/general" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B675E", transition: "all .15s", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.06)"; (e.currentTarget as HTMLElement).style.color = "#6B675E"; }}>
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "20px auto 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.05)", textAlign: "center", fontSize: 12, color: "#3D3B35" }}>
          © 2026 CipherDesk. No ads. No data selling. Revenue from subscriptions only. Built for privacy-first founders.
        </div>
      </footer>
    </div>
  );
}
