# build
FROM node:18 AS buildImg
WORKDIR /app
RUN npm install -g pnpm@8.8.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN npx nx build gym-web-app --prod

# Runtime stage
FROM nginx:alpine AS runtime
COPY --from=buildImg /app/dist/apps/gym-web-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
