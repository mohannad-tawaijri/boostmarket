# Frontend Conventions

## Component Structure

```
"use client";  // Required for interactive components (hooks, event handlers)

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Props { /* typed props, no `any` */ }

export default function ComponentName({ prop1, prop2 }: Props) {
  // hooks first
  // handlers next
  // derived state
  // return JSX
}
```

**Rules:**
- Functional components only, default exports
- `"use client"` directive at top of any component using hooks or browser APIs
- Server components by default (no directive) for pages that only fetch data
- Props defined via `interface`, never `any`
- Hooks at the top, event handlers below hooks, derived values next, JSX last

## Styling

- **Tailwind CSS** is the only styling approach — no CSS modules, no inline styles
- Use the `cn()` utility from `@/lib/utils` for conditional/merged classes:
  ```tsx
  <div className={cn("base-classes", isActive && "active-classes", className)} />
  ```
- **Never hardcode colors** — always use CSS variable tokens:
  - `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-muted-foreground`
  - `border-border`, `bg-accent`, `text-destructive`
- For custom effects, use the utility classes from `globals.css`:
  - `.glass-card` — glassmorphic card with backdrop-blur
  - `.solid-card` — solid background card with hover effect
  - `.section-alt`, `.section-dark` — gradient section backgrounds
- **Border radius**: use `rounded-lg`, `rounded-md`, `rounded-sm` (mapped to `--radius`)

## Responsive Design

- **Mobile-first**: start with mobile layout, add breakpoints upward
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Common patterns:
  ```tsx
  // Grid: 1 col mobile → 2 cols tablet → 3 cols desktop
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

  // Stack → row
  <div className="flex flex-col md:flex-row gap-4">

  // Hide on mobile, show on desktop
  <div className="hidden md:block">
  ```

## RTL Support

- The app uses `dir="rtl"` — all layouts must work right-to-left
- Use logical properties: `ms-4` / `me-4` instead of `ml-4` / `mr-4`
- Use `start` / `end` instead of `left` / `right` for text-align and positioning
- Font: Noto Sans Arabic is the global font

## State Management

- **React Context** for global state — no Redux or Zustand
- Two existing contexts (do not duplicate):
  - `useAuth()` from `@/contexts/auth-context` — user, login, logout, tokens
  - `useSocket()` from `@/contexts/socket-context` — real-time messaging
- Local state with `useState` for component-level concerns
- `useCallback` for handlers passed to children
- `useRef` for values that shouldn't trigger re-renders

## Data Fetching

- Use `fetch()` with the API URL from `@/lib/config`:
  ```tsx
  import { API_URL } from "@/lib/config";

  const res = await fetch(`${API_URL}/endpoint`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  ```
- Get token from `useAuth().getAccessToken()`
- Handle loading, error, and empty states in every data-fetching component

## Icons

- **Lucide React** exclusively — import individual icons:
  ```tsx
  import { Search, User, ShoppingCart } from "lucide-react";
  ```
- Always add `aria-hidden="true"` on decorative icons
- Add `aria-label` on icon-only buttons

## UI Components

- Reuse components from `src/components/ui/` (Button, Dialog, Tabs, DropdownMenu)
- Button variants via CVA: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Button sizes: `default`, `sm`, `lg`, `icon`
- Use `asChild` prop (Radix Slot) when button wraps a link/anchor

## Path Aliases

- `@/` maps to `src/` — use for all imports:
  ```tsx
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib/utils";
  import type { Service } from "@/types";
  ```

## Type Definitions

- Shared types live in `src/types/index.ts`
- Import with `import type { ... }` for type-only imports
- Key enums: `ServiceCategory`, `OrderStatus`, `OfferStatus`, `UserRole`
