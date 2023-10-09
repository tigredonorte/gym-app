FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm@8.8.0

RUN pnpm install --frozen-lockfile

RUN npx nx build gym-api

EXPOSE 3000

CMD ["node", "dist/apps/gym-api/main"]