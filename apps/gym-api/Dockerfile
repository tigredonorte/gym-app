FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm@9.9.0

RUN pnpm install --frozen-lockfile

RUN npx nx build gym-api

EXPOSE 3000

CMD ["node", "dist/apps/gym-api/main"]