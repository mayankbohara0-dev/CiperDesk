"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Shield, Lock, Zap, MessageSquare, CheckSquare, FolderLock,
  Sparkles, ChevronRight, ArrowRight, Star, Menu, X, Eye,
  EyeOff, KeyRound, Cpu, Globe, Check, Github, Twitter,
  Users, Flame, Timer, Brain, FileText, Terminal,
} from "lucide-react";

/* ── Static data ─────────────────────────────── */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "Roadmap", href: "#roadmap" },
];

const FEATURES = [
  {
    icon: MessageSquare, label: "Encrypted Chat",
    color: "#818CF8", bg: "rgba(79,70,229,.1)", border: "rgba(79,70,229,.2)",
    badge: "E2E Encrypted",
    desc: "Double Ratchet encrypted channels + DMs. Every message is AES-256-GCM encrypted before it ever leaves your device.",
    points: ["Group channels & direct messages", "Message reactions & threads", "Convert messages → tasks"],
  },
  {
    icon: CheckSquare, label: "Task Boards",
    color: "#22D3EE", bg: "rgba(34,211,238,.1)", border: "rgba(34,211,238,.2)",
    badge: "Zero-Knowledge",
    desc: "Kanban & list views built on encrypted JSON blobs. The server stores ciphertext — it has no idea what your tasks say.",
    points: ["Kanban + List views", "Priority & assignee tracking", "1-click message → task"],
  },
  {
    icon: FolderLock, label: "File Vault",
    color: "#A78BFA", bg: "rgba(139,92,246,.1)", border: "rgba(139,92,246,.2)",
    badge: "Client-Side Enc.",
    desc: "Files are split into 512KB chunks, each encrypted with a unique AES-256-GCM key, then uploaded. Only your team can decrypt.",
    points: ["Per-chunk encryption", "Up to 5 GB (Free) / 100 GB (Pro)", "File versioning"],
  },
  {
    icon: Sparkles, label: "AI Digest",
    color: "#FBBF24", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.2)",
    badge: "Pro Only",
    desc: "AI runs after client-side decryption. Never sees raw messages. Summarizes threads, extracts decisions, suggests tasks.",
    points: ["Chat summarization", "Auto task suggestions", "Encrypted weekly digest email"],
  },
];

const CRYPTO_STANDARDS = [
  { label: "Key Exchange", value: "X25519" },
  { label: "Signatures", value: "Ed25519" },
  { label: "Symmetric", value: "AES-256-GCM" },
  { label: "Hashing", value: "SHA-256" },
  { label: "KDF", value: "HKDF" },
  { label: "Password", value: "Argon2id" },
];

const FLOW_STEPS = [
  { n: "01", icon: Terminal, title: "You type", desc: "Message composed on your device." },
  { n: "02", icon: Lock, title: "Encrypted locally", desc: "AES-256-GCM + workspace key applied." },
  { n: "03", icon: Globe, title: "Sent over TLS", desc: "Ciphertext travels double-encrypted." },
  { n: "04", icon: Cpu, title: "Server stores", desc: "Only ciphertext + metadata stored." },
  { n: "05", icon: KeyRound, title: "Recipient decrypts", desc: "Only your team can decrypt. Server never sees plaintext." },
];

const TESTIMONIALS = [
  {
    name: "Arjun Mehta", role: "Founder, BuildFast.io", av: "AM", color: "#4F46E5",
    text: "Switched from Slack for our dev discussions. Encryption-first gives us peace of mind. The message → task conversion alone saves 30 mins/day."
  },
  {
    name: "Priya Sharma", role: "CTO, Stackly", av: "PS", color: "#7C3AED",
    text: "Finally a tool built for devs. No bloat, no ads. Signal-level security with a Slack-like interface is exactly what we needed."
  },
  {
    name: "Rahul Nair", role: "Indie Hacker", av: "RN", color: "#059669",
    text: "Privacy-first, lightweight, honest pricing. CipherDesk is what I wished existed for years. Worth every rupee."
  },
];

const FREE_FEATURES = ["5 team members", "5 GB encrypted storage", "Encrypted messaging", "Basic task boards", "Secure file vault"];
const PRO_FEATURES = ["Unlimited members", "100 GB encrypted storage", "AI chat summarization", "AI task suggestions", "Weekly encrypted digest", "Advanced security controls", "Device management", "Priority support", "Audit-ready encryption log"];

/* ── Navbar ─────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-dark/85 backdrop-blur-2xl border-b border-surface" : "bg-transparent"}`}
      style={scrolled ? { borderBottomColor: "#334155" } : {}}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-glow-primary transition-transform group-hover:scale-105"
            style={{ background: "#4F46E5" }}>
            <Shield size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: "#F1F5F9" }}>
            Cipher<span className="text-gradient">Desk</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#E2E8F0"; (e.target as HTMLElement).style.background = "#263248"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "#94A3B8"; (e.target as HTMLElement).style.background = "transparent"; }}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost">Sign in</Link>
          <Link href="/auth/register" className="btn-primary">
            Get Started Free <ChevronRight size={15} />
          </Link>
        </div>

        <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-6 pb-6 space-y-2" style={{ background: "rgba(15,23,42,.97)", backdropFilter: "blur(24px)", borderBottom: "1px solid #334155" }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg transition-all"
              style={{ color: "#94A3B8" }}>
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/auth/login" className="btn-secondary" style={{ justifyContent: "center" }}>Sign in</Link>
            <Link href="/auth/register" className="btn-primary" style={{ justifyContent: "center" }}>Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── App Preview Mockup ──────────────────────── */
function AppPreview() {
  return (
    <div className="relative mt-16 max-w-5xl mx-auto w-full animate-in" style={{ animationDelay: ".25s" }}>
      {/* Card glow */}
      <div className="absolute -inset-px rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(79,70,229,.3), rgba(34,211,238,.2))" }} />
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "#1E293B", border: "1px solid #334155" }}>
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#263248", borderBottom: "1px solid #334155" }}>
          <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#22C55E" }} />
          <div className="flex-1 mx-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono" style={{ background: "#0F172A", color: "#64748B" }}>
              🔒 app.cipherdesk.io
            </div>
          </div>
          <span className="encrypted-label"><Lock size={10} />E2E Encrypted</span>
        </div>

        {/* App shell */}
        <div className="flex" style={{ height: 440 }}>
          {/* Icon rail */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2 py-3 px-2" style={{ width: 52, background: "#0F172A", borderRight: "1px solid #334155" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-glow-primary" style={{ background: "#4F46E5" }}>
              <Shield size={15} className="text-white" />
            </div>
            <div className="w-px h-4 mt-1" style={{ background: "#334155" }} />
            {[MessageSquare, CheckSquare, FolderLock].map((Icon, i) => (
              <div key={i} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: i === 0 ? "rgba(79,70,229,.2)" : "transparent", color: i === 0 ? "#818CF8" : "#475569", border: i === 0 ? "1px solid rgba(79,70,229,.3)" : "none" }}>
                <Icon size={17} />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex-shrink-0 hidden sm:flex flex-col overflow-hidden" style={{ width: 200, background: "#0F172A", borderRight: "1px solid #334155" }}>
            <div className="px-3 py-3" style={{ borderBottom: "1px solid #334155" }}>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: "#263248" }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "#4F46E5" }}>
                  <Shield size={11} className="text-white" />
                </div>
                <span className="text-sm font-bold" style={{ color: "#E2E8F0" }}>BuildFast HQ</span>
              </div>
            </div>
            <div className="px-2 py-3 space-y-0.5">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>Channels</p>
              {["# general", "# engineering", "# design", "# builds"].map((ch, i) => (
                <div key={ch} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm"
                  style={{ background: i === 0 ? "rgba(79,70,229,.15)" : "transparent", color: i === 0 ? "#818CF8" : "#64748B", border: i === 0 ? "1px solid rgba(79,70,229,.2)" : "none" }}>
                  {ch} {i === 0 && <span className="ml-auto text-xs font-bold flex items-center justify-center w-4 h-4 rounded-full" style={{ background: "#4F46E5", color: "#fff" }}>3</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col" style={{ background: "#0F172A" }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #334155" }}>
              <span className="font-semibold text-sm" style={{ color: "#E2E8F0" }}># general</span>
              <span className="encrypted-label"><Lock size={9} />E2E Encrypted</span>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-hidden">
              {[
                { av: "AM", c: "#4F46E5", user: "Arjun M.", time: "10:32 AM", msg: "Just pushed the auth flow. Can someone review? 🚀" },
                { av: "PS", c: "#7C3AED", user: "Priya S.", time: "10:34 AM", msg: "On it! Also @Arjun let's convert the deploy issue into a task 👇" },
                { av: "Y", c: "#0EA5C9", user: "You", time: "10:35 AM", msg: "Agreed. Creating the kanban card now." },
              ].map((m) => (
                <div key={m.user} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ background: m.c }}>
                    {m.av}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "#E2E8F0" }}>{m.user}</span>
                      <span className="text-xs" style={{ color: "#475569" }}>{m.time}</span>
                      <Lock size={9} style={{ color: "rgba(34,211,238,.5)" }} />
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: "#94A3B8" }}>{m.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3" style={{ borderTop: "1px solid #334155" }}>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "#1E293B", border: "1px solid #334155" }}>
                <Lock size={13} style={{ color: "rgba(34,211,238,.5)" }} />
                <span className="text-sm" style={{ color: "#475569" }}>Message #general (encrypted)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 rounded-full blur-2xl" style={{ background: "rgba(79,70,229,.12)" }} />
    </div>
  );
}

/* ── Main page ─────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F172A" }} className="grid-pattern">
      <Navbar />

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
        {/* Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/3" style={{ width: 700, height: 700, background: "rgba(79,70,229,.08)", borderRadius: "50%", filter: "blur(80px)" }} />
          <div className="absolute top-1/2 left-1/4" style={{ width: 450, height: 450, background: "rgba(34,211,238,.05)", borderRadius: "50%", filter: "blur(70px)" }} />
          <div className="absolute top-1/3 right-1/4" style={{ width: 350, height: 350, background: "rgba(139,92,246,.05)", borderRadius: "50%", filter: "blur(70px)" }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-7 animate-in">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8" }}>
            <Shield size={14} style={{ color: "#818CF8" }} />
            Zero-trust · Zero-knowledge · Zero compromise
            <span className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: "#22C55E" }} />
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 900, color: "#F1F5F9", lineHeight: 1.1, letterSpacing: "-.03em" }}>
            Your team&apos;s workspace,{" "}
            <span className="text-gradient">fully encrypted.</span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "#94A3B8", maxWidth: "42rem", margin: "0 auto", lineHeight: 1.7 }}>
            CipherDesk is the encrypted workspace for small startups. Real-time messaging,
            task boards, and file vault — all end-to-end encrypted.{" "}
            <span style={{ color: "#CBD5E1", fontWeight: 500 }}>The server never sees your data.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: "1rem", padding: ".875rem 2rem" }}>
              Start for Free
              <ArrowRight size={18} />
            </Link>
            <Link href="/app/chat/general" className="btn-secondary" style={{ fontSize: "1rem", padding: ".875rem 2rem" }}>
              <Eye size={16} />
              View Live Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "#64748B" }}>
            {["No credit card required", "5 members free forever", "No ads. No tracking."].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={14} style={{ color: "#22C55E" }} />{t}
              </span>
            ))}
          </div>
        </div>

        <AppPreview />
      </section>

      {/* ── TRUST BAR ────────────────────────── */}
      <section style={{ borderTop: "1px solid #334155", borderBottom: "1px solid #334155", background: "#1E293B", padding: "1.5rem 0" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { icon: Lock, text: "AES-256-GCM Encryption" },
            { icon: Shield, text: "Zero-Knowledge Server" },
            { icon: KeyRound, text: "Double Ratchet Protocol" },
            { icon: EyeOff, text: "No Plaintext Storage" },
            { icon: Zap, text: "Real-Time WebSockets" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "#64748B" }}>
              <Icon size={16} style={{ color: "#22D3EE" }} />{text}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────── */}
      <section id="features" style={{ padding: "6rem 1.5rem" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-accent inline-flex mb-4">Core Features</span>
            <h2 className="section-heading">Everything your team needs.</h2>
            <p className="section-subheading" style={{ margin: ".75rem auto 0", textAlign: "center" }}>
              No bloat. No distractions. Just the tools small teams actually use,
              built on a cryptographic foundation you can audit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.label} className="card group" style={{ transition: "all .3s", animationDelay: `${i * .1}s` }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.transform = "translateY(-4px)"; el.style.borderColor = "rgba(79,70,229,.35)"; el.style.boxShadow = "0 12px 40px rgba(0,0,0,.5)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.transform = ""; el.style.borderColor = "#334155"; el.style.boxShadow = ""; }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl flex-shrink-0 border" style={{ background: f.bg, borderColor: f.border }}>
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold" style={{ color: "#F1F5F9" }}>{f.label}</h3>
                      <span className="badge-ghost text-xs">{f.badge}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{f.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2 pl-1">
                  {f.points.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm" style={{ color: "#CBD5E1" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.color }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY / ARCH ──────────────────── */}
      <section id="security" style={{ padding: "6rem 1.5rem", background: "#1E293B", borderTop: "1px solid #334155", borderBottom: "1px solid #334155" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary inline-flex mb-4">Zero-Trust Architecture</span>
            <h2 className="section-heading">The server never sees your data.</h2>
            <p className="section-subheading" style={{ margin: ".75rem auto 0", textAlign: "center" }}>
              Every message is encrypted on your device before it reaches our servers.
              We physically cannot read your conversations.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-3 mb-12">
            {FLOW_STEPS.map((s, i) => (
              <div key={s.n} className="flex md:flex-col items-center flex-1">
                <div className="card flex-1 text-center p-5 w-full group" style={{ transition: "all .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(79,70,229,.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; }}>
                  <div className="text-xs font-mono mb-3" style={{ color: "#475569" }}>{s.n}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(79,70,229,.12)", border: "1px solid rgba(79,70,229,.22)" }}>
                    <s.icon size={20} style={{ color: "#818CF8" }} />
                  </div>
                  <div className="text-sm font-bold mb-1" style={{ color: "#E2E8F0" }}>{s.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{s.desc}</div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="hidden md:flex items-center px-1 flex-shrink-0">
                    <ArrowRight size={16} style={{ color: "rgba(79,70,229,.4)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CRYPTO_STANDARDS.map(c => (
              <div key={c.label} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "#0F172A", border: "1px solid #334155" }}>
                <span className="text-xs" style={{ color: "#64748B" }}>{c.label}</span>
                <span className="text-sm font-mono font-semibold" style={{ color: "#22D3EE" }}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading">Trusted by indie founders</h2>
            <p className="section-subheading" style={{ margin: ".75rem auto 0", textAlign: "center" }}>
              Built for the privacy-conscious startup community.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card flex flex-col" style={{ transition: "all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(79,70,229,.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#334155"; }}>
                <div className="flex items-center gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#CBD5E1" }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: t.color }}>
                    {t.av}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#E2E8F0" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "#64748B" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────── */}
      <section id="pricing" style={{ padding: "6rem 1.5rem", background: "#1E293B", borderTop: "1px solid #334155", borderBottom: "1px solid #334155" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-accent inline-flex mb-4">Pricing</span>
            <h2 className="section-heading">Simple, honest pricing.</h2>
            <p className="section-subheading" style={{ margin: ".75rem auto 0", textAlign: "center" }}>
              No seat tricks. No hidden fees. No data selling. Pay for what you use.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="card flex flex-col">
              <div className="mb-6">
                <span className="badge-ghost mb-3">Free Forever</span>
                <div className="text-4xl font-black mt-3" style={{ color: "#F1F5F9" }}>₹0</div>
                <div className="text-sm mt-1" style={{ color: "#64748B" }}>Up to 5 members</div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#94A3B8" }}>
                    <Check size={15} style={{ color: "#22C55E", flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-secondary" style={{ justifyContent: "center" }}>Get Started Free</Link>
            </div>

            {/* Pro */}
            <div className="card flex flex-col relative" style={{ border: "1px solid rgba(79,70,229,.5)", background: "linear-gradient(160deg, rgba(79,70,229,.07), rgba(15,23,42,0))", boxShadow: "0 0 40px rgba(79,70,229,.15)" }}>
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge-primary shadow-glow-primary px-5 py-1.5">Most Popular</span>
              <div className="mb-6">
                <span className="badge-primary mb-3">Pro Plan</span>
                <div className="flex items-baseline gap-1.5 mt-3">
                  <span className="text-4xl font-black" style={{ color: "#F1F5F9" }}>₹299</span>
                  <span className="text-sm" style={{ color: "#94A3B8" }}>/user/month</span>
                </div>
                <div className="text-sm mt-1" style={{ color: "#64748B" }}>Billed monthly · Cancel anytime</div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "#CBD5E1" }}>
                    <Check size={15} style={{ color: "#818CF8", flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-primary" style={{ justifyContent: "center" }}>
                Start Pro Trial <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <p className="text-center text-sm mt-10" style={{ color: "#475569" }}>
            No ads. No data selling. Revenue comes from subscriptions only.
            We&apos;re financially incentivized to protect your privacy.
          </p>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────── */}
      <section id="roadmap" style={{ padding: "6rem 1.5rem" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-ghost inline-flex mb-4">Roadmap</span>
            <h2 className="section-heading">Built in public.</h2>
            <p className="section-subheading" style={{ margin: ".75rem auto 0", textAlign: "center" }}>Three focused phases. No scope creep.</p>
          </div>
          <div className="space-y-4">
            {[
              { phase: "Phase 1", label: "Encrypted Chat + Tasks", badge: "badge-primary", status: "In Progress", items: ["E2E encrypted messaging", "Group channels", "Message → Task conversion", "Kanban board"] },
              { phase: "Phase 2", label: "AI Layer + File Vault", badge: "badge-ghost", status: "Coming Soon", items: ["AI chat summarization", "Auto task suggestions", "Secure file vault", "File chunking"] },
              { phase: "Phase 3", label: "Mobile + Security Audit", badge: "badge-ghost", status: "Planned", items: ["React Native app", "Security audit", "Public whitepaper", "Compliance tools"] },
            ].map(r => (
              <div key={r.phase} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: "#475569" }}>{r.phase}</span>
                    <h3 className="font-bold" style={{ color: "#E2E8F0" }}>{r.label}</h3>
                  </div>
                  <span className={r.badge}>{r.status}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.items.map(item => <span key={item} className="badge-ghost text-xs">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem", background: "#1E293B", borderTop: "1px solid #334155" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow-primary animate-float" style={{ background: "#4F46E5" }}>
            <Shield size={30} className="text-white" />
          </div>
          <h2 className="section-heading mb-4">Ready to encrypt your workflow?</h2>
          <p className="section-subheading" style={{ margin: "0 auto 2rem", textAlign: "center" }}>
            Start for free. No credit card needed. Your first 5 team members are on us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: "1rem", padding: ".875rem 2rem" }}>
              Create Your Workspace <ArrowRight size={18} />
            </Link>
            <Link href="/app/chat/general" className="btn-secondary" style={{ fontSize: "1rem", padding: ".875rem 2rem" }}>
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer style={{ borderTop: "1px solid #334155", padding: "2.5rem 1.5rem" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#4F46E5" }}>
              <Shield size={13} className="text-white" />
            </div>
            <span className="font-bold" style={{ color: "#CBD5E1" }}>CipherDesk</span>
          </Link>
          <div className="flex items-center gap-6 text-sm" style={{ color: "#64748B" }}>
            {["Privacy Policy", "Security", "Terms", "Contact", "Docs"].map(l => (
              <a key={l} href="#" style={{ transition: "color .15s" }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "#CBD5E1"}
                onMouseLeave={e => (e.target as HTMLElement).style.color = "#64748B"}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href="https://github.com/mayankbohara0-dev/CiperDesk" target="_blank" rel="noopener noreferrer"
              className="btn-ghost p-2"><Github size={18} /></a>
            <a href="#" className="btn-ghost p-2"><Twitter size={18} /></a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 text-center text-xs" style={{ borderTop: "1px solid #334155", color: "#475569" }}>
          © 2026 CipherDesk. No ads. No data selling. Built for privacy-first founders.
        </div>
      </footer>
    </div>
  );
}
