FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN npx nx build gym-api

EXPOSE 3000

CMD ["node", "dist/apps/gym-api/main"]