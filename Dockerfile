# ========================================
# ResumeCraft — 多阶段 Docker 构建
# ========================================

# ---- Stage 1: Build (skip if dist/ already populated) ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# 仅在 dist/ 为空时执行构建（CI 环境已预构建）
RUN if [ -z "$(ls -A dist 2>/dev/null)" ]; then npm run build; fi

# ---- Stage 2: Serve ----
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    location /assets { expires 1y; add_header Cache-Control "public, immutable"; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
