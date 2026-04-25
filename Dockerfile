FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev || npm install

COPY --from=build /app/dist ./dist
COPY vite.config.js ./

EXPOSE 4173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
