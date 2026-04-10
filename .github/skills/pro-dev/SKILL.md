---
name: pro-dev
description: "Professional full-stack development and UI/UX expertise for BoostMarket. USE FOR: implementing UI components with best practices, reviewing and improving UI/UX code, full-stack feature implementation, design system consistency enforcement, accessibility audits, responsive design, Next.js pages, NestJS APIs, Prisma models. DO NOT USE FOR: infrastructure, deployment, or DevOps tasks."
argument-hint: "Describe the feature, component, or improvement you need"
---

# Professional Developer & UI/UX Expert

Full-stack engineering skill for BoostMarket — a gaming services marketplace built with Next.js 16 (App Router), NestJS, Prisma, Tailwind CSS, and TypeScript.

## When to Use

- Building new pages, components, or features end-to-end
- Implementing or refactoring UI components with proper design patterns
- Reviewing existing code for UX, accessibility, or quality issues
- Enforcing design system consistency (colors, spacing, typography, motion)
- Creating NestJS API endpoints, services, and DTOs
- Adding or modifying Prisma models and relations

## Procedure

### Phase 1 — Understand the Request

1. Clarify what the user needs: new feature, component, improvement, or review
2. Identify affected layers: frontend only, backend only, or full-stack
3. Check existing code in the relevant area to understand current patterns

### Phase 2 — Plan

1. Break the work into discrete tasks (UI component, API route, database model, etc.)
2. Identify dependencies between tasks
3. For UI work, determine:
   - Which existing components to reuse (check `src/components/ui/`)
   - Layout structure and responsive breakpoints
   - Color tokens and design variables to use
   - Accessibility requirements (ARIA, keyboard navigation, focus management)

### Phase 3 — Implement

Follow the conventions in the reference files:
- [Frontend Conventions](./references/frontend.md) — component structure, styling, state, data fetching
- [Backend Conventions](./references/backend.md) — modules, controllers, services, DTOs, Prisma
- [UI/UX Standards](./references/ui-ux.md) — accessibility, responsive design, motion, design tokens

### Phase 4 — Validate

1. **Code quality**: TypeScript strict mode compliance, no `any` types on frontend
2. **UI/UX checklist**:
   - Responsive at all breakpoints (mobile-first)
   - RTL support preserved (`dir="rtl"`, Arabic text renders correctly)
   - Dark mode works (uses CSS variable tokens, not hardcoded colors)
   - Hover/focus/active states on all interactive elements
   - Loading and empty states handled
   - Error states with user-friendly messages
3. **Accessibility**:
   - Semantic HTML elements (`nav`, `main`, `section`, `button`, not `div` for everything)
   - ARIA labels on icons and non-text interactive elements
   - Keyboard navigable (tab order, Enter/Space activation, Escape to close)
   - Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
   - Focus visible indicators present
4. **Backend**:
   - DTOs validate all user input with class-validator
   - Proper HTTP status codes and NestJS exceptions
   - Guards on protected routes
   - Prisma includes/selects are minimal (no over-fetching)
5. **Security**: No secrets in client code, XSS-safe rendering, CSRF-safe API calls
