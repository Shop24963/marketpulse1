FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY workers/package.json workers/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install
FROM deps AS build
COPY . .
RUN npm run build
FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app .
CMD ["npm", "run", "start", "--workspace", "@marketpulse/backend"]
