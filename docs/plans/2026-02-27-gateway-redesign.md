# Gateway Redesign Implementation Plan

> **For Claude:** Use subagent-driven development to implement this plan.

**Goal:** Build a full-featured Slack/Teams-like admin portal with Tailwind CSS and ShadCN components.

**Architecture:** Next.js 15 with App Router, Tailwind CSS for styling, ShadCN for components, proper auth flow.

**Tech Stack:** Next.js 15, Tailwind CSS, ShadCN, TypeScript

---

## Task 1: Setup Tailwind & ShadCN

**Files:**
- Modify: `packages/gateway/package.json`
- Create: `packages/gateway/tailwind.config.ts`
- Create: `packages/gateway/postcss.config.js`

**Step 1: Add Tailwind dependencies**

```bash
cd packages/gateway
pnpm add tailwindcss postcss autoprefixer @tailwindcss/forms
pnpm add -D @types/node
```

**Step 2: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

**Step 3: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Step 4: Add globals.css**

Create `src/app/globals.css` with Tailwind directives.

**Step 5: Commit**

```bash
git add .
git commit -m "feat(gateway): setup Tailwind CSS"
```

---

## Task 2: Create Layout Components

**Files:**
- Create: `packages/gateway/src/components/admin-sidebar.tsx`
- Create: `packages/gateway/src/components/admin-header.tsx`
- Create: `packages/gateway/src/components/ui/button.tsx`
- Create: `packages/gateway/src/components/ui/input.tsx`
- Create: `packages/gateway/src/components/ui/card.tsx`

**Step 1: Create UI components**

- Button with variants (primary, secondary, ghost, etc.)
- Input component
- Card component

**Step 2: Create sidebar**

- Logo at top
- Navigation links: Dashboard, Agents, Channels, Settings, Memory
- Collapsible on mobile

**Step 3: Create header**

- Page title
- User info
- Logout button

**Step 4: Commit**

---

## Task 3: Create Admin Pages

**Files:**
- Create: `packages/gateway/src/app/admin/layout.tsx`
- Move: `packages/gateway/src/app/admin/page.tsx` (from dashboard)
- Create: `packages/gateway/src/app/admin/agents/page.tsx`
- Create: `packages/gateway/src/app/admin/channels/page.tsx`
- Create: `packages/gateway/src/app/admin/settings/page.tsx`

**Step 1: Create admin layout**

Wrap all /admin/* pages with sidebar + header.

**Step 2: Create main dashboard page**

- Overview cards (agents, channels, memory)
- Quick actions

**Step 3: Create agents page**

- List agents
- Add/edit/delete agents
- Agent configuration form

**Step 4: Create channels page**

- List channels
- Enable/disable channels

**Step 5: Create settings page**

- Update API key
- Update password
- Domain settings

**Step 6: Commit**

---

## Task 4: Add Icons & Polish

**Files:**
- Add: `lucide-react` icons
- Enhance UI with proper spacing, colors

**Step 1: Install icons**

```bash
cd packages/gateway
pnpm add lucide-react
```

**Step 2: Add icons to navigation and pages**

**Step 3: Commit**

---

## Summary

This plan creates a full admin portal with:
1. Tailwind + ShadCN setup
2. Reusable UI components
3. Admin layout with sidebar + header
4. Dashboard, Agents, Channels, Settings pages
5. Professional icons and styling
