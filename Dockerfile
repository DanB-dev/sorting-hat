# Build Stage
FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production Stage
FROM node:bullseye-slim AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN apt-get update && apt-get -y upgrade && \
    npm install --production && \
    chown -R node:node /app

USER node

CMD ["node", "dist/index.js"]
