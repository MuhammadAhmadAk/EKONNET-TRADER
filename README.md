# EKONNET TRADES & PAYMENTS PLATFORM

Enterprise multi-asset financial ecosystem combining **Crypto Trading (5 Base Pairs), Forex (168+ Currencies), and Shares**, integrated with **14 Global Payment Rails, Multi-Tier Staff RBAC, and High-Security Protocols**.

---

## 🏗 Architecture & Stack Overview

- **Frontend & Fullstack Server:** Next.js (App Router, Server Components & Route Handlers), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Python Microservice Engine:** FastAPI (`/services/python-engine/main.py`) handling background CEX scraping, market indexing, and Gorelo-style AI ticket summarization (Section 4 & 34).
- **Security Engineering:** TLS 1.3, AES-256 field encryption, Proton-style TOTP 2FA, 3-attempt automated 30-minute lockout, and isolated Plesk-style administrative login gate (`/portal-mgmt-auth`).

---

## 📁 Complete Folder Structure

```
EKONNET-TRADER/
├── .env.example                                      # Production & local environment variables
├── .gitignore                                        # Standard git ignore definitions
├── package.json                                      # Next.js, React, Tailwind & Lucide dependencies
├── tsconfig.json                                     # TypeScript compiler configuration
├── next.config.mjs                                   # Next.js configuration
├── tailwind.config.ts                                # Ekonnet Blue/Violet/Purple branding theme
├── postcss.config.mjs                                # PostCSS config
├── README.md                                         # Project documentation & run guide
├── EKONNET_MASTER_IMPLEMENTATION_PLAN.md             # Complete technical implementation plan
├── EKONNET_PHASED_DEVELOPMENT_PROPOSAL_FOR_CLIENT.md # Executive client proposal document
├── services/
│   └── python-engine/                                # Python FastAPI microservice (Section 4)
│       ├── main.py                                   # AI Ticket summarizer & scraping endpoints
│       └── requirements.txt                          # FastAPI, Uvicorn, Playwright dependencies
└── src/
    ├── app/
    │   ├── layout.tsx                                # Root layout with metadata & fonts
    │   ├── globals.css                               # High-tech glowing utilities & Tailwind directives
    │   ├── page.tsx                                  # High-converting Landing Page (Section 9, 10, 17)
    │   ├── admin/
    │   │   └── page.tsx                              # Master Admin Dashboard (Section 27[1], 48)
    │   ├── portal-mgmt-auth/
    │   │   └── page.tsx                              # Isolated Plesk Management Login (Section 27[1])
    │   ├── trades/
    │   │   └── page.tsx                              # Modular Trading Sub-Page (Section 12, 14)
    │   ├── payments/
    │   │   └── page.tsx                              # Modular Payments Sub-Page (Section 11[B])
    │   └── api/
    │       ├── auth/
    │       │   ├── login/route.ts                    # User login with 3-attempt lockout logic
    │       │   └── register/route.ts                 # Registration with 18+ validation (Sec 63)
    │       ├── admin/
    │       │   └── permissions/route.ts              # Staff permission matrix endpoint (Sec 27.2)
    │       └── market/
    │           └── rates/route.ts                    # Market ticker & 5 base pairs endpoint
    ├── components/
    │   ├── landing/
    │   │   ├── Navbar.tsx                            # Responsive navigation with management entry
    │   │   ├── LiveTicker.tsx                        # Rolling price ticker (5 base pairs)
    │   │   ├── HeroSection.tsx                       # Wide hero with quick swap calculator
    │   │   ├── TradingPillars.tsx                    # Direct, P2P Escrow & CEX modes (Sec 14)
    │   │   ├── PaymentRailSection.tsx                # 14 Payment rails & FX calculator (Sec 11.B)
    │   │   ├── PricingPackages.tsx                   # Free vs Tiered paid packages (Sec 55, 56)
    │   │   ├── SecurityHighlights.tsx                # 2FA, Lockout, and 18+ verification highlights
    │   │   └── Footer.tsx                            # Legal, Disclaimer, Report Abuse, Support links
    │   ├── admin/
    │   │   ├── AdminSidebar.tsx                      # Admin navigation with node health
    │   │   ├── AdminHeader.tsx                       # Search filters & Emergency Freeze button
    │   │   ├── StatsOverview.tsx                     # Volume, Users, KYC & Backup indicators
    │   │   ├── StaffPermissionMatrix.tsx             # Interactive checkbox matrix (Sec 27.2)
    │   │   ├── UserManagementTable.tsx               # User list with Staff Internal Notes (Sec 46)
    │   │   ├── KYCReviewDrawer.tsx                   # Inspection of ID + handwritten note (Sec 27)
    │   │   ├── LiveTicketsManager.tsx                # Ticket thread with Gorelo AI summary (Sec 34)
    │   │   └── AuditLogViewer.tsx                    # Section 60 immutable transaction audit log
    │   └── auth/
    │       ├── UserLoginModal.tsx                    # User sign in with 2FA & lockout simulation
    │       └── UserRegisterModal.tsx                 # 18+ DOB check, 3 emails, 2 phones, 5 questions
    └── lib/
        ├── types.ts                                  # Complete TypeScript interfaces
        ├── mockData.ts                               # Realistic initial state & base pair fixtures
        └── utils.ts                                  # Currency, age, and ID formatting helpers
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the **Public Landing Page**.

### 3. Key Portal URLs
- **Public Landing Page:** `http://localhost:3000/`
- **Trading Terminal (Modular Sub-page):** `http://localhost:3000/trades`
- **Global Payments Hub (Modular Sub-page):** `http://localhost:3000/payments`
- **Master Admin Dashboard:** `http://localhost:3000/admin`
- **Isolated Plesk Management Login:** `http://localhost:3000/portal-mgmt-auth`

### 4. Optional: Run Python Microservice Engine
```bash
cd services/python-engine
pip install -r requirements.txt
python main.py
```
FastAPI engine runs on `http://localhost:8000` with Swagger documentation at `http://localhost:8000/docs`.
