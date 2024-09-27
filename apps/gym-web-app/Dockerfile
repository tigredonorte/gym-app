FROM node:18 AS buildImg

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.9.0

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx nx build gym-web-app --prod

FROM nginx:alpine AS runtime

COPY --from=buildImg /app/dist/apps/gym-web-app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
