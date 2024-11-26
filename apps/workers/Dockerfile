FROM node:20.17.0-alpine AS worker-base

WORKDIR /build

RUN apk add --no-cache bash curl gnupg python3 make g++ && \
    npm install -g pnpm@9.12.0 && \
    curl -Ls https://cli.doppler.com/install.sh | sh

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx nx build workers --prod

FROM node:20.17.0-alpine

WORKDIR /app

RUN apk add --no-cache bash curl gnupg python3 make g++ && \
    npm install -g pnpm@9.9.0 && \
    curl -Ls https://cli.doppler.com/install.sh | sh && \
    npm install -g pm2 # Install PM2

COPY --from=worker-base /build/dist/apps/workers ./
COPY --from=worker-base /build/node_modules ./node_modules
COPY --from=worker-base /build/package.json ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["doppler", "run", "--", "pm2-runtime", "main.js"]
