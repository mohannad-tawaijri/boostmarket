# BoostMarket — Project Context

## Overview

BoostMarket is an Arabic-first gaming services marketplace where players connect with boosters to purchase rank boosts, coaching, items, and other gaming services. The platform supports real-time chat, custom offer negotiations, direct purchases, payment processing via Moyasar, and full order lifecycle management.

**Project Path:** `c:\Users\mohan\Desktop\projects\boostmarket`  
**GitHub:** `https://github.com/mohannad-tawaijri/boostmarket.git` (branch: `main`)  
**Production URLs:**
- Frontend: `https://boost-rosy-rho.vercel.app`
- Backend API: `https://boost-api-16ta.onrender.com`
- Custom Domain: `https://boostmarket.app`

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 16 |
| Frontend UI | React | 19 |
| Styling | Tailwind CSS | 3.4 |
| UI Primitives | Radix UI (Dialog, Dropdown, Tabs) | latest |
| Icons | Lucide React | latest |
| Backend | NestJS | 11 |
| ORM | Prisma | 6.19 |
| Database | PostgreSQL | (Render hosted) |
| Auth | JWT (access + refresh tokens), bcrypt | passport-jwt |
| Real-time | Socket.IO | 4.8 |
| Payments | Moyasar (Saudi gateway, 3DS) | API |
| Image Storage | Cloudinary | latest |
| Frontend Hosting | Vercel | — |
| Backend Hosting | Render (Docker) | — |
| Language | TypeScript | 5.x |

---

## Architecture

```
boostmarket/
├── src/                    # Next.js frontend (App Router)
│   ├── app/                # Pages (file-based routing)
│   ├── components/         # Shared components
│   ├── contexts/           # React contexts (auth, socket)
│   ├── lib/                # Utilities and config
│   └── types/              # TypeScript interfaces
├── backend/                # NestJS API (separate package.json)
│   ├── src/                # Backend source
│   │   ├── auth/           # JWT auth, guards, strategies
│   │   ├── chat/           # WebSocket chat (gateway + REST)
│   │   ├── custom-offers/  # In-chat offer negotiation
│   │   ├── favorites/      # Service favoriting
│   │   ├── orders/         # Order CRUD + lifecycle
│   │   ├── payment/        # Moyasar integration
│   │   ├── prisma/         # Prisma service module
│   │   ├── reviews/        # Post-order reviews
│   │   ├── services/       # Service listings CRUD
│   │   ├── upload/         # Image upload (Cloudinary)
│   │   └── users/          # User profiles
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── migrations/     # SQL migrations
├── public/games/           # Game logo SVGs
└── package.json            # Frontend dependencies
```

---

## Language & UI Direction

- **Primary language:** Arabic (العربية)
- **HTML:** `<html lang="ar" dir="rtl">`
- **Font:** Noto Sans Arabic (Google Fonts)
- **All user-facing text is in Arabic.** Use RTL-aware Tailwind classes:
  - `start-*` / `end-*` instead of `left-*` / `right-*`
  - `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
  - `ms-*` / `me-*` instead of `ml-*` / `mr-*`
  - `text-start` / `text-end` instead of `text-left` / `text-right`

---

## Design System

- **Theme:** Dark mode only (zinc-900 background, glassmorphic cards)
- **Primary color:** Violet/Indigo gradient (`violet-500`, `indigo-500`)
- **Cards:** `bg-white/[0.07] border border-white/[0.18] rounded-2xl` (glass effect)
- **Inputs:** `bg-slate-700/50 border border-white/[0.18] rounded-xl`
- **Buttons:** Violet gradient with hover states, loading spinners
- **Tailwind uses CSS variables** via `hsl(var(--primary))` etc. (shadcn/ui pattern)
- **Single UI component:** `src/components/ui/button.tsx` (CVA-based)

---

## Frontend Details

### Pages (App Router)

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, featured services, game categories |
| `/login` | Login form |
| `/register` | Registration form |
| `/forgot-password` | Password reset request |
| `/services` | Browse/filter all services |
| `/services/[id]` | Service detail — reviews, Buy Now, chat |
| `/create-offer` | Create new service listing |
| `/create-offer/[id]` | Edit existing service listing |
| `/dashboard` | User dashboard (overview, orders, customer orders, my offers) |
| `/orders` | Order history |
| `/orders/[id]` | Single order detail + status management |
| `/checkout` | Payment page (Moyasar) |
| `/payment/callback` | Post-payment redirect handler |
| `/messages` | Real-time chat inbox |
| `/favorites` | Saved services |
| `/profile` | Edit own profile + preferences |
| `/profile/[id]` | Public user profile |
| `/become-booster` | Booster application page |
| `/admin` | Admin dashboard |
| `/about`, `/faq`, `/help`, `/how-it-works` | Info pages |
| `/terms`, `/privacy`, `/cookies`, `/disclaimer`, `/trust-safety`, `/contact` | Legal/support |
| `/api/[...path]` | API proxy (rewrites to backend in production) |
| `/api/keepalive` | Health check to prevent Render cold starts |

### Key Components

| Component | Purpose |
|-----------|---------|
| `navbar.tsx` | Main navigation with auth state, unread badge, mobile menu |
| `footer.tsx` | Site footer |
| `logo.tsx` | BoostMarket logo (supports sizes) |
| `service-card.tsx` | Service listing card used in grids |
| `chat-box.tsx` | Real-time chat component with message/image/custom-offer support |
| `avatar-inspect.tsx` | Avatar click-to-enlarge overlay |
| `toast-notification.tsx` | Toast notification system |
| `ui/button.tsx` | CVA-based button (variants: default, destructive, outline, secondary, ghost, link) |

### Auth Context (`contexts/auth-context.tsx`)

- Stores `user`, `token`, `refreshToken` in localStorage
- Provides `login()`, `register()`, `logout()`, `updateProfile()`
- Proactive token refresh before expiry (schedules refresh 1 min before JWT expires)
- `fetchWithAuth()` helper that auto-attaches Bearer token and retries on 401
- Token is a JWT with `{ sub: userId, email }` payload

### Socket Context (`contexts/socket-context.tsx`)

- Connects to backend WebSocket with JWT auth
- Manages real-time events for chat messages, typing indicators, custom offers

### API Config (`lib/config.ts`)

```typescript
export const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'       // Next.js API proxy (avoids CORS with Brave/privacy browsers)
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
```

### Frontend Types (`types/index.ts`)

```typescript
// Core interfaces
User, BoosterProfile, Service, Order, Payment, Review, CustomOffer, Message, Conversation

// Enums
ServiceCategory: RANK_BOOST | COACHING | ACCOUNT_LEVELING | PLACEMENT_MATCHES | DUOQ | ITEMS | CUSTOM | OTHER
OrderStatus: PENDING | IN_PROGRESS | COMPLETED | CANCELLED | DISPUTED
OfferStatus: PENDING | ACCEPTED | DECLINED | EXPIRED | CANCELLED
GameCategory: LEAGUE_OF_LEGENDS | VALORANT | CS2 | DOTA2 | OVERWATCH | APEX_LEGENDS | FORTNITE | ROCKET_LEAGUE | RAINBOW_SIX | COD_WARZONE | PUBG | OTHER

// Lookup maps
GAME_NAMES: Record<GameCategory, string>     // English game names + "أخرى"
GAME_IMAGES: Record<GameCategory, string>    // SVG paths in /public/games/
CATEGORY_NAMES: Record<ServiceCategory, string>  // Arabic category names
```

---

## Backend Details

### Module Structure

Every feature follows: `module.ts` → `controller.ts` → `service.ts` → `dto/index.ts`

### API Endpoints

**Auth** (`/auth`) — public
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/auth/register` | Register (email, password, name) |
| POST | `/auth/login` | Login → returns JWT + refresh token + user |
| POST | `/auth/refresh` | Refresh token rotation |
| POST | `/auth/logout` | Revoke refresh token |
| PATCH | `/auth/change-password` | Change password (requires auth) |
| GET | `/auth/me` | Get current user profile (requires auth) |

**Users** (`/users`) — mixed auth
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/users` | List users (admin) |
| GET | `/users/:id/public` | Public profile |
| GET | `/users/:id` | User details (auth) |
| PATCH | `/users/profile` | Update own profile (auth) |

**Services** (`/services`) — mixed auth
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/services` | Browse (filters: game, category, featured, sortBy, skip, take) |
| GET | `/services/my` | My listings (auth) |
| GET | `/services/:id` | Service detail (public) |
| POST | `/services` | Create service (auth, DTO validated) |
| PATCH | `/services/:id` | Update service (auth, owner only, DTO validated) |
| DELETE | `/services/:id` | Delete service (auth, owner only) |

**Orders** (`/orders`) — all auth
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/orders?role=buyer\|booster` | List orders by role |
| GET | `/orders/my` | All user orders |
| GET | `/orders/:id` | Order detail |
| POST | `/orders` | Create order (DTO: serviceId + requirements) |
| PATCH | `/orders/:id/status` | Update status (enum validated) |

**Payment** (`/payment`) — mixed auth
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/payment` | Create Moyasar payment |
| POST | `/payment/verify` | Verify payment status (server-side check) |
| POST | `/payment/webhook` | Moyasar webhook (no auth, validates secret) |
| GET | `/payment/:orderId` | Get payment for order |

**Reviews** (`/reviews`) — mixed auth
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/reviews/service/:serviceId` | Reviews for a service |
| GET | `/reviews/booster/:boosterId` | Reviews for a booster |
| POST | `/reviews` | Create review (buyer only, completed order only, no duplicates) |

**Chat** (`/chat`) — all auth + WebSocket
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/chat/conversations` | Create/get conversation for a service |
| GET | `/chat/conversations` | List conversations |
| GET | `/chat/conversations/:id/messages` | Get messages |
| POST | `/chat/conversations/:id/messages` | Send message (text/image) |
| GET | `/chat/unread-count` | Unread message count |
| WS | `ChatGateway` | Real-time: sendMessage, typing, markRead, joinConversation |

**Favorites** (`/favorites`) — all auth
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/favorites` | List favorites |
| GET | `/favorites/:serviceId/check` | Check if favorited |
| POST | `/favorites/:serviceId` | Add favorite |
| DELETE | `/favorites/:serviceId` | Remove favorite |

**Custom Offers** (`/custom-offers`) — all auth
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/custom-offers` | Create in-chat offer (booster → buyer) |
| GET | `/custom-offers/:id` | Get offer detail |
| POST | `/custom-offers/:id/accept` | Accept offer (creates order) |
| POST | `/custom-offers/:id/decline` | Decline offer |
| POST | `/custom-offers/:id/cancel` | Cancel offer (sender only) |
| GET | `/custom-offers` | List user's offers |

**Upload** (`/upload`) — auth
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/upload/image` | Upload image (5MB max, JPEG/PNG/WebP/GIF → Cloudinary) |

### Security

- **Helmet** security headers
- **CORS** whitelist (Vercel + custom domain origins only)
- **ValidationPipe** with `whitelist: true, forbidNonWhitelisted: true, transform: true`
- **Rate limiting** via `@nestjs/throttler` (60 req/min global)
- **JwtAuthGuard** on all protected routes
- **bcrypt** password hashing (salt rounds: 10)
- **Refresh token rotation** — old token revoked on each refresh, all tokens revoked on password change
- **DTOs with class-validator** on services and orders endpoints (whitelist-validated fields)
- **Mass assignment protection** — service create/update only allows whitelisted fields
- **Atomic stock decrement** — uses `updateMany` with `where: { stock: { gt: 0 } }` to prevent race conditions
- **Owner-only mutations** — service update/delete checks `boosterId === userId`
- **Webhook secret validation** for Moyasar payment callbacks

---

## Database Schema (Prisma)

### Enums

```
UserRole: USER | BOOSTER | ADMIN
OrderStatus: PENDING | IN_PROGRESS | COMPLETED | CANCELLED | DISPUTED
OfferStatus: PENDING | ACCEPTED | DECLINED | EXPIRED | CANCELLED
MessageStatus: SENT | DELIVERED | READ
ServiceCategory: RANK_BOOST | COACHING | ACCOUNT_LEVELING | PLACEMENT_MATCHES | DUOQ | ITEMS | CUSTOM | OTHER
GameCategory: LEAGUE_OF_LEGENDS | VALORANT | CS2 | DOTA2 | OVERWATCH | APEX_LEGENDS | FORTNITE | ROCKET_LEAGUE | RAINBOW_SIX | COD_WARZONE | PUBG | OTHER
```

### Models

**User** (`users`)
- `id` (cuid), `email` (unique), `password?`, `name`, `role` (USER default), `avatar?`, `bio?`, `verified`
- Notification prefs: `notifyEmail`, `notifyOrders`, `notifyMessages`, `notifyMarketing`, `showMessagePopups`
- Privacy prefs: `showProfile`, `showOnlineStatus`, `showReadReceipts`
- Relations: services, ordersAsBuyer, ordersAsBooster, reviews (given/received), boosterProfile, favorites, messages, conversations, refreshTokens

**RefreshToken** (`refresh_tokens`)
- `id`, `token` (unique), `userId`, `expiresAt`, `revoked`

**BoosterProfile** (`booster_profiles`)
- `id`, `userId` (unique), `rating`, `completedOrders`, `totalEarnings`, `verified`, `availableForHire`, `games[]`, `ranks` (JSON)

**Service** (`services`)
- `id`, `title`, `description`, `category` (ServiceCategory), `game` (GameCategory), `gameDetails?`, `price`, `deliveryTime`, `tags[]`
- `boosterId` → User, `active`, `featured`, `allowDirectPurchase`, `stock?`
- `images[]`, `requirements` (JSON), `viewCount`, `likeCount`
- Indexes: `[game, active]`, `[boosterId]`

**Order** (`orders`)
- `id`, `serviceId?` → Service, `buyerId` → User, `boosterId` → User
- `status` (OrderStatus), `price`, `requirements` (JSON), `credentials` (JSON)
- `startedAt?`, `completedAt?`

**Payment** (`payments`)
- `id`, `orderId` (unique) → Order, `amount`, `currency`, `paymentMethod`, `transactionId?`, `status`

**Review** (`reviews`)
- `id`, `serviceId?` → Service, `orderId` (unique) → Order, `reviewerId` → User, `boosterId` → User
- `rating` (Int), `comment?`

**Favorite** (`favorites`)
- `id`, `userId` → User, `serviceId` → Service
- Unique: `[userId, serviceId]`

**Conversation** (`conversations`)
- `id`, `serviceId?` → Service, `lastMessageAt?`
- Has participants (ConversationParticipant) and messages

**ConversationParticipant** (`conversation_participants`)
- `conversationId` → Conversation, `userId` → User, `lastReadAt?`
- Unique: `[conversationId, userId]`

**Message** (`messages`)
- `id`, `conversationId` → Conversation, `senderId` → User, `receiverId` → User
- `content?`, `imageUrl?`, `status` (MessageStatus), `readAt?`, `deliveredAt?`
- `customOfferId?` (unique) → CustomOffer

**CustomOffer** (`custom_offers`)
- `id`, `title`, `description?`, `price`, `deliveryTime`, `status` (OfferStatus)
- `senderId` (booster), `receiverId` (buyer), `serviceId?`, `orderId?` (unique)
- `expiresAt?`, `respondedAt?`

---

## Key Business Logic

### User Roles
- **USER** — default role, can browse and buy services
- **BOOSTER** — auto-assigned when a user creates their first service listing. Can sell services, send custom offers in chat
- **ADMIN** — full access to admin dashboard

### Order Lifecycle
1. Buyer creates order (via direct purchase or accepting custom offer)
2. Order starts as `PENDING`
3. Buyer pays via Moyasar → payment verified server-side
4. On payment success → order auto-moves to `IN_PROGRESS`
5. Booster marks `COMPLETED` when done
6. Buyer can cancel unpaid `PENDING` orders
7. Buyer can leave a review on `COMPLETED` orders

### Direct Purchase vs Chat
- Services have `allowDirectPurchase` flag (default: true)
- If enabled: "Buy Now" button creates order → redirects to checkout
- If disabled: user must chat with seller first
- All services always show "Chat" button regardless

### Stock Tracking
- Only relevant for `ITEMS` category
- `stock` is nullable — `null` means unlimited
- When set, shows count on service page
- Decremented atomically on order creation
- Shows "out of stock" when `stock === 0`

### Custom Offers (In-Chat Negotiation)
- Booster sends a custom offer inside a conversation
- Offer appears as a special message card with title, price, delivery time
- Buyer can Accept (creates order) or Decline
- Sender can Cancel before response

---

## Environment Variables

### Backend (Render)
```
DATABASE_URL          — PostgreSQL connection string
JWT_SECRET            — JWT signing secret
JWT_REFRESH_SECRET    — Refresh token signing secret
FRONTEND_URL          — https://boost-rosy-rho.vercel.app
CLOUDINARY_CLOUD_NAME — Cloudinary cloud name
CLOUDINARY_API_KEY    — Cloudinary API key
CLOUDINARY_API_SECRET — Cloudinary API secret
MOYASAR_SECRET_KEY    — Moyasar payment secret
MOYASAR_PUBLISHABLE_KEY — Moyasar publishable key
MOYASAR_WEBHOOK_SECRET — Webhook validation secret
PORT                  — 10000 (Render default)
NODE_ENV              — production
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL   — https://boost-api-16ta.onrender.com (used in dev; production uses /api proxy)
```

---

## Deployment

### Frontend (Vercel)
- Auto-deploys from `main` branch
- Uses `/api/[...path]/route.ts` as proxy to backend (avoids CORS issues with Brave/privacy browsers)
- Content Security Policy configured in `next.config.ts`

### Backend (Render)
- Docker deployment from `backend/Dockerfile`
- Build: `npm install && npx prisma generate && npm run build`
- Start: `npx prisma migrate deploy && node dist/main`
- Health check: `GET /`
- Free tier (may cold start)

---

## Development Setup

```bash
# Frontend
cd boostmarket
npm install
npm run dev          # http://localhost:3000

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev    # http://localhost:3001
```

---

## Coding Conventions

### Frontend
- All pages use `"use client"` directive
- Fetch data in `useEffect` with `fetchWithAuth()` from auth context
- Loading states with spinner animations
- Error states with Arabic user-friendly messages
- Empty states with illustrations
- All text in Arabic
- Tailwind classes only (no CSS modules)
- RTL-aware utility classes (`start`, `end`, `ps`, `pe`, `ms`, `me`)
- Input styling: `bg-slate-700/50 border border-white/[0.18] rounded-xl px-4 py-3`

### Backend
- NestJS module pattern: `*.module.ts` imports controller + service
- Controllers handle HTTP, services handle business logic
- DTOs with `class-validator` decorators for input validation
- `JwtAuthGuard` on protected routes, `@Request() req` for user info (`req.user.id`)
- Prisma service injected via `PrismaModule` (global)
- Use `select` in Prisma queries to avoid returning sensitive fields (e.g., password)
- Ownership checks in service layer (not controller)
- Proper NestJS exceptions: `NotFoundException`, `ForbiddenException`, `BadRequestException`

### Database Migrations
- **IMPORTANT:** All Prisma models use `@@map("table_name")` with lowercase plural names
- Migration SQL must reference the **mapped table name** (e.g., `"users"` not `"User"`, `"services"` not `"Service"`)
- Create migrations via `npx prisma migrate dev --name description`
- Deploy via `npx prisma migrate deploy`
