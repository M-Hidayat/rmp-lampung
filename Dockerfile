# Build context untuk RMP Lampung (Next.js 15, App Router).
# Rahasia TIDAK pernah masuk image: hanya diberikan saat runtime lewat
# environment Compose. Tidak ada NEXT_PUBLIC_* di aplikasi ini, jadi builder
# tidak memerlukan argumen apa pun.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Devdependencies ikut dipasang karena `next build` melakukan typecheck dan
# tsconfig meng-include seluruh *.ts (termasuk e2e/ dan playwright.config.ts).
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Healthcheck memakai route publik yang murah agar Compose bisa menunggu
# aplikasi benar-benar siap sebelum nginx diarahkan ke sini.
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
	CMD node -e "fetch('http://127.0.0.1:3000/masuk').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
