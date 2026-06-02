# syntax=docker/dockerfile:1

# ── Stage 1: build the Vite bundle ──────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite inlines env at build time — pass real values via --build-arg in prod.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

# ── Stage 2: serve static files via nginx ───────────────────────
FROM nginx:1.27-alpine AS runtime
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/healthz >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
