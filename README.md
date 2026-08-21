# 🟠 Control Room — Autonomous AI Agent for Commerce on Razorpay

> An AI agent that places orders, reasons about decisions in real time, recovers failed payments, and leaves a full audit trail — all inside a "control room" dashboard built for the Razorpay Buildathon.


## 🚀 The Problem

Autonomous payment agents are a black box today — money moves, but nobody can see *why* a decision was made, and a failed payment is usually a dead end instead of a recoverable moment. **Control Room** fixes both: it gives humans a live window into an AI agent's reasoning while it transacts on Razorpay, and it automatically recovers lost revenue from failed payments instead of just logging the failure.

## ✨ What It Does

- **Place Order Composer** — a simple interface to issue a purchase intent to the agent, which then reasons through it autonomously.
- **Reasoning Ledger** — a live, streaming log of *why* the agent made each decision (approve, decline, retry, offer discount), not just *what* it decided.
- **Approval Queue** — decisions above a risk/value threshold are routed for human sign-off before execution, polled every **6 seconds** so the queue always reflects the latest pending actions.
- **Automatic Payment Recovery** — when a Razorpay payment fails, the agent doesn't just log it. It analyzes the failure reason and can automatically generate a **recovery discount** to win back the transaction.
- **Full Audit Trail** — every decision the agent makes (approved, declined, discounted, retried) is permanently logged with timestamp, reasoning, and outcome — built for trust and compliance from day one.

## 🖥️ Design Philosophy — "Control Room" Theme

Built to feel like mission control for money movement:
- **Dark background** for a focused, low-fatigue monitoring surface
- **Orange signal accent** for alerts, pending states, and key actions — echoing Razorpay's own energy
- **Monospace typeface for all amounts and IDs** so numbers and transaction/payment IDs are unambiguous and easy to scan at a glance

<!-- Add 2-3 more screenshots/GIFs here: e.g. Approval Queue in action, Reasoning Ledger streaming, Recovery Discount flow -->
| Approval Queue | Reasoning Ledger | Recovery Flow |
|---|---|---|
| ![approval queue](./screenshots/approval-queue.png) | ![reasoning ledger](./screenshots/reasoning-ledger.png) | ![recovery flow](./screenshots/recovery-flow.png) |

## 🏗️ Architecture

```
┌─────────────────────┐        ┌──────────────────────┐        ┌───────────────┐
│  React + Vite +      │  poll  │   Agent / Backend     │  API   │   Razorpay    │
│  Tailwind Dashboard   │◄──────►│   (decision engine,    │◄──────►│   Payments    │
│  (Control Room UI)    │  6s    │   audit logger)        │        │   Gateway     │
└─────────────────────┘        └──────────────────────┘        └───────────────┘
        │                              │
        │                              ▼
        │                     ┌──────────────────┐
        └────────────────────►│   Audit Trail DB   │
                               │ (decisions, reasons,│
                               │  outcomes, timestamps)│
                               └──────────────────┘
```

**Frontend**
- React + Vite
- Tailwind CSS
- 3-panel responsive layout (Composer / Reasoning Ledger / Approval Queue)
- Polling-based live updates (6s interval) for pending decisions

**Payments**
- Razorpay Payment Gateway integration
- Failure-handling pipeline that triggers automated recovery discount logic

**Backend / Agent Logic**
- Decision engine that evaluates each order/payment event and produces a reasoned outcome
- Persistent audit trail of every agent action

> _Fill in your actual backend stack here (e.g. Node.js/Express, Python/FastAPI, database used) so reviewers see the full picture._

## 🧠 How the Agent Reasons

1. An order is placed via the **Composer**.
2. The agent evaluates the order and writes its reasoning to the **Reasoning Ledger** in real time.
3. If the decision requires human sign-off, it's pushed to the **Approval Queue** (polled every 6s).
4. On payment attempt via Razorpay:
   - **Success** → order confirmed, outcome logged.
   - **Failure** → the agent analyzes the failure reason and can issue a **recovery discount**, re-attempting the payment automatically.
5. Every step — decision, reasoning, outcome — is written to the **Audit Trail**, so nothing the agent does is invisible.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Payments | Razorpay |
| Live Updates | Polling (6s interval) |
| Backend | _add your stack_ |
| Database | _add your stack_ |
| Tunneling (dev) | ngrok |

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- A [Razorpay](https://razorpay.com/) test account with API keys
- ngrok (for exposing local webhooks during development)

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# Install frontend dependencies
npm install

# Set up environment variables
cp .env.example .env
# then fill in your RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, etc.

# Run the dev server
npm run dev
```

### Environment Variables

```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
VITE_API_BASE_URL=http://localhost:<port>
# add any others your backend needs
```

### Exposing Webhooks Locally (ngrok)

```bash
ngrok http <backend-port>
```
Use the generated ngrok URL as your Razorpay webhook endpoint in the Razorpay dashboard for local testing.


## 🗺️ Roadmap / Future Scope

- Replace polling with WebSockets for true real-time updates
- Configurable approval thresholds per merchant
- Multi-channel recovery (discount → alternate payment method → retry scheduling)
- Exportable audit trail (CSV/PDF) for compliance reviews

## 👤 Team

-- Abhinav Maurya

<p align="center">Built for the <b>Razorpay Buildathon</b> 🟠</p>
