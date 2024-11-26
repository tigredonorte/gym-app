FROM node:20.17.0-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.12.0

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx nx build gym-web-app --prod

# runtime stage
FROM nginx:1.27.2-alpine3.20-perl AS runtime

COPY --from=build /app/dist/apps/gym-web-app /usr/share/nginx/html

EXPOSE 80

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

CMD ["nginx", "-g", "daemon off;"]
