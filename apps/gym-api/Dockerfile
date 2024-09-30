FROM node:18-alpine AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y ncat

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.9.0

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx nx build gym-api --prod

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/apps/gym-api .
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

CMD ["node", "main"]