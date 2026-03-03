# CipherDesk 🔐

**Encrypted Startup Workspace** — Telegram-level speed, Slack-level structure, Signal-level encryption.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)

---

## Overview

CipherDesk is a secure, minimal, end-to-end encrypted workspace for small startups (2–20 members). It combines:

- ⚡ **Real-time encrypted messaging** via WebSockets
- ✅ **Task management** with message → task conversion
- 🔒 **Secure file vault** with client-side encryption
- 🤖 **AI productivity features** (Pro tier)

All built on a **zero-trust, privacy-first** foundation — the server never sees your plaintext data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router + TypeScript) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Primitives | Radix UI |
| Fonts | Inter + JetBrains Mono (Google Fonts) |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/mayankbohara0-dev/CiperDesk.git
cd CiperDesk

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/auth/login` | Sign in (+ 2FA step) |
| `/auth/register` | Create workspace |
| `/app/chat/[channel]` | Encrypted chat (general, engineering, etc.) |
| `/app/tasks` | Task board (Kanban + list view) |
| `/app/vault` | Encrypted file vault |
| `/app/settings` | Security, devices, workspace, billing |
| `/app/ai` | AI digest (Pro) |
| `/app/notifications` | Notifications |
| `/invite/[token]` | Workspace invite accept flow |

---

## Encryption Architecture

```
User writes message
      ↓
Encrypt locally (AES-256-GCM + workspace key)
      ↓
Generate unique nonce
      ↓
Send ciphertext over TLS
      ↓
Server stores encrypted payload only
      ↓
Recipient decrypts locally
```

**Cryptographic standards:**
- Asymmetric: X25519
- Signatures: Ed25519
- Symmetric: AES-256-GCM
- Hashing: SHA-256
- KDF: HKDF
- Password hashing: Argon2id

---

## Design System

| Token | Value |
|---|---|
| Primary | `#4F46E5` |
| Dark background | `#0F172A` |
| Accent | `#22D3EE` |
| Danger | `#EF4444` |
| Font (headings/body) | Inter |
| Font (monospace) | JetBrains Mono |

---

## Monetization

| Plan | Price | Members | Storage |
|---|---|---|---|
| Free | ₹0 | 5 | 5 GB |
| Pro | ₹299/user/month | Unlimited | 100 GB |

---

## Non-Negotiables

- ❌ No ads
- ❌ No data selling
- ❌ No plaintext storage
- ❌ No feature bloat
- ✅ Encryption layer must be auditable

---

## Roadmap

- **Phase 1** ✅ Encrypted chat + tasks
- **Phase 2** 🔄 AI layer + file vault backend
- **Phase 3** 📅 Mobile apps + security audit + public whitepaper

---

## License

MIT © 2026 CipherDesk
