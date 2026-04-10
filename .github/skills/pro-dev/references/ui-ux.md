# UI/UX Standards

## Design Tokens

All colors use HSL CSS variables — never hardcode hex/rgb values.

| Token | Usage | Tailwind Class |
|-------|-------|----------------|
| `--primary` | Buttons, links, active states | `bg-primary`, `text-primary` |
| `--primary-foreground` | Text on primary background | `text-primary-foreground` |
| `--secondary` | Secondary actions | `bg-secondary` |
| `--accent` | Highlights, hover states | `bg-accent` |
| `--muted` | Subdued backgrounds | `bg-muted`, `text-muted-foreground` |
| `--destructive` | Errors, delete actions | `bg-destructive`, `text-destructive` |
| `--border` | Borders, dividers | `border-border` |
| `--background` | Page background | `bg-background` |
| `--foreground` | Primary text | `text-foreground` |

**Theme**: Violet primary (`hsl(250 60% 52%)` light / `hsl(250 60% 60%)` dark)

## Typography

- Font family: Noto Sans Arabic (supports both Latin and Arabic)
- Use Tailwind's type scale: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.
- Headings: `font-bold` or `font-semibold`
- Body text: `text-muted-foreground` for secondary, `text-foreground` for primary
- Line height: Tailwind defaults (no manual `leading-` needed unless dense layouts)

## Spacing

- Use Tailwind's spacing scale consistently: `p-4`, `gap-6`, `mb-8`
- Section padding: `py-16 md:py-24` for full-width sections
- Card padding: `p-6` standard, `p-4` compact
- Container max-width: `max-w-7xl mx-auto px-4`
- Gap between cards in grid: `gap-6`

## Component Patterns

### Cards
```tsx
<div className="glass-card rounded-xl p-6">
  {/* or solid-card for non-transparent */}
</div>
```

### Buttons
```tsx
<Button variant="default" size="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost" size="icon" aria-label="Close">
  <X className="h-4 w-4" />
</Button>
```

### Forms
```tsx
<label htmlFor="email" className="text-sm font-medium text-foreground">
  Email
</label>
<input
  id="email"
  type="email"
  required
  aria-describedby="email-error"
  className="w-full rounded-md border border-border bg-background px-3 py-2
             text-foreground placeholder:text-muted-foreground
             focus:outline-none focus:ring-2 focus:ring-primary"
/>
<p id="email-error" role="alert" className="text-sm text-destructive">
  {error}
</p>
```

### Loading States
```tsx
// Skeleton placeholder
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-muted rounded w-3/4" />
  <div className="h-4 bg-muted rounded w-1/2" />
</div>

// Spinner
<div className="flex items-center justify-center py-12">
  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
</div>
```

### Empty States
```tsx
<div className="text-center py-12">
  <IconComponent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold">No items found</h3>
  <p className="text-muted-foreground mt-1">Description of what to do next.</p>
  <Button className="mt-4">Call to Action</Button>
</div>
```

## Accessibility (WCAG AA)

### Semantic HTML
- Use `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>` — not divs for everything
- `<button>` for actions, `<a>` for navigation — never `<div onClick>`
- Headings in order: `h1` → `h2` → `h3` (no skipping levels)
- Lists for groups of related items: `<ul>` / `<ol>`

### Keyboard Navigation
- All interactive elements reachable via Tab
- Enter/Space activates buttons and links
- Escape closes modals/dropdowns
- Arrow keys navigate within menus/tabs
- Focus trap inside modals (focus doesn't escape to background)
- Visible focus indicator: `focus:ring-2 focus:ring-primary focus:outline-none`

### ARIA
- `aria-label` on icon-only buttons: `<Button aria-label="Close menu">`
- `aria-expanded` on toggle buttons (menu openers, accordions)
- `aria-hidden="true"` on decorative icons
- `role="alert"` on error messages for screen reader announcement
- `aria-describedby` linking inputs to their error messages
- `aria-live="polite"` for dynamic content updates (toast notifications)

### Color & Contrast
- Text on background: minimum 4.5:1 ratio (AA standard)
- Large text (18px+ bold or 24px+): minimum 3:1
- Never convey information by color alone — add icons or text labels
- Interactive element boundaries visible in both light and dark modes

## Motion & Transitions

- Use Tailwind transitions: `transition-colors duration-200`, `transition-transform`
- Hover effects: subtle scale or color change, not dramatic movement
- Respect `prefers-reduced-motion`:
  ```tsx
  className="motion-safe:transition-transform motion-safe:hover:scale-105"
  ```
- Loading animations: `animate-pulse` for skeletons, `animate-spin` for spinners

## Dark Mode

- All components must work in both light and dark themes
- Dark mode is activated via `.dark` class on `<html>`
- Use only CSS variable tokens — they auto-switch between themes
- Test both modes: ensure borders, shadows, and text are visible
- Avoid `bg-white` or `bg-black` — use `bg-background` and `text-foreground`

## Responsive Checklist

- [ ] Works at 320px width (smallest mobile)
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Text is readable without horizontal scrolling
- [ ] Navigation collapses to hamburger menu on mobile
- [ ] Images and media scale properly
- [ ] Tables scroll horizontally or stack on mobile
- [ ] Modals are full-screen on mobile, centered on desktop
