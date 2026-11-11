FROM node:24.12.0-bookworm-slim AS build

WORKDIR /app
ENV CI=1 \
    EXPO_NO_TELEMETRY=1 \
    EXPO_NO_DOTENV=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY App.js index.js app.json app.config.js metro.config.js tsconfig.json ./
COPY src ./src
COPY assets ./assets
COPY roble ./roble

RUN npx expo export --platform web --output-dir /out \
    && npm run roble:build \
    && cp -r dist/roble /out/roble

FROM nginx:stable-alpine AS preview
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1
