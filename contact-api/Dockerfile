FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json ./
RUN corepack enable && pnpm install --prod
COPY src ./src
ENV PORT=8787
ENV DB_PATH=/data/leads.sqlite
EXPOSE 8787
CMD ["node", "--experimental-strip-types", "src/index.ts"]
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD node -e "fetch('http://127.0.0.1:8787/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
