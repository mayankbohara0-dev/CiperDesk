"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Zap,
  MessageSquare,
  CheckSquare,
  FolderLock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Star,
  Menu,
  X,
  Eye,
  EyeOff,
  KeyRound,
  Cpu,
  Globe,
  Check,
  Github,
  Twitter,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "Roadmap", href: "#roadmap" },
];

const FEATURES = [
  {
    icon: MessageSquare,
    label: "Encrypted Chat",
    color: "text-primary-400",
    bg: "bg-primary-500/10",
    border: "border-primary-500/20",
    desc: "1-to-1 and group channels encrypted end-to-end. Double Ratchet protocol. Messages encrypted before they leave your device.",
    badge: "E2E Encrypted",
  },
  {
    icon: CheckSquare,
    label: "Task Boards",
    color: "text-accent-400",
    bg: "bg-accent-400/10",
    border: "border-accent-400/20",
    desc: "Convert any message into a task. Kanban & list views. Tasks are encrypted JSON objects — server sees nothing.",
    badge: "Zero-Knowledge",
  },
  {
    icon: FolderLock,
    label: "File Vault",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    desc: "Files chunked and encrypted client-side before upload. Only your team can decrypt. No plaintext ever stored.",
    badge: "Client-Side Enc.",
  },
  {
    icon: Sparkles,
    label: "AI Digest",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    desc: "AI summarization, decision extraction and task suggestions. AI runs after client-side decryption — no raw logs.",
    badge: "Pro Only",
  },
];

const ENCRYPTION_STEPS = [
  { step: "01", title: "Compose", desc: "You write a message on your device.", icon: MessageSquare },
  { step: "02", title: "Encrypt Locally", desc: "AES-256-GCM + workspace key before sending.", icon: Lock },
  { step: "03", title: "TLS Transit", desc: "Ciphertext travels over TLS. Double encrypted.", icon: Globe },
  { step: "04", title: "Server Stores", desc: "Server ONLY stores encrypted payload + metadata.", icon: Cpu },
  { step: "05", title: "Recipient Decrypts", desc: "Only authorized devices can decrypt. Server never sees plaintext.", icon: KeyRound },
];

const TESTIMONIALS = [
  {
    name: "Arjun Mehta",
    role: "Founder, BuildFast.io",
    avatar: "AM",
    text: "We switched from Slack to CipherDesk for our dev discussions. The encryption-first approach gives us peace of mind. The task conversion feature alone saves us 30 mins a day.",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    role: "CTO, Stackly",
    avatar: "PS",
    text: "Finally a tool built for devs. No bloat, no ads. Just fast, encrypted comms. The signal-level security for a Slack-like interface is exactly what we needed.",
    stars: 5,
  },
  {
    name: "Rahul Nair",
    role: "Indie Hacker",
    avatar: "RN",
    text: "CipherDesk is what I wished existed for years. Privacy-first, lightweight, and the pricing makes sense for small teams. Worth every rupee.",
    stars: 5,
  },
];

const FREE_FEATURES = [
  "5 team members",
  "5 GB encrypted storage",
  "Encrypted messaging",
  "Basic task boards",
  "Secure file vault",
];

const PRO_FEATURES = [
  "Unlimited members",
  "100 GB encrypted storage",
  "AI chat summarization",
  "AI task suggestions",
  "Weekly encrypted digest",
  "Advanced security controls",
  "Device management",
  "Priority support",
  "Audit-ready encryption log",
];

function EncryptionBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-400 bg-accent-400/8 border border-accent-400/25 px-2.5 py-1 rounded-md">
      <Lock size={10} />
      E2E Encrypted
    </span>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-dark/80 backdrop-blur-xl border-b border-surface-border/60"
          : "bg-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-glow-primary">
            <Shield size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-100 tracking-tight">
            Cipher<span className="text-gradient">Desk</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-surface-raised transition-all duration-150"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost">
            Sign in
          </Link>
          <Link href="/auth/register" className="btn-primary">
            Get Started Free
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-surface-raised"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-xl border-b border-surface-border px-6 pb-6 space-y-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-surface-raised"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/auth/login" className="btn-secondary justify-center">Sign in</Link>
            <Link href="/auth/register" className="btn-primary justify-center">Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark grid-pattern">
      <NavBar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-accent-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6 animate-in">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-DEFAULT border border-surface-border text-sm text-slate-400">
            <Shield size={14} className="text-primary-400" />
            Zero-trust · Zero-knowledge · Zero compromise
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 leading-tight tracking-tight">
            Your team&#39;s workspace,{" "}
            <span className="text-gradient">fully encrypted</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CipherDesk is the encrypted workspace for small startups. Real-time
            messaging, task boards, and file vault — all end-to-end encrypted.
            The server never sees your data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5">
              Start for Free
              <ArrowRight size={18} />
            </Link>
            <Link href="/app/chat/general" className="btn-secondary text-base px-8 py-3.5">
              <Eye size={16} />
              View Demo
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-green-400" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-green-400" /> 5 members free forever</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-green-400" /> No ads. No tracking.</span>
          </div>
        </div>

        {/* Floating app preview */}
        <div className="relative mt-16 max-w-5xl mx-auto w-full animate-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-2xl overflow-hidden border border-surface-border shadow-card bg-surface-muted">
            {/* Fake window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-DEFAULT border-b border-surface-border">
              <div className="w-3 h-3 rounded-full bg-danger/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4">
                <div className="w-48 h-5 rounded-md bg-dark-DEFAULT flex items-center px-3 text-xs text-slate-500 font-mono">
                  app.cipherdesk.io
                </div>
              </div>
              <EncryptionBadge />
            </div>

            {/* App shell preview */}
            <div className="flex h-[380px] md:h-[460px]">
              {/* Sidebar */}
              <div className="w-56 border-r border-surface-border bg-dark-DEFAULT flex-shrink-0 p-3 space-y-1 hidden sm:block">
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Channels</div>
                {["# general", "# engineering", "# design", "# builds"].map((ch, i) => (
                  <div
                    key={ch}
                    className={`px-3 py-2 rounded-lg text-sm ${i === 0 ? "bg-primary-500/15 text-primary-300 border border-primary-500/20" : "text-slate-400"}`}
                  >
                    {ch}
                  </div>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-3">Direct</div>
                {["Priya S.", "Arjun M.", "Rahul N."].map((dm) => (
                  <div key={dm} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-primary-500/30 flex items-center justify-center text-xs text-primary-300">
                      {dm[0]}
                    </div>
                    {dm}
                  </div>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold text-sm"># general</span>
                  </div>
                  <EncryptionBadge />
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                  {[
                    { user: "Arjun M.", avatar: "AM", msg: "Just pushed the auth flow. Can someone review?", time: "10:32 AM", color: "bg-primary-500" },
                    { user: "Priya S.", avatar: "PS", msg: "On it! Also @Arjun let's convert the deploy issue into a task 👇", time: "10:34 AM", color: "bg-violet-500" },
                    { user: "You", avatar: "Y", msg: "Agreed. I'll create a kanban card now.", time: "10:35 AM", color: "bg-accent-500", you: true },
                  ].map((m) => (
                    <div key={m.user} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl ${m.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                        {m.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-200">{m.user}</span>
                          <span className="text-xs text-slate-500">{m.time}</span>
                          <Lock size={10} className="text-accent-400/60" />
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">{m.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Composer */}
                <div className="p-3 border-t border-surface-border">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-dark rounded-xl border border-surface-border">
                    <Lock size={14} className="text-accent-400/60 flex-shrink-0" />
                    <span className="text-sm text-slate-500">Message #general (encrypted)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow below card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary-500/10 rounded-full blur-2xl" />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-surface-border bg-surface-muted py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {[
            { icon: Lock, text: "AES-256-GCM Encryption" },
            { icon: Shield, text: "Zero-Knowledge Server" },
            { icon: KeyRound, text: "Double Ratchet Protocol" },
            { icon: EyeOff, text: "No Plaintext Storage" },
            { icon: Zap, text: "Real-Time WebSockets" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
              <Icon size={16} className="text-accent-400" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-accent inline-flex mb-4">Core Features</div>
            <h2 className="section-heading">Everything your team needs.</h2>
            <p className="section-subheading mx-auto text-center">
              No bloat. No distractions. Just the tools small teams actually use,
              built on a cryptographic foundation you can audit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className={`card hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300 group`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`${f.bg} ${f.border} border rounded-xl p-3 flex-shrink-0`}>
                    <f.icon size={22} className={f.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-100">{f.label}</h3>
                      <span className="badge-ghost text-xs">{f.badge}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Encryption Architecture */}
      <section id="security" className="py-24 px-6 bg-surface-muted border-y border-surface-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-primary inline-flex mb-4">Zero-Trust Architecture</div>
            <h2 className="section-heading">The server never sees your data.</h2>
            <p className="section-subheading mx-auto text-center">
              Every message is encrypted on your device before it ever reaches our servers.
              We physically cannot read your conversations.
            </p>
          </div>

          {/* Flow */}
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {ENCRYPTION_STEPS.map((s, i) => (
              <div key={s.step} className="flex md:flex-col items-center gap-3 md:gap-0 flex-1">
                <div className="flex flex-col md:flex-row items-center flex-1 w-full">
                  <div className="card flex-1 text-center p-5 hover:border-primary-500/30 transition-all duration-300 group">
                    <div className="text-xs font-mono text-slate-500 mb-3">{s.step}</div>
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-500/20 transition-colors">
                      <s.icon size={20} className="text-primary-400" />
                    </div>
                    <div className="text-sm font-bold text-slate-200 mb-1">{s.title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
                  </div>
                  {i < ENCRYPTION_STEPS.length - 1 && (
                    <div className="hidden md:flex items-center px-1">
                      <ArrowRight size={16} className="text-primary-500/50" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Crypto standards */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Asymmetric", value: "X25519" },
              { label: "Signatures", value: "Ed25519" },
              { label: "Symmetric", value: "AES-256-GCM" },
              { label: "Hashing", value: "SHA-256" },
              { label: "Key Derivation", value: "HKDF" },
              { label: "Password Hash", value: "Argon2id" },
            ].map((c) => (
              <div key={c.label} className="bg-dark rounded-xl border border-surface-border px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">{c.label}</span>
                <span className="text-sm font-mono font-semibold text-accent-400">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading">Trusted by indie founders</h2>
            <p className="section-subheading mx-auto text-center">
              Built for the privacy-conscious startup community.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-sm font-bold text-primary-300">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-surface-muted border-y border-surface-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-accent inline-flex mb-4">Pricing</div>
            <h2 className="section-heading">Simple, honest pricing.</h2>
            <p className="section-subheading mx-auto text-center">No seat tricks. No hidden fees. Pay for what you use.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="card flex flex-col">
              <div className="mb-6">
                <div className="badge-ghost mb-3">Free Forever</div>
                <div className="text-3xl font-bold text-slate-100">₹0</div>
                <div className="text-sm text-slate-500 mt-1">Up to 5 members</div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <Check size={15} className="text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-secondary justify-center">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative card flex flex-col border-primary-500/40 bg-gradient-to-b from-primary-500/5 to-transparent shadow-glow-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge-primary text-xs px-4 py-1.5 shadow-glow-primary">Most Popular</span>
              </div>
              <div className="mb-6">
                <div className="badge-primary mb-3">Pro Plan</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-100">₹299</span>
                  <span className="text-sm text-slate-400">/user/month</span>
                </div>
                <div className="text-sm text-slate-500 mt-1">Billed monthly · Cancel anytime</div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check size={15} className="text-primary-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-primary justify-center">
                Start Pro Trial
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-ghost inline-flex mb-4">Roadmap</div>
            <h2 className="section-heading">Built in public.</h2>
            <p className="section-subheading mx-auto text-center">Three focused phases. No scope creep.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                phase: "Phase 1",
                label: "Encrypted Chat + Tasks",
                status: "In Progress",
                statusColor: "badge-primary",
                items: ["E2E encrypted messaging", "Group channels", "Message → Task conversion", "Kanban board"],
              },
              {
                phase: "Phase 2",
                label: "AI Layer + File Vault",
                status: "Coming Soon",
                statusColor: "badge-ghost",
                items: ["AI chat summarization", "Auto task suggestions", "Secure file vault", "Encrypted file chunking"],
              },
              {
                phase: "Phase 3",
                label: "Mobile + Security Audit",
                status: "Planned",
                statusColor: "badge-ghost",
                items: ["React Native mobile app", "Independent security audit", "Public security whitepaper", "Compliance tools"],
              },
            ].map((r) => (
              <div key={r.phase} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">{r.phase}</span>
                    <h3 className="text-base font-bold text-slate-200">{r.label}</h3>
                  </div>
                  <span className={r.statusColor}>{r.status}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.items.map((item) => (
                    <span key={item} className="badge-ghost text-xs">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto shadow-glow-primary animate-float">
              <Shield size={30} className="text-white" />
            </div>
          </div>
          <h2 className="section-heading mb-4">Ready to encrypt your workflow?</h2>
          <p className="section-subheading mx-auto text-center mb-8">
            Start for free. No credit card needed. Your first 5 team members are on us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-base px-8 py-3.5">
              Create Your Workspace
              <ArrowRight size={18} />
            </Link>
            <Link href="/app/chat/general" className="btn-secondary text-base px-8 py-3.5">
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <Shield size={13} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-300">CipherDesk</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-raised transition-all">
              <Github size={18} />
            </a>
            <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-raised transition-all">
              <Twitter size={18} />
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-surface-border text-center text-xs text-slate-600">
          © 2026 CipherDesk. No ads. No data selling. Built for privacy-first founders.
        </div>
      </footer>
    </div>
  );
}
