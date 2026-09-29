FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location /_astro/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location / { try_files $uri $uri/ $uri.html /404.html; }
  error_page 404 /404.html;
}
NGINX
COPY --from=build /app/dist /usr/share/nginx/html
