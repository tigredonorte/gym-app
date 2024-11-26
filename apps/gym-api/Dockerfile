FROM node:20.17.0-alpine AS builder

WORKDIR /build

RUN apk add --no-cache bash curl gnupg python3 make g++ && \
    npm install -g pnpm@9.12.0 && \
    curl -Ls https://cli.doppler.com/install.sh | sh

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx nx build gym-api --prod

# runtime stage
FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache bash curl gnupg python3 make g++ && \
    npm install -g pnpm@9.9.0 && \
    curl -Ls https://cli.doppler.com/install.sh | sh && \
    npm install -g pm2 # Install PM2

COPY --from=builder /build/dist/apps/gym-api ./
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["doppler", "run", "--", "pm2-runtime", "main.js"]
