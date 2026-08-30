# LMS Dynamic Auto-Refreshing QR Absensi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement dynamic auto-refreshing QR code attendance system for classes, rotating every 30 seconds on Admin screen with grace period for smooth attendance scanning.

**Architecture:** Extend `panel-qr.tsx` with animated countdown timer and auto-refresh engine; update server actions and token validation to support 30s rotation intervals and 15s grace periods.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Prisma, jsQR, Playwright, Vitest.

---

### Task 1: Update Panel QR Admin UI with Auto-Rotation Countdown & Controls
**Files:**
- Modify: `src/app/(dashboard)/admin/absensi/panel-qr.tsx`
- Modify: `src/app/(dashboard)/admin/absensi/aksi.ts`

- [ ] **Step 1: Add Countdown Timer, Progress Bar, & Auto-Refresh Hook to `panel-qr.tsx`**
- [ ] **Step 2: Add Auto-Rotate toggle switch in Admin Panel**
- [ ] **Step 3: Test with typecheck and manual build check**

---

### Task 2: Update Domain Service for Dynamic Interval & Tolerant Expiry
**Files:**
- Modify: `src/lib/layanan/token-absensi.ts`
- Modify: `src/lib/layanan/absensi.ts`

- [ ] **Step 1: Add default 30-second token duration support**
- [ ] **Step 2: Add 15-second grace period verification logic**
- [ ] **Step 3: Run unit tests via `npx vitest run src/lib/layanan/token-absensi.test.ts`**

---

### Task 3: End-to-End Verification with Playwright
**Files:**
- Modify: `e2e/absensi.spec.ts`

- [ ] **Step 1: Update Playwright test to verify dynamic auto-refreshing QR interval and scan verification**
- [ ] **Step 2: Run full test suite `npx playwright test`**
