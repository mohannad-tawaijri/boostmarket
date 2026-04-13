# Google Sign-In Setup Guide (BoostMarket)

This guide explains the steps **you** (Mohannad) must perform to activate the Google Sign-In flow that has been implemented in the codebase.

All code changes are already done. You only need to:

1. Create a Google OAuth Client in Google Cloud Console
2. Add environment variables to Render (backend)
3. Run the database migration
4. Deploy

---

## 1. Create a Google OAuth Client

Go to https://console.cloud.google.com/ and log in with the Google account that owns **help@boostmarket.app** (or any account you want to manage the project with).

### 1.1 Create a project
- Top bar → project picker → **New Project**
- Name: `BoostMarket`
- Click **Create**

### 1.2 Configure the OAuth consent screen
- Left menu → **APIs & Services** → **OAuth consent screen**
- User type: **External** → Create
- Fill in:
  - **App name:** `BoostMarket`
  - **User support email:** `help@boostmarket.app`
  - **App logo:** (optional — upload your logo from `/public`)
  - **App domain → Application home page:** `https://boostmarket.app`
  - **App domain → Privacy policy:** `https://boostmarket.app/privacy`
  - **App domain → Terms of service:** `https://boostmarket.app/terms`
  - **Authorized domains:** `boostmarket.app`, `vercel.app`, `onrender.com`
  - **Developer contact email:** `help@boostmarket.app`
- Scopes → **Add or Remove Scopes** → check `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid` → Update
- Save and continue through the rest. Publish the app when ready (or leave in Testing mode and add your own email under Test users while developing).

### 1.3 Create OAuth 2.0 credentials
- Left menu → **APIs & Services** → **Credentials**
- **Create Credentials** → **OAuth client ID**
- Application type: **Web application**
- Name: `BoostMarket Web`
- **Authorized JavaScript origins:**
  - `https://boostmarket.app`
  - `https://boost-rosy-rho.vercel.app`
  - `http://localhost:3000`
- **Authorized redirect URIs:**
  - `https://boost-api-16ta.onrender.com/auth/google/callback`
  - `http://localhost:3001/auth/google/callback`
- Click **Create**. Copy the **Client ID** and **Client Secret** — you'll need them in step 2.

---

## 2. Environment variables

### 2.1 Backend (Render)

Add these to the `boost-api-16ta` Render service → **Environment** tab:

```
GOOGLE_CLIENT_ID=<the Client ID from step 1.3>
GOOGLE_CLIENT_SECRET=<the Client Secret from step 1.3>
GOOGLE_CALLBACK_URL=https://boost-api-16ta.onrender.com/auth/google/callback
FRONTEND_URL=https://boostmarket.app
```

> `FRONTEND_URL` may already exist — if so, make sure it points to your production frontend.

### 2.2 Backend (local dev, `backend/.env`)

```
GOOGLE_CLIENT_ID=<same Client ID>
GOOGLE_CLIENT_SECRET=<same Client Secret>
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### 2.3 Frontend

No new variables needed. The frontend already uses `NEXT_PUBLIC_API_URL` for dev; in production it hits the backend directly at `https://boost-api-16ta.onrender.com` for the OAuth kickoff (configured in `src/lib/config.ts`).

---

## 3. Database migration

A new migration is included at:
`backend/prisma/migrations/20260413120000_add_google_auth/migration.sql`

It adds `googleId` (unique) and `authProvider` columns to the `users` table.

### Run it:

```bash
# Locally
cd backend
npx prisma migrate dev

# Production — happens automatically on next Render deploy
# (start command: npx prisma migrate deploy && node dist/main)
```

---

## 4. Deploy

- Commit everything and push to `main`
- Vercel auto-deploys the frontend
- Render auto-deploys the backend (which runs the migration)

---

## 5. How the flow works

1. User clicks **"المتابعة باستخدام Google"** on `/login` or `/register`
2. Browser redirects to `{BACKEND_URL}/auth/google`
3. Backend (Passport) redirects to Google's consent screen
4. User consents → Google redirects to `{BACKEND_URL}/auth/google/callback?code=...`
5. Backend exchanges code for profile, calls `validateOrCreateGoogleUser()`:
   - If `googleId` matches → existing user signs in
   - Else if `email` matches an existing local account → Google is linked to it
   - Else a new user is created (`authProvider: 'google'`, no password, `verified: true`)
6. Backend mints a JWT + refresh token, then redirects to `{FRONTEND_URL}/auth/google/callback?token=...&refreshToken=...&user=...`
7. Frontend `/auth/google/callback` page reads the query params, stores them via `useAuth().login()`, and redirects to `/`

---

## 6. Files changed / created

### Backend
- `backend/prisma/schema.prisma` — added `googleId`, `authProvider` fields to `User`
- `backend/prisma/migrations/20260413120000_add_google_auth/migration.sql`
- `backend/src/auth/strategies/google.strategy.ts` *(new)*
- `backend/src/auth/auth.service.ts` — added `validateOrCreateGoogleUser()`
- `backend/src/auth/auth.controller.ts` — added `GET /auth/google` and `GET /auth/google/callback`
- `backend/src/auth/auth.module.ts` — registered `GoogleStrategy`

### Frontend
- `src/lib/config.ts` — added `BACKEND_URL` export for full-page OAuth redirects
- `src/app/login/page.tsx` — added Google button
- `src/app/register/page.tsx` — added Google button
- `src/app/auth/google/callback/page.tsx` *(new)* — handles the redirect back from the backend

---

## 7. Common pitfalls

- **redirect_uri_mismatch** → The callback URL in Google Cloud Console must match `GOOGLE_CALLBACK_URL` exactly (protocol, host, path, trailing slash all matter).
- **"Access blocked: App not verified"** → While in Testing mode, Google will only let approved test users sign in. Either publish the app or add testers in the consent screen.
- **User created but can't sign in with password later** → That's by design. Google-only users have no password. Direct them to the "Forgot password" flow to set one if they want local login.
- **CORS errors on callback** → The callback is a full-page redirect, not an XHR, so CORS doesn't apply. If you see CORS errors, something else is wrong (check console).
